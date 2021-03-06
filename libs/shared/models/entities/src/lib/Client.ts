import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

import { CalendarAppointment, EventAppointment } from './';
import Person from './Person';

/**
 * `Client` will make the different `Appointment`'s to the
 * `Event`'s of the `Gym`. Their basic informatin is kept in
 * {@link Person}
 */
@Entity()
export default class Client {
  /**
   * Primary column of the `Person` relationship
   */
  @PrimaryColumn()
  personId!: number;

  @OneToOne(() => Person, (p) => p.id, {
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn()
  person!: Person;

  /**
   * Allows the gym to know if the client has been verified
   * with the COVID passport. If the client does not have the
   * passport activated, it will not be able to create
   * appointments to the gym zones in which it is required to.
   */
  @Column('boolean', { nullable: false, default: false })
  covidPassport!: boolean;

  /**
   * `EventAppointment`'s made by the `Client`
   */
  @OneToMany(() => EventAppointment, (e) => e.client)
  eventAppointments!: EventAppointment[];

  /**
   * `CalendarAppointment`'s made by the `Client`
   */
  @OneToMany(() => CalendarAppointment, (e) => e.client)
  calendarAppointments!: CalendarAppointment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
