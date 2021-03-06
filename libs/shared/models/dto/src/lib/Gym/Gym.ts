import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  validateOrReject
} from 'class-validator';

import { Gym, VirtualGym } from '@hubbl/shared/models/entities';
import {
  emailError,
  enumError,
  numberError,
  stringError,
  validationParser
} from '@hubbl/shared/models/helpers';
import { AppPalette } from '@hubbl/shared/types';

import DTO from '../Base';
import { PersonDTOGroups } from '../Person';
import { DTOGroups } from '../util';

export default class GymDTO implements DTO<Gym> {
  @IsNumber(
    {},
    { message: numberError('id'), groups: [DTOGroups.ALL, DTOGroups.UPDATE] }
  )
  id!: number;

  @IsString({
    message: stringError('name'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE, PersonDTOGroups.REGISTER]
  })
  name!: string;

  @IsEmail(
    {},
    {
      message: emailError(),
      groups: [DTOGroups.ALL, DTOGroups.UPDATE, PersonDTOGroups.REGISTER]
    }
  )
  email!: string;

  @IsString({ message: stringError('phone'), groups: [] })
  phone!: string;

  @IsEnum({}, { message: enumError('AppPalette', 'color') })
  color!: AppPalette;

  /* Non required validation fields */
  code!: string;

  virtualGyms!: VirtualGym[];

  /**
   * Parses the json passed to the DTO and validates it
   *
   * @param json Body of the request
   * @returns The parsed `GymDTO`
   */
  public static async fromJson(
    json: any,
    variant: DTOGroups | PersonDTOGroups
  ): Promise<GymDTO> {
    const result = new GymDTO();

    result.id = json.id;
    result.name = json.name;
    result.email = json.email;
    result.phone = json.phone;
    result.code = json.code;
    result.color = json.color;

    await validateOrReject(result, {
      validationError: { target: false },
      groups: [variant]
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }

  /**
   * Parses the original class to the DTO
   *
   * @param gym The fetched gym
   * @returns The dto to be send as a response
   */
  public static fromClass(gym: Gym): GymDTO {
    const result = new GymDTO();

    result.id = gym.id;
    result.name = gym.name;
    result.email = gym.email;
    result.phone = gym.phone;
    result.code = gym.code;
    result.color = gym.color;
    result.virtualGyms = gym.virtualGyms;

    return result;
  }

  /**
   *
   * @returns The parsed gym from the DTO
   */
  public toClass(): Gym {
    const result = new Gym();

    result.id = this.id;
    result.name = this.name;
    result.email = this.email;
    result.phone = this.phone;
    result.code = this.code;
    result.color = this.color;

    return result;
  }
}
