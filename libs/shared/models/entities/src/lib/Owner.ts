import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

import Gym from './Gym';
import Person from './Person';

/**
 * `Owner` entity, as the main user of the application
 */
@Entity()
export default class Owner {
  /**
   * Primary column of the `Person` relationship
   */
  @PrimaryColumn()
  personId!: number;

  /**
   * Personal information of the owner
   */
  @OneToOne(() => Person, {
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn()
  person!: Person;

  /**
   * `Gym` owned by the `Owner`
   */
  @OneToOne(() => Gym)
  @JoinColumn({ name: 'owner_id' })
  gym!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
