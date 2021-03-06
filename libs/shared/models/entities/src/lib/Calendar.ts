import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import CalendarAppointment from './CalendarAppointment';
import Event from './Event';

/**
 * `Calendar` of `Event`'s for a `GymZone`
 */
@Entity()
export default class Calendar {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * `Event`'s of the `Calendar`
   */
  @OneToMany(() => Event, (e) => e.calendar, {
    lazy: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  events!: Event[];

  /**
   * `Event`'s of the `Calendar`
   */
  @OneToMany(() => CalendarAppointment, (e) => e.calendar, {
    lazy: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  appointments!: CalendarAppointment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
