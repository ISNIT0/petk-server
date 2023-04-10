import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Model } from './Model.entity';
import { Profile } from './Profile.entity';
import { PromptTemplate } from './PromptTemplate.entity';

@Entity()
export class Org {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @ManyToMany(() => Profile, (profile) => profile.orgs)
  @JoinTable()
  orgUsers: Profile[];

  @OneToOne(() => Model)
  @JoinColumn()
  defaultChatModel?: Model;

  @OneToOne(() => PromptTemplate)
  @JoinColumn()
  defaultChatTemplate?: PromptTemplate;

  @OneToOne(() => Model)
  @JoinColumn()
  defaultInstructionModel?: Model;

  @OneToOne(() => PromptTemplate)
  @JoinColumn()
  defaultInstructionTemplate?: PromptTemplate;
}
