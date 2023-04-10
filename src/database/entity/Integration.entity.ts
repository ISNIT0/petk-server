import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IModelSafetyConfig, Model } from './Model.entity';
import { Org } from './Org.entity';

@Entity()
export class Integration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Org)
  org: Org;

  @Column() provider: 'http' | 'OpenAI';
  @Column('simple-json') config: Record<string, any>;

  @Column('simple-json') safetyConfig: IModelSafetyConfig;

  @OneToMany(() => Model, (model) => model.integration)
  models: Model[];
}
