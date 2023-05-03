import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Tool } from './Tool.entity';

@Entity()
export class ToolIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tool, (tool) => tool.integration) tools: Tool<any>[];

  @Column() iconUrl: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column() modelName: string;
  @Column() modelDescription: string;

  @Column() type: 'webhook' | 'serpapi' | 'email' | 'calculator';

  @Column('simple-json', { default: [] }) configFields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'date' | 'email';
    required?: boolean;
    defaultValue?: string | number | boolean;
  }[];
}
