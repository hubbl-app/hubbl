import { genSalt, hash } from 'bcrypt';
import { IsBoolean, IsNumber, validateOrReject } from 'class-validator';

import { Gym, Person, Worker } from '@hubbl/shared/models/entities';
import {
  booleanError,
  numberError,
  validationParser
} from '@hubbl/shared/models/helpers';
import { Gender } from '@hubbl/shared/types';

import DTO from '../Base';
import GymDTO from '../Gym';
import PersonDTO, { PersonDTOGroups } from '../Person';
import { DTOGroups } from '../util';

export default class WorkerDTO<T extends Gym | number>
  extends PersonDTO<T>
  implements DTO<Worker>
{
  // Override the gym prop in order to validate it on register
  @IsNumber(
    {},
    { message: numberError('gym'), groups: [PersonDTOGroups.REGISTER] }
  )
  gym!: T;

  @IsBoolean({ message: booleanError('updateVirtualGyms') })
  updateVirtualGyms!: boolean;

  @IsBoolean({ message: booleanError('createGymZones') })
  createGymZones!: boolean;

  @IsBoolean({ message: booleanError('updateGymZones') })
  updateGymZones!: boolean;

  @IsBoolean({ message: booleanError('deleteGymZones') })
  deleteGymZones!: boolean;

  @IsBoolean({ message: booleanError('createTrainers') })
  createTrainers!: boolean;

  @IsBoolean({ message: booleanError('updateTrainers') })
  updateTrainers!: boolean;

  @IsBoolean({ message: booleanError('deleteTrainers') })
  deleteTrainers!: boolean;

  @IsBoolean({ message: booleanError('createClients') })
  createClients!: boolean;

  @IsBoolean({ message: booleanError('updateClients') })
  updateClients!: boolean;

  @IsBoolean({ message: booleanError('deleteClients') })
  deleteClients!: boolean;

  @IsBoolean({ message: booleanError('createTags') })
  createTags!: boolean;

  @IsBoolean({ message: booleanError('updateTags') })
  updateTags!: boolean;

  @IsBoolean({ message: booleanError('deleteTags') })
  deleteTags!: boolean;

  @IsBoolean({ message: booleanError('createEvents') })
  createEvents!: boolean;

  @IsBoolean({ message: booleanError('updateEvents') })
  updateEvents!: boolean;

  @IsBoolean({ message: booleanError('deleteEvents') })
  deleteEvents!: boolean;

  @IsBoolean({ message: booleanError('createEventTypes') })
  createEventTypes!: boolean;

  @IsBoolean({ message: booleanError('updateEventTypes') })
  updateEventTypes!: boolean;

  @IsBoolean({ message: booleanError('deleteEventTypes') })
  deleteEventTypes!: boolean;

  @IsBoolean({ message: booleanError('createEventTemplates') })
  createEventTemplates!: boolean;

  @IsBoolean({ message: booleanError('updateEventTemplates') })
  updateEventTemplates!: boolean;

  @IsBoolean({ message: booleanError('deleteEventTemplates') })
  deleteEventTemplates!: boolean;

  @IsBoolean({ message: booleanError('createEventAppointments') })
  createEventAppointments!: boolean;

  @IsBoolean({ message: booleanError('updateEventAppointments') })
  updateEventAppointments!: boolean;

  @IsBoolean({ message: booleanError('deleteEventAppointments') })
  deleteEventAppointments!: boolean;

  @IsBoolean({ message: booleanError('createCalendarAppointments') })
  createCalendarAppointments!: boolean;

  @IsBoolean({ message: booleanError('updateCalendarAppointments') })
  updateCalendarAppointments!: boolean;

  @IsBoolean({ message: booleanError('deleteCalendarAppointments') })
  deleteCalendarAppointments!: boolean;

  private static mapWorkerProps<T extends Gym | number>(
    to: WorkerDTO<T>,
    from: any
  ): void {
    to.updateVirtualGyms = from.updateVirtualGyms;
    to.createGymZones = from.createGymZones;
    to.updateGymZones = from.updateGymZones;
    to.deleteGymZones = from.deleteGymZones;
    to.createTrainers = from.createTrainers;
    to.updateTrainers = from.updateTrainers;
    to.deleteTrainers = from.deleteTrainers;
    to.createClients = from.createClients;
    to.updateClients = from.updateClients;
    to.deleteClients = from.deleteClients;
    to.createTags = from.createTags;
    to.updateTags = from.updateTags;
    to.deleteTags = from.deleteTags;
    to.createEvents = from.createEvents;
    to.updateEvents = from.updateEvents;
    to.deleteEvents = from.deleteEvents;
    to.createEventTypes = from.createEventTypes;
    to.updateEventTypes = from.updateEventTypes;
    to.deleteEventTypes = from.deleteEventTypes;
    to.createEventTemplates = from.createEventTemplates;
    to.updateEventTemplates = from.updateEventTemplates;
    to.deleteEventTemplates = from.deleteEventTemplates;
    to.createEventAppointments = from.createEventAppointments;
    to.updateEventAppointments = from.updateEventAppointments;
    to.deleteEventAppointments = from.deleteEventAppointments;
    to.createCalendarAppointments = from.createCalendarAppointments;
    to.updateCalendarAppointments = from.updateCalendarAppointments;
    to.deleteCalendarAppointments = from.deleteCalendarAppointments;
  }

  /**
   * Parses the json passed to the DTO and it validates
   *
   * @param json Body of the request
   * @param variant The variant of the DTO
   * @returns The parsed `WorkerDTO`
   */
  public static async fromJson<T extends Gym | number>(
    json: any,
    variant: DTOGroups | PersonDTOGroups
  ): Promise<WorkerDTO<T>> {
    const result = new WorkerDTO<T>();

    result.id = json.id;
    result.email = json.email;
    result.password = json.password;
    result.firstName = json.firstName;
    result.lastName = json.lastName;
    result.phone = json.phone;
    result.theme = json.theme;
    result.gym = json.gym;
    result.gender = json.gender;

    // Worker props
    WorkerDTO.mapWorkerProps(result, json);

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
   * @param worker The fetched worker
   * @param gym The gym to assign to the DTO
   * @returns The dto  to be send as a response
   */
  public static fromClass<T extends Gym | number>(
    worker: Worker
  ): WorkerDTO<T> {
    const result = new WorkerDTO<T>();

    // Person props
    result.id = worker.person.id;
    result.email = worker.person.email;
    result.password = worker.person.password;
    result.firstName = worker.person.firstName;
    result.lastName = worker.person.lastName;
    result.phone = worker.person.phone;
    result.gym = worker.person.gym as T;
    result.theme = worker.person.theme;
    result.gender = worker.person.gender as Gender;

    // If the gym is not a number, parse it as a dto
    if (worker.person.gym instanceof Gym) {
      const gymDto = GymDTO.fromClass(worker.person.gym as Gym);
      result.gym = gymDto.toClass() as T;
    }

    // Worker props
    WorkerDTO.mapWorkerProps(result, worker);

    return result;
  }

  /**
   *
   * @returns The parsed worker from the DTO
   */
  public async toClass(): Promise<Worker> {
    const worker = new Worker();
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

    person.gender = this.gender;
    person.theme = this.theme;
    person.gym = this.gym;

    // Set person into worker
    worker.person = person;
    worker.personId = this.id;

    // Set worker props
    worker.updateVirtualGyms = this.updateVirtualGyms;
    worker.createGymZones = this.createGymZones;
    worker.updateGymZones = this.updateGymZones;
    worker.deleteGymZones = this.deleteGymZones;
    worker.createTrainers = this.createTrainers;
    worker.updateTrainers = this.updateTrainers;
    worker.deleteTrainers = this.deleteTrainers;
    worker.createClients = this.createClients;
    worker.updateClients = this.updateClients;
    worker.deleteClients = this.deleteClients;
    worker.createTags = this.createTags;
    worker.updateTags = this.updateTags;
    worker.deleteTags = this.deleteTags;
    worker.createEvents = this.createEvents;
    worker.updateEvents = this.updateEvents;
    worker.deleteEvents = this.deleteEvents;
    worker.createEventTypes = this.createEventTypes;
    worker.updateEventTypes = this.updateEventTypes;
    worker.deleteEventTypes = this.deleteEventTypes;
    worker.createEventTemplates = this.createEventTemplates;
    worker.updateEventTemplates = this.updateEventTemplates;
    worker.deleteEventTemplates = this.deleteEventTemplates;
    worker.createEventAppointments = this.createEventAppointments;
    worker.updateEventAppointments = this.updateEventAppointments;
    worker.deleteEventAppointments = this.deleteEventAppointments;
    worker.createCalendarAppointments = this.createCalendarAppointments;
    worker.updateCalendarAppointments = this.updateCalendarAppointments;
    worker.deleteCalendarAppointments = this.deleteCalendarAppointments;

    return worker;
  }
}
