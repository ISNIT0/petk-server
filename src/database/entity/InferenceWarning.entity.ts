import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Inference } from './Inference.entity';
import { Org } from './Org.entity';
import { Model } from './Model.entity';

export type InferenceWarningAction = 'block' | 'replace' | 'warn' | 'allow';
export type InferenceWarningType = 'hallucination' | 'unsafe' | 'pii';

@Entity()
export class InferenceWarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Org) org: Org;
  @ManyToOne(() => Model) model: Model;
  @ManyToOne(() => Inference) inference: Inference;
  @Column() warningOn: 'prompt' | 'response';
  @Column() type: InferenceWarningType;
  @Column() actionTaken: InferenceWarningAction;
  @Column() detail: string;
  @Column() source: 'api' | 'playground';
  @Column({ nullable: true }) badString?: string;
}
