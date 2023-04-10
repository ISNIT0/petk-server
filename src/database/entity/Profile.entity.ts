import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  BeforeUpdate,
  ManyToMany,
} from 'typeorm';
import { Org } from './Org.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  avatarUrl: string;

  @Column({ unique: true })
  email: string;

  @ManyToMany(() => Org, (org) => org.orgUsers)
  orgs: Org[];

  @AfterLoad()
  @BeforeUpdate()
  async defaultPicture() {
    if (!this.avatarUrl) {
      this.avatarUrl =
        this.avatarUrl ||
        `https://avatars.dicebear.com/api/human/${
          this.name || 'avatar' + Date.now()
        }.svg`;
    }
  }
}
