import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Inference } from './Inference.entity';
import { Org } from './Org.entity';
import { Profile } from './Profile.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Org)
  org: Org;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column() type: 'chat' | 'instruction';
  @Column() source: 'playground' | 'api';

  @ManyToOne(() => Profile) profile?: Profile;

  @OneToMany(() => Inference, (inference) => inference.session)
  inferences: Inference[];
}
