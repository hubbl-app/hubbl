import {
  IsNumber,
  IsOptional,
  IsString,
  validateOrReject
} from 'class-validator';

import { GymZone, VirtualGym } from '@hubbl/shared/models/entities';
import {
  numberError,
  stringError,
  validationParser
} from '@hubbl/shared/models/helpers';

import DTO from '../Base';
import { DTOGroups } from '../util';
import GymZoneDTO from '../GymZone';

export default class VirtualGymDTO implements DTO<VirtualGym> {
  @IsNumber(
    {},
    { message: numberError('id'), groups: [DTOGroups.ALL, DTOGroups.UPDATE] }
  )
  id!: number;

  @IsString({
    message: stringError('name'),
    groups: [DTOGroups.ALL, DTOGroups.CREATE]
  })
  name!: string;

  @IsOptional()
  @IsString({ message: stringError('description') })
  description!: string;

  @IsString({
    message: stringError('location'),
    groups: [DTOGroups.ALL, DTOGroups.CREATE]
  })
  location!: string;

  @IsNumber(
    {},
    {
      message: numberError('capacity'),
      groups: [DTOGroups.ALL, DTOGroups.UPDATE, DTOGroups.CREATE]
    }
  )
  capacity!: number;

  @IsOptional()
  phone!: string;

  @IsString({
    message: stringError('openTime'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE, DTOGroups.CREATE]
  })
  openTime!: string;

  @IsString({
    message: stringError('closeTime'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE, DTOGroups.CREATE]
  })
  closeTime!: string;

  @IsNumber(
    {},
    {
      message: numberError('gym'),
      groups: [DTOGroups.CREATE]
    }
  )
  gym!: number;

  /* Non required validation fields */
  gymZones!: Array<GymZone | GymZoneDTO>;

  private static propMapper(from: VirtualGym | any): VirtualGymDTO {
    const result = new VirtualGymDTO();

    result.id = from.id;
    result.name = from.name;
    result.description = from.description;
    result.location = from.location;
    result.capacity = from.capacity;
    result.phone = from.phone;
    result.openTime = from.openTime;
    result.closeTime = from.closeTime;
    result.gym = from.gym;

    return result;
  }

  /**
   * Parses the json passed to the DTO and validates it
   * @param json Body of the request
   * @param variant Variant to validate for
   * @returns The parsed `VirtualGymDTO`
   */
  public static async fromJson(
    json: any,
    variant: DTOGroups
  ): Promise<VirtualGymDTO> {
    const result = VirtualGymDTO.propMapper(json);

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
   * @param virtualGym The fetched virtual gym
   * @returns The dto to be send as a response
   */
  public static fromClass(virtualGym: VirtualGym): VirtualGymDTO {
    const result = VirtualGymDTO.propMapper(virtualGym);

    result.gymZones =
      virtualGym.gymZones?.map((gz) => GymZoneDTO.fromClass(gz)) || [];

    return result;
  }

  /**
   *
   * @returns The parsed virtual gym from the DTO
   */
  public toClass(): VirtualGym {
    const result = new VirtualGym();

    result.id = this.id;
    result.name = this.name;
    result.description = this.description;
    result.location = this.location;
    result.capacity = this.capacity;
    result.phone = this.phone;
    result.openTime = this.openTime;
    result.closeTime = this.closeTime;
    result.gym = this.gym;
    result.gymZones = this.gymZones as GymZone[];

    return result;
  }
}
