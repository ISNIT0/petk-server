import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Integration } from './Integration.entity';
import { Org } from './Org.entity';
import { SentinelSetting } from './SentinelSetting.entity';

export interface IModelSafetyConfig {
  piiStripping: string[];
}

@Entity()
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Org)
  org: Org;

  @Column()
  name: string;
  @Column()
  type: 'chat' | 'instruction';

  @Column({ nullable: true })
  description: string;

  @Column() provider: 'http' | 'OpenAI';
  @Column('simple-json', { default: {} }) config: Record<string, any>;
  @Column('simple-json', { default: {} }) safetyConfig: IModelSafetyConfig;

  @ManyToOne(() => Integration)
  @JoinColumn()
  integration: Integration;

  @ManyToOne(() => SentinelSetting) sentinelSetting: SentinelSetting;

  isDefault?: boolean;
}
