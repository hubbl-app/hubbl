import { compare, genSalt, hash } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Gym, Owner } from '@hubbl/shared/models/entities';
import * as helpers from '@hubbl/shared/models/helpers';
import { AppTheme, Gender } from '@hubbl/shared/types';

import GymDTO from '../Gym';
import { PersonDTOGroups } from '../Person';
import * as Util from '../util';
import OwnerDTO from './Owner';

jest.mock('@hubbl/shared/models/helpers');

describe('OwnerDTO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJSON', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = Util.createPersonJson();

      const result = await OwnerDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(OwnerDTO);
      // Check fields
      expect(result.id).toBe(json.id);
      expect(result.email).toBe(json.email);
      expect(result.password).toBe(json.password);
      expect(result.firstName).toBe(json.firstName);
      expect(result.lastName).toBe(json.lastName);
      expect(result.phone).toBe(json.phone);
      expect(result.theme).toBe(json.theme);
      expect(result.gym).toBe(json.gym);
      expect(result.gender).toBe(json.gender);
      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalled();
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: ['any']
      });
    });

    it('should not create the DTO if fromJson is not valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(helpers, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await OwnerDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });

    it('should call GymDTO.fromJson on register', async () => {
      const gymFromJsonSpy = jest
        .spyOn(GymDTO, 'fromJson')
        .mockResolvedValue({} as any);
      const json = Util.createPersonJson();

      jest.spyOn(ClassValidator, 'validateOrReject').mockResolvedValue({
        catch: jest.fn().mockImplementation()
      } as any);

      const result = await OwnerDTO.fromJson(json, PersonDTOGroups.REGISTER);

      // Should have added a code
      expect((result.gym as Gym)?.code).toBeDefined();
      expect(gymFromJsonSpy).toHaveBeenCalledTimes(1);
      expect(gymFromJsonSpy).toHaveBeenCalledWith(
        json.gym,
        PersonDTOGroups.REGISTER
      );
    });

    it('should call GymDTO.fromJson on register with empty object if json.gym is undefined', async () => {
      const gymFromJsonSpy = jest
        .spyOn(GymDTO, 'fromJson')
        .mockRejectedValue('error-thrown');
      const json = Util.createPersonJson();
      json.gym = undefined;

      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');

      expect.assertions(4);

      try {
        await OwnerDTO.fromJson(json, PersonDTOGroups.REGISTER);
      } catch (e) {
        expect(e).toBe('error-thrown');
      }

      expect(gymFromJsonSpy).toHaveBeenCalledTimes(1);
      expect(gymFromJsonSpy).toHaveBeenCalledWith({}, PersonDTOGroups.REGISTER);
      expect(vorSpy).not.toHaveBeenCalled();
    });
  });

  describe('#fromClass', () => {
    it('should create an OwnerDTO from a correct Owner', async () => {
      const password = await hash('testpwd00', await genSalt(10));

      const owner = new Owner();
      owner.person = Util.createPerson(password);

      const gymFromClassSpy = jest.spyOn(GymDTO, 'fromClass').mockReturnValue({
        ...(owner.person.gym as Gym),
        toClass: jest.fn().mockReturnValue(owner.person.gym)
      });

      const result = OwnerDTO.fromClass(owner);

      expect(gymFromClassSpy).toHaveBeenCalledTimes(1);
      expect(gymFromClassSpy).toHaveBeenCalledWith(owner.person.gym);
      expect(result.id).toBe(1);
      expect(result.email).toBe('test@user.com');
      expect(result.password).toBe(password);
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
      expect(result.phone).toBe('000 000 000');
      expect(result.theme).toBe(AppTheme.LIGHT);
      expect(result.gender).toBe(Gender.OTHER);
      expect(result.gym).toBeInstanceOf(Gym);
    });
  });

  describe('#toClass', () => {
    it('should return an owner', async () => {
      // Set up class
      const dto = Util.createPersonDTO<OwnerDTO<Gym | number>>(OwnerDTO);

      const result = await dto.toClass();

      expect(result.person.id).toBe(dto.id);
      expect(result.person.email).toBe(dto.email);
      expect(result.person.firstName).toBe(dto.firstName);
      expect(result.person.lastName).toBe(dto.lastName);
      expect(result.person.phone).toBe(dto.phone);
      expect(result.person.theme).toBe(dto.theme);
      expect(result.person.gym).toBe(dto.gym);
      expect(result.person.gender).toBe(dto.gender);
      expect(result.personId).toBe(dto.id);
      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
