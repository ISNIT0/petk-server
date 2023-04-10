import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Inference } from './Inference.entity';
import { Profile } from './Profile.entity';

@Entity()
export class InferenceRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Inference) inference: Inference;
  @Column() rating: number; // -1 - 1
  @ManyToOne(() => Profile) profile?: Profile;
}
