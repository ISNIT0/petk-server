import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Org } from './Org.entity';

@Entity()
export class Tool {
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

  @Column() modelName: string;
  @Column() modelDescription: string;
  // TODO: some kind of auth
  @Column() webhookUrl: string;
}
