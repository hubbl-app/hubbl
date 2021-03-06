import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { AppPalette } from '@hubbl/shared/types';

import Event from './Event';
import EventTemplate from './EventTemplate';
import Gym from './Gym';

@Entity()
export default class EventType {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Name of the selected event
   */
  @Column('varchar', { nullable: false, length: 255 })
  name!: string;

  /**
   * Small description of the selected event
   */
  @Column('text')
  description!: string;

  /**
   * Color of the event type label
   */
  @Column('enum', {
    enum: AppPalette,
    enumName: 'app_palette',
    default: AppPalette.BLUE
  })
  labelColor!: AppPalette;

  /**
   * `EventTemplate`'s which are linked to the `EventType`
   */
  @OneToMany(() => EventTemplate, (et) => et.type)
  eventTemplates!: EventTemplate[];

  /**
   * `Event`'s which are linked to the `EventType`
   */
  @OneToMany(() => EventTemplate, (et) => et.type)
  events!: Event[];

  /**
   * `Gym` to which the `EventType` belongs
   */
  @ManyToOne(() => Gym, (g) => g.eventTypes)
  gym!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
