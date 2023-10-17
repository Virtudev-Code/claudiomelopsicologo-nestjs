/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Patient from './Patient.entities';

@Entity({ name: 'address' })
class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  patient_id: string;

  @OneToOne(() => Patient, (patient) => patient.address)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ nullable: true })
  uf: string;

  @Column({ nullable: true })
  cidade: string;

  @Column({ nullable: true })
  logradouro: string;

  @Column({ nullable: true })
  bairro: string;

  @Column({ nullable: true })
  numero: string;

  @Column({ nullable: true })
  complemento: string;

  @Column({ nullable: true })
  cep: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export default Address;
