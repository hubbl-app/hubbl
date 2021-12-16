import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { AppPalette } from '@gymman/shared/types';

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
  @Column('enum', { enum: AppPalette, default: AppPalette.BLUE })
  labelColor!: AppPalette;

  /**
   * `Gym` to which the `EventType` belongs
   */
  @ManyToOne(() => Gym, g => g.eventTypes)
  gym!: Gym;  

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}