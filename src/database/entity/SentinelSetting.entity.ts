import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Model } from './Model.entity';
import { IPIIInstance } from 'src/pii-detector/pii-detector.service';
import { InferenceWarningAction } from './InferenceWarning.entity';

@Entity()
export class SentinelSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column() name: string;
  @Column() description: string;
  @OneToMany(() => Model, (model) => model.sentinelSetting)
  models: Model[];

  @Column('simple-json', { nullable: true }) promptPiiConfig: Record<
    IPIIInstance['category'],
    InferenceWarningAction
  >;

  @Column('simple-json', { nullable: true }) responsePiiConfig: Record<
    IPIIInstance['category'],
    InferenceWarningAction
  >;
}
