import * as jwt from 'jsonwebtoken';
import * as log from 'npmlog';

import { PersonDTOGroups } from '@hubbl/shared/models/dto';

import BaseController from '../../Base';
import { register, trainerRegister } from './register';

// Manually set the environment variable
process.env.NX_JWT_TOKEN = 'test-secret-token';

describe('register', () => {
  const mockReq = { body: {} } as any;
  const mockPerson = {
    person: {
      id: 1,
      email: 'test@user.com',
      password: '123456',
      gym: { id: 1 }
    }
  } as any;
  const mockDTO = {
    ...mockPerson.person,
    toClass: jest.fn()
  } as any;
  let mockManager: any;

  const mockFromJson = jest.fn().mockResolvedValue(mockDTO);
  const mockFromClass = jest.fn().mockReturnValue(mockDTO);
  const mockController = {
    clientError: jest.fn(),
    created: jest.fn(),
    execute: jest.fn(),
    fail: jest.fn(),
    forbidden: jest.fn(),
    notFound: jest.fn(),
    ok: jest.fn(),
    run: jest.fn(),
    unauthorized: jest.fn()
  } as any;

  let jsonResSpy: any;
  let logSpy: any;

  const token = jwt.sign(
    { id: 1, email: 'test@user.com' },
    process.env.NX_JWT_TOKEN || 'test-secret-token'
  );

  /* HELPERS */

  const fromJsonFail = async (fromJson: any, cb: () => Promise<void>) => {
    await cb();

    expect(fromJson).toHaveBeenCalledTimes(1);
    expect(jsonResSpy).toHaveBeenCalledTimes(1);
    expect(jsonResSpy).toHaveBeenCalledWith({} as any, 400, 'error-thrown');
  };

  const serviceError = async (cb: () => Promise<void>) => {
    jsonResSpy.mockImplementation();

    await cb();

    expect(mockFromJson).toHaveBeenCalledTimes(1);
    expect(mockFromJson).toHaveReturned();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
    expect(mockController.fail).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledWith(
      {} as any,
      'Internal server error. If the problem persists, contact our team.'
    );
  };

  const createdError = async (
    fromJson: any,
    res: any,
    cb: () => Promise<void>
  ) => {
    mockController.created.mockImplementation(() => {
      throw new Error();
    });

    await cb();

    expect(fromJson).toHaveBeenCalledTimes(1);
    expect(fromJson).toHaveReturned();
    expect(mockDTO.toClass).toHaveBeenCalledTimes(1);
    expect(mockController.created).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledWith(
      res,
      'Internal server error. If the problem persists, contact our team.'
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockManager = { save: jest.fn().mockResolvedValue(mockPerson) };
    jsonResSpy = jest.spyOn(BaseController, 'jsonResponse');
    logSpy = jest.spyOn(log, 'error').mockImplementation();
  });

  describe('register', () => {
    describe('Successfull registrations', () => {
      let mockRes: any;
      let mockService: any;
      let jwtSpy: any;

      beforeEach(() => {
        jest.clearAllMocks();

        mockRes = {
          json: jest.fn().mockReturnThis(),
          status: jest.fn().mockReturnThis(),
          cookie: jest.fn()
        } as any;
        mockService = {
          manager: {
            transaction: jest.fn().mockImplementation(async (cb) => {
              await cb(mockManager);

              return mockPerson;
            })
          }
        } as any;
        jwtSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token as any);
      });

      const commonChecks = (savesTimes = 1, alias = 'any') => {
        // Check spies
        expect(mockService.manager.transaction).toHaveBeenCalledTimes(1);
        expect(mockManager.save).toHaveBeenCalledTimes(savesTimes);
        expect(mockController.created).toHaveBeenCalledTimes(1);
        expect(mockController.created).toHaveBeenCalledWith(mockRes, {
          token,
          [alias]: expect.anything()
        });
        expect(mockFromJson).toHaveBeenCalledWith({}, 'register');
        expect(mockFromClass).toHaveBeenCalledTimes(1);
        expect(jwtSpy).toHaveBeenCalledTimes(2);
        expect(jwtSpy).toHaveBeenNthCalledWith(
          1,
          { id: 1, email: 'test@user.com', user: alias },
          process.env.NX_JWT_TOKEN,
          { expiresIn: '15m' }
        );
        expect(jwtSpy).toHaveBeenNthCalledWith(
          2,
          { id: 1, email: 'test@user.com', user: alias },
          process.env.NX_JWT_TOKEN,
          { expiresIn: '30d' }
        );
        // Ensure cookie is set
        expect(mockRes.cookie).toBeCalledWith('__hubbl-refresh__', token, {
          sameSite: 'none',
          secure: true,
          httpOnly: true,
          path: '/',
          maxAge: 30 * 24 * 60 * 60 * 1000
        });
        // Check result
        expect(mockController.created).toHaveBeenCalledTimes(1);
        // Should return the DTO with the token
        expect(mockController.created).toHaveBeenCalledWith(mockRes, {
          token,
          [alias]: mockDTO
        });
      };

      it('should save the person and call created with the token and the person', async () => {
        await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: mockRes,
          alias: 'any' as any
        });

        commonChecks();
        // Specific checks
        expect(mockFromClass).toHaveBeenCalledWith(mockPerson);
      });

      it('should save the person and call created with the token, the person and a Gym', async () => {
        await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: mockRes,
          alias: 'any' as any
        });

        commonChecks();
        // Specific checks
        expect(mockFromClass).toHaveBeenCalledWith(mockPerson);
      });

      it('should call save twice when registering an owner', async () => {
        await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: mockRes,
          alias: 'owner'
        });

        commonChecks(2, 'owner');
      });
    });

    it('should send a 400 code on fromJson validation error', async () => {
      jsonResSpy.mockImplementation();
      const mockService = { save: jest.fn() } as any;
      const mockFailFromJson = jest.fn().mockImplementation(() => {
        throw 'error-thrown';
      });

      await fromJsonFail(mockFailFromJson, async () => {
        await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFailFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: {} as any,
          alias: 'any' as any
        });
      });
    });

    it('should send a fail on service error', async () => {
      const mockService = {
        save: jest.fn().mockRejectedValue(mockPerson)
      } as any;

      serviceError(async () => {
        await await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: {} as any,
          alias: 'any' as any
        });
      });
    });

    it('should send a fail if NX_JWT_TOKEN is not set', async () => {
      delete process.env.NX_JWT_TOKEN;

      const mockService = {
        manager: {
          transaction: jest.fn().mockImplementation((cb) => {
            cb(mockManager);
            return mockPerson;
          })
        }
      } as any;

      await register({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: {} as any,
        alias: 'any' as any
      });

      expect(mockFromJson).toHaveBeenCalledTimes(1);
      expect(mockService.manager.transaction).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledWith(
        {} as any,
        'Internal server error. If the problem persists, contact our team.'
      );
    });

    it('should send forbidden if email already in use', async () => {
      const mockRes = { cookie: jest.fn() } as any;

      const mockService = {
        manager: {
          transaction: jest.fn().mockImplementation((cb) => {
            cb(mockManager);
            return mockPerson;
          })
        }
      } as any;
      const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token as any);

      mockController.created.mockImplementation(() => {
        throw 'Duplicate query constraint "person-email-idx"';
      });

      await register({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: mockRes,
        alias: 'any' as any
      });

      expect(signSpy).toHaveBeenCalledTimes(2);
      expect(mockController.forbidden).toHaveReturnedTimes(1);
      expect(mockController.forbidden).toHaveBeenCalledWith(
        mockRes,
        'Email is already in use!'
      );
    });

    it('should send a fail on created error', async () => {
      const mockRes = { cookie: jest.fn() } as any;

      const mockService = {
        manager: {
          transaction: jest.fn().mockImplementation((cb) => {
            cb(mockManager);
            return mockPerson;
          })
        }
      } as any;
      const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token as any);

      mockController.created.mockImplementation(() => {
        throw new Error();
      });

      await createdError(mockFromJson, mockRes, async () => {
        await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: mockRes,
          alias: 'any' as any
        });
      });

      expect(signSpy).toHaveBeenCalledTimes(2);
      // Ensure cookie is set
      expect(mockRes.cookie).toBeCalledWith('__hubbl-refresh__', token, {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
    });
  });

  describe('trainerRegister', () => {
    it('should save a trainer', async () => {
      const mockRes = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        cookie: jest.fn()
      } as any;
      const mockService = {
        save: jest.fn().mockResolvedValue(mockPerson)
      } as any;
      mockDTO.toClass.mockResolvedValue(mockPerson);

      await trainerRegister({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: mockRes
      });

      expect(mockFromJson).toHaveBeenCalledTimes(1);
      expect(mockFromJson).toHaveBeenCalledWith({}, PersonDTOGroups.REGISTER);
      expect(mockDTO.toClass).toHaveBeenCalledTimes(1);
      expect(mockService.save).toHaveBeenCalledTimes(1);
      expect(mockService.save).toHaveBeenCalledWith(mockPerson);
      expect(mockController.created).toHaveBeenCalledTimes(1);
      expect(mockController.created).toHaveBeenCalledWith(mockRes, {
        trainer: mockDTO
      });
    });

    it('should send a 400 code on fromJson validation error', async () => {
      const mockService = {
        save: jest.fn().mockRejectedValue(mockPerson)
      } as any;
      const mockFailFromJson = jest.fn().mockImplementation(() => {
        throw 'error-thrown';
      });

      await fromJsonFail(mockFailFromJson, async () => {
        await trainerRegister({
          service: mockService,
          controller: mockController,
          fromJson: mockFailFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: {} as any
        });
      });
    });

    it('should send forbidden if email already in use', async () => {
      const mockService = {
        save: jest
          .fn()
          .mockRejectedValue('Duplicate query constraint "person-email-idx"')
      } as any;
      jsonResSpy.mockImplementation();

      await trainerRegister({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: {} as any
      });

      expect(mockFromJson).toHaveBeenCalledTimes(1);
      expect(mockController.forbidden).toHaveBeenCalledTimes(1);
      expect(mockController.forbidden).toHaveBeenCalledWith(
        {} as any,
        'Email is already in use!'
      );
    });

    it('should send a fail on service error', async () => {
      const mockService = {
        save: jest.fn().mockRejectedValue(mockPerson)
      } as any;

      await serviceError(async () => {
        await trainerRegister({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: {} as any
        });
      });
    });

    it('should send a fail on created error', async () => {
      const mockService = {
        save: jest.fn().mockResolvedValue(mockPerson)
      } as any;

      await createdError(mockFromJson, {}, async () => {
        await trainerRegister({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: {} as any
        });
      });
    });
  });
});
