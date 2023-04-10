import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Model } from './Model.entity';
import { Profile } from './Profile.entity';
import { PromptTemplateInstance } from './PromptTemplateInstance.entity';
import { Session } from './Session.entity';

@Entity()
export class Inference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Model)
  @JoinColumn()
  model: Model;
  @ManyToOne(() => PromptTemplateInstance)
  promptTemplateInstance: PromptTemplateInstance;
  @ManyToOne(() => Inference) previousInference: Inference;

  @Column() prompt: string;
  @Column() response: string;
  @Column() type: 'automated' | 'user'; // Was this from some automated followup/programmatic retry?

  @ManyToOne(() => Session) @JoinColumn() session: Session;
  @ManyToOne(() => Profile) @JoinColumn() profile?: Profile;
}
