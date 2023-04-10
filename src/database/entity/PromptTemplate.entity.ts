import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Org } from './Org.entity';
import { PromptTemplateInstance } from './PromptTemplateInstance.entity';

@Entity()
export class PromptTemplate {
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
  description: string;

  @Column() promptType: 'chat' | 'instruction';

  @OneToMany(() => PromptTemplateInstance, (instance) => instance.template)
  instances: PromptTemplateInstance[];

  isDefault?: boolean;
}
