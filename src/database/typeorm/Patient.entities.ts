/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Exclude, Expose } from 'class-transformer';
import { Role } from 'src/common/enum/enum';
import { Frequency } from 'src/common/constant/constants';
import Address from './Address.entities';

@Entity({ name: 'patient' })
class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  identificador: string;

  @Column({ nullable: true, unique: true })
  telefone: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  is_first_time: boolean;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  accepted: boolean;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ nullable: true })
  address_id: string;

  @OneToOne(() => Address, (address) => address.patient)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose()
  toJSON() {
    const { password, created_at, updated_at, ...user } = this;
    return user;
  }

  constructor() {
    if (!this.id) {
      this.id = uuid(); // Gera um novo UUID ao criar uma instância de User
    }
  }
}

export default Patient;
