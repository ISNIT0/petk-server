import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Model } from './Model.entity';
import { Profile } from './Profile.entity';
import { PromptTemplateInstance } from './PromptTemplateInstance.entity';
import { Session } from './Session.entity';
import { ToolIntegration } from './ToolIntegration.entity';
import { Tool } from './Tool.entity';
import { InferenceWarning } from './InferenceWarning.entity';
import { InferenceRating } from './InferenceRating.entity';

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
  promptTemplateInstance?: PromptTemplateInstance;
  @ManyToOne(() => Inference) previousInference: Inference;
  @OneToMany(() => InferenceWarning, (warning) => warning.inference)
  warnings: InferenceWarning[];
  @OneToMany(() => InferenceRating, (rating) => rating.inference)
  ratings: InferenceRating[];

  @Column() prompt: string;
  @Column({ nullable: true }) response?: string;
  @Column() type: 'automated' | 'user' | 'api'; // Was this from some automated followup/programmatic retry?

  @ManyToOne(() => Session) @JoinColumn() session: Session;
  @ManyToOne(() => Profile) @JoinColumn() profile?: Profile;

  @JoinTable()
  @ManyToMany(() => Tool)
  tools: Tool[];

  @Column('simple-json', { nullable: true }) toolProfile?: {
    name: string;
    avatarUrl: string;
    provider: ToolIntegration['type'];
  };
  @Column('simple-json', { nullable: true }) promptMergeData?: Record<
    string,
    any
  >;

  @Column({ nullable: true }) maxTokensOverride?: number;
  @Column({ nullable: true }) temperatureOverride?: number;
  @Column({ nullable: true }) stopSequenceOverride?: string;
}
