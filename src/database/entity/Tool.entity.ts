import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Org } from './Org.entity';
import { ToolIntegration } from './ToolIntegration.entity';

@Entity()
export class Tool<TToolConfig extends Record<string, any>> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Org)
  org: Org;

  @ManyToOne(() => ToolIntegration, { eager: true })
  @JoinColumn()
  integration: ToolIntegration;

  @Column('simple-json') config: Record<string, any>;
}
