import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

import Person from './Person';

/**
 * Their basic information is kept in {@link Person}.
 * This model merely contains the different permissions
 * of the `Worker`.
 */
@Entity()
export default class Worker {
  /**
   * Primary column of the `Person` relationship
   */
  @PrimaryColumn()
  personId!: number;

  @OneToOne(() => Person, {
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn()
  person!: Person;

  /**
   * The `Worker` is allowed or not to UPDATE `VirtualGym`
   * {@link VirtualGym}.
   */
  @Column('bool', { default: false })
  updateVirtualGyms!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `GymZone`'s.
   */
  @Column('bool', { default: false })
  createGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `GymZone`'s.
   */
  @Column('bool', { default: false })
  updateGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `GymZone`'s.
   */
  @Column('bool', { default: false })
  deleteGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `Trainer`'s.
   */
  @Column('bool', { default: false })
  createTrainers!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `Trainer`'s.
   */
  @Column('bool', { default: false })
  updateTrainers!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `Trainer`'s.
   */
  @Column('bool', { default: false })
  deleteTrainers!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `Client`'s.
   */
  @Column('bool', { default: false })
  createClients!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `Client`'s.
   */
  @Column('bool', { default: false })
  updateClients!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `Client`'s.
   */
  @Column('bool', { default: false })
  deleteClients!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `Tag`'s of any kind.
   */
  @Column('bool', { default: false })
  createTags!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `Tag`'s of any kind.
   */
  @Column('bool', { default: false })
  updateTags!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `Tag`'s of any kind.
   */
  @Column('bool', { default: false })
  deleteTags!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `Event`'s.
   */
  @Column('bool', { default: false })
  createEvents!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `Event`'s.
   */
  @Column('bool', { default: false })
  updateEvents!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `Event`'s.
   */
  @Column('bool', { default: false })
  deleteEvents!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `EventType`'s.
   */
  @Column('bool', { default: false })
  createEventTypes!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `EventType`'s.
   */
  @Column('bool', { default: false })
  updateEventTypes!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `EventType`'s.
   */
  @Column('bool', { default: false })
  deleteEventTypes!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `EventTemplates`'s.
   */
  @Column('bool', { default: false })
  createEventTemplates!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `EventTemplates`'s.
   */
  @Column('bool', { default: false })
  updateEventTemplates!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `EventTemplates`'s.
   */
  @Column('bool', { default: false })
  deleteEventTemplates!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `EventAppointment`'s.
   */
  @Column('bool', { default: false })
  createEventAppointments!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `EventAppointment`'s.
   */
  @Column('bool', { default: false })
  updateEventAppointments!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `EventAppointment`'s.
   */
  @Column('bool', { default: false })
  deleteEventAppointments!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `CalendarAppointment`'s.
   */
  @Column('bool', { default: false })
  createCalendarAppointments!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `CalendarAppointment`'s.
   */
  @Column('bool', { default: false })
  updateCalendarAppointments!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `CalendarAppointment`'s.
   */
  @Column('bool', { default: false })
  deleteCalendarAppointments!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
