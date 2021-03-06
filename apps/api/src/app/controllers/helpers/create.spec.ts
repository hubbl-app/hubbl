import * as log from 'npmlog';

import { Owner, Worker } from '@hubbl/shared/models/entities';

import { BaseService } from '../../services';
import * as create from './create';

type CommonShouldCreateByProps = {
  service: BaseService<any>;
  ownerService?: BaseService<Owner>;
  workerService?: BaseService<Worker>;
  user: 'owner' | 'worker';
};

describe('create', () => {
  const mockEntity = { id: 1, argOne: 'ArgOne', argTwo: 'ArgTwo' };
  const mockEntityDto = {
    ...mockEntity,
    toClass: jest.fn().mockReturnValue(mockEntity)
  } as any;

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

  const logSpy = jest.spyOn(log, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const logAsserts = () => {
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
  };

  describe('createdByOwnerOrWorker', () => {
    let fromClassSpy: any;

    beforeEach(() => {
      jest.clearAllMocks();

      fromClassSpy = jest.fn();
    });

    describe('Successfull creates', () => {
      const shouldCreateBy = async ({
        service,
        ownerService = {} as any,
        workerService = {} as any,
        user
      }: CommonShouldCreateByProps) => {
        fromClassSpy.mockReturnValue(mockEntityDto);
        const saveSpy = jest
          .spyOn(service, 'save')
          .mockResolvedValue(mockEntity);
        const mockRes = {
          json: jest.fn().mockReturnThis(),
          status: jest.fn().mockReturnThis()
        } as any;

        await create.createdByOwnerOrWorker({
          controller: mockController,
          service: service,
          ownerService,
          workerService,
          res: mockRes,
          fromClass: fromClassSpy,
          dto: mockEntityDto,
          token: { id: 1, email: 'test@user.com', user },
          entityName: 'VirtualGym',
          workerCreatePermission: 'any' as any
        });

        // Common checks
        expect(mockEntityDto.toClass).toHaveBeenCalledTimes(1);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(saveSpy).toHaveBeenCalledWith(mockEntity);
        expect(fromClassSpy).toHaveBeenCalledWith(mockEntity);
        expect(fromClassSpy).toHaveBeenCalledTimes(1);
        expect(mockController.created).toHaveBeenCalledTimes(1);
        expect(mockController.created).toHaveBeenCalledWith(
          mockRes,
          mockEntityDto
        );
      };

      it('should create by owner', async () => {
        const mockService = {
          count: jest.fn().mockResolvedValue(1),
          save: jest.fn()
        } as any;
        const mockOwnerService = {
          count: jest.fn().mockResolvedValue(1)
        } as any;

        await shouldCreateBy({
          service: mockService,
          ownerService: mockOwnerService,
          user: 'owner'
        });

        expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
      });

      it('should create by worker', async () => {
        const mockService = {
          count: jest.fn().mockResolvedValue(1),
          save: jest.fn()
        } as any;
        const mockWorkerService = {
          findOneBy: jest.fn().mockResolvedValue({ any: true })
        } as any;

        await shouldCreateBy({
          service: mockService,
          workerService: mockWorkerService,
          user: 'worker'
        });

        expect(mockWorkerService.findOneBy).toHaveBeenCalledTimes(1);
      });
    });

    it('should send fail if no workerCreatePermission passed', async () => {
      const mockWorkerService = { findOneBy: jest.fn() };

      await create.createdByOwnerOrWorker({
        controller: mockController,
        service: {} as any,
        workerService: mockWorkerService as any,
        ownerService: {} as any,
        res: {} as any,
        fromClass: fromClassSpy,
        token: { id: 1, email: 'test@user.com', user: 'worker' },
        dto: {} as any,
        entityName: 'any' as any
      });

      logAsserts();
      expect(mockController.fail).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledWith(
        {},
        'Internal server error. If the problem persists, contact our team.'
      );
      expect(mockWorkerService.findOneBy).not.toHaveBeenCalled();
    });

    it('should send unauthorized if worker updating does not exist', async () => {
      const mockWorkerService = {
        findOneBy: jest.fn().mockResolvedValue(null)
      };

      await create.createdByOwnerOrWorker({
        controller: mockController,
        service: {} as any,
        workerService: mockWorkerService as any,
        ownerService: {} as any,
        res: {} as any,
        fromClass: fromClassSpy,
        token: { id: 1, email: 'test@user.com', user: 'worker' },
        dto: {} as any,
        entityName: 'any' as any,
        workerCreatePermission: 'any' as any
      });

      expect(mockWorkerService.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockWorkerService.findOneBy).toHaveBeenCalledWith({ personId: 1 });
      expect(mockController.unauthorized).toHaveReturnedTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {},
        'Worker does not exist. Can not create the any.'
      );
    });

    it('should send unauthorized if worker does not have permissions to create', async () => {
      const mockWorkerService = {
        findOneBy: jest.fn().mockResolvedValue({ create: false })
      } as any;

      await create.createdByOwnerOrWorker({
        controller: mockController,
        service: {} as any,
        ownerService: {} as any,
        workerService: mockWorkerService,
        res: {} as any,
        fromClass: fromClassSpy,
        token: { id: 1, email: 'test@user.com', user: 'worker' },
        dto: {} as any,
        entityName: 'VirtualGym',
        workerCreatePermission: 'create' as any
      });

      expect(mockWorkerService.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockWorkerService.findOneBy).toHaveBeenCalledWith({ personId: 1 });
      expect(mockController.unauthorized).toHaveReturnedTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {},
        'Worker does not have enough permissions.'
      );
    });

    it('should send unauthorized if owner updating does not exist', async () => {
      const mockOwnerService = {
        count: jest.fn().mockResolvedValue(0)
      } as any;

      await create.createdByOwnerOrWorker({
        controller: mockController,
        service: {} as any,
        ownerService: mockOwnerService,
        workerService: {} as any,
        res: {} as any,
        fromClass: fromClassSpy,
        token: { id: 1, email: 'test@user.com', user: 'owner' },
        dto: {} as any,
        entityName: 'any' as any
      });

      expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
      expect(mockOwnerService.count).toHaveBeenCalledWith({
        where: { personId: 1 }
      });
      expect(mockController.unauthorized).toHaveReturnedTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {},
        'Owner does not exist. Can not create the any.'
      );
    });

    it('should send unauthorized if user is not owner nor worker', async () => {
      await create.createdByOwnerOrWorker({
        controller: mockController,
        service: {} as any,
        ownerService: {} as any,
        workerService: {} as any,
        res: {} as any,
        fromClass: fromClassSpy,
        token: { id: 1, email: 'test@user.com', user: 'client' },
        dto: {} as any,
        entityName: 'any' as any
      });

      expect(mockController.unauthorized).toHaveReturnedTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {},
        'Client can not perform such operation.'
      );
    });

    it('should send fail if on service.save error', async () => {
      const mockOwnerService = { count: jest.fn().mockResolvedValue(1) };
      const mockService = { save: jest.fn().mockRejectedValue('error-thrown') };

      await create.createdByOwnerOrWorker({
        controller: mockController,
        service: mockService as any,
        ownerService: mockOwnerService as any,
        workerService: {} as any,
        res: {} as any,
        fromClass: fromClassSpy,
        token: { id: 1, email: 'test@user.com', user: 'owner' },
        dto: mockEntityDto,
        entityName: 'any' as any
      });

      expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
      expect(mockService.save).toHaveBeenCalledTimes(1);
      logAsserts();
      expect(mockController.fail).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledWith(
        {},
        'Internal server error. If the problem persists, contact our team.'
      );
    });
  });

  describe('createByOwner', () => {
    it('should call createdByOwnerOrWorker', async () => {
      const cboowSpy = jest
        .spyOn(create, 'createdByOwnerOrWorker')
        .mockImplementation();

      await create.createdByOwner({
        service: {} as any,
        ownerService: {} as any,
        controller: mockController,
        res: {} as any,
        fromClass: {} as any,
        dto: mockEntityDto,
        token: { id: 1, email: 'test@user.com', user: 'owner' },
        entityName: 'Any' as any
      });

      expect(cboowSpy).toHaveBeenCalledTimes(1);
      expect(cboowSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        workerService: undefined,
        controller: mockController,
        res: {},
        fromClass: {},
        dto: mockEntityDto,
        token: { id: 1, email: 'test@user.com', user: 'owner' },
        entityName: 'Any'
      });
    });
  });
});
