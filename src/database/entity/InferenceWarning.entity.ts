import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Inference } from './Inference.entity';

@Entity()
export class InferenceWarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Inference) inference: Inference;
  @Column() type: 'hallucination' | 'unsafe'; // TODO: what kinds of issues do inferences have?
  @Column() detail: string; // TODO: What kind of detailed warning information can we capture?
}
