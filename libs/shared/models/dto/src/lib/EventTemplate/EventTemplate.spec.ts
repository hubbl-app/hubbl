import * as ClassValidator from 'class-validator';

import { EventTemplate, EventType } from '@hubbl/shared/models/entities';
import * as helpers from '@hubbl/shared/models/helpers';

import EventTypeDTO from '../EventType';
import EventTemplateDTO from './EventTemplate';

jest.mock('@hubbl/shared/models/entities');
jest.mock('@hubbl/shared/models/helpers');

const propCompare = (
  want: EventTemplate | EventTemplateDTO,
  got: EventTemplate | EventTemplateDTO
) => {
  expect(got.id).toBe(want.id);
  expect(got.name).toBe(want.name);
  expect(got.description).toBe(want.description);
  expect(got.capacity).toBe(want.capacity);
  expect(got.covidPassport).toBe(want.covidPassport);
  expect(got.maskRequired).toBe(want.maskRequired);
  expect(got.difficulty).toBe(want.difficulty);
  expect(got.type).toStrictEqual(
    want.type instanceof EventType
      ? EventTypeDTO.fromClass(want.type)
      : want.type
  );
  expect(got.gym).toBe(want.gym);
};

describe('EventTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJson', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        id: 1,
        name: 'Virtual',
        description: 'Description',
        capacity: 10,
        covidPassport: true,
        maskRequired: true,
        difficulty: 3,
        type: 1,
        gym: 1
      };

      const result = await EventTemplateDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      propCompare(json as any, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.any(EventTemplateDTO), {
        validationError: { target: false },
        groups: ['any']
      });
    });

    it('should not create a DTO if json is not valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(helpers, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await EventTemplateDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create a EventTemplateDTO from a correct EventTemplate', () => {
      const eventTemplate = new EventTemplate();
      const eventType = new EventType();

      eventType.id = 1;
      eventType.name = 'EventType name';

      eventTemplate.id = 1;
      eventTemplate.name = 'Test';
      eventTemplate.description = '';
      eventTemplate.capacity = 10;
      eventTemplate.covidPassport = true;
      eventTemplate.maskRequired = true;
      eventTemplate.difficulty = 3;
      eventTemplate.type = eventType;
      eventTemplate.gym = 1;

      const result = EventTemplateDTO.fromClass({
        ...eventTemplate,
        eventCount: 5
      } as any);

      expect(result).toBeDefined();
      propCompare(eventTemplate, result);

      // Additional fields
      expect(result.eventCount).toBe(5);
    });
  });

  describe('#toClass', () => {
    it('should return a EventTemplate', () => {
      const dto = new EventTemplateDTO();

      dto.id = 1;
      dto.name = 'Test';
      dto.description = '';
      dto.capacity = 10;
      dto.covidPassport = true;
      dto.maskRequired = true;
      dto.difficulty = 3;
      dto.type = 1;
      dto.gym = 1;

      const result = dto.toClass();

      propCompare(dto, result);
    });
  });
});
