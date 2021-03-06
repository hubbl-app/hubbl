import { genSalt, hash } from 'bcrypt';
import { IsNumber, validateOrReject } from 'class-validator';

import {
  Gym,
  Person,
  Trainer,
  TrainerTag
} from '@hubbl/shared/models/entities';
import { numberError, validationParser } from '@hubbl/shared/models/helpers';
import { Gender } from '@hubbl/shared/types';

import DTO from '../Base';
import PersonDTO, { PersonDTOGroups } from '../Person';
import TrainerTagDTO from '../TrainerTag';
import { DTOGroups } from '../util';
import { nanoid } from 'nanoid';

export default class TrainerDTO<T extends Gym | number>
  extends PersonDTO<T>
  implements DTO<Trainer>
{
  // Override the gym prop in order to validate it on register
  @IsNumber(
    {},
    { message: numberError('gym'), groups: [PersonDTOGroups.REGISTER] }
  )
  gym!: T;

  /* Non required validation fields */
  tags!: Array<TrainerTag | TrainerTagDTO>;

  /**
   * Parses the json passed to the DTO and it validates
   *
   * @param json Body of the request
   * @param variant The variant of the DTO
   * @returns The parsed `TrainerDTO`
   */
  public static async fromJson<T extends Gym | number>(
    json: any,
    variant: DTOGroups | PersonDTOGroups
  ): Promise<TrainerDTO<T>> {
    const result = new TrainerDTO<T>();

    result.id = json.id;
    result.email = json.email;
    // Trainers do not have a password, but it is required, therefore
    // it is randomly generated here
    result.password = nanoid(8);
    result.firstName = json.firstName;
    result.lastName = json.lastName;
    result.phone = json.phone;
    result.theme = json.theme;
    result.gym = json.gym;
    result.gender = json.gender;
    // Tags
    result.tags = json.tags || [];

    await Promise.all(
      result.tags.map((tag) =>
        // Tags should already be created, and therefore every prop
        // should be validated
        TrainerTagDTO.fromJson(tag, DTOGroups.ALL)
      )
    ).catch((errors) => {
      throw validationParser(errors);
    });

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
   * @param trainer The fetched trainer
   * @param gym The gym to assign to the DTO
   * @returns The dto to be send as a response
   */
  public static fromClass(
    trainer: Trainer,
    variant: 'info' | 'all' = 'all'
  ): TrainerDTO<Gym | number> {
    const result = new TrainerDTO<Gym | number>();

    // Person props
    result.id = trainer.person.id;
    result.firstName = trainer.person.firstName;
    result.lastName = trainer.person.lastName;

    if (variant === 'all') {
      result.email = trainer.person.email;
      result.password = trainer.person.password;
      result.phone = trainer.person.phone;
      result.theme = trainer.person.theme;
      result.gym =
        trainer.person.gym instanceof Gym
          ? trainer.person.gym.id
          : trainer.person.gym;
      result.gender = trainer.person.gender as Gender;

      // Tags
      result.tags =
        trainer.tags?.map((tag) => TrainerTagDTO.fromClass(tag)) || [];
    }

    return result;
  }

  /**
   *
   * @returns The parsed trainer from the DTO
   */
  public async toClass(): Promise<Trainer> {
    const trainer = new Trainer();
    const person = new Person();

    // Set person fields
    person.id = this.id;
    person.firstName = this.firstName;
    person.lastName = this.lastName;
    person.email = this.email;
    person.phone = this.phone;

    // Encrypt password
    const salt = await genSalt(10);
    person.password = await hash(this.password, salt);

    person.theme = this.theme;
    person.gender = this.gender;
    person.gym = this.gym;

    // Set person into trainer
    trainer.person = person;
    trainer.personId = this.id;

    // Set tags
    trainer.tags = this.tags as TrainerTag[];

    return trainer;
  }
}
