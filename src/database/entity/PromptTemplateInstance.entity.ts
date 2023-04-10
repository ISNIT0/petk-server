import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Org } from './Org.entity';
import { PromptTemplate } from './PromptTemplate.entity';
import { Tool } from './Tool.entity';

@Entity()
export class PromptTemplateInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Org)
  org: Org;

  @Column()
  description: string;

  @Column()
  prompt: string;

  @Column({ nullable: true })
  stopSequence?: string;

  @Column({ default: 1000 })
  maxTokens: number;

  @Column({ default: 0 })
  temperature: number;

  @ManyToOne(() => PromptTemplate, (template) => template.instances)
  template: PromptTemplate;

  @JoinTable()
  @ManyToMany(() => Tool)
  tools: Tool[];
}
