/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BeforeInsert,
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
import Transacao from './Transacao.entities';
import { Exclude } from 'class-transformer';

export enum TypePayment {
  CARD = 'card',
  BOLETO = 'boleto',
  OUTRO = 'outro',
}

@Entity({ name: 'consulta' })
class Consulta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @Column({ unique: true, nullable: true })
  chaveERP: string;

  @Column({ type: 'enum', enum: TypePayment, nullable: true })
  type: TypePayment;

  @Column('timestamp', { nullable: true })
  date: Date;

  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn({ name: 'patient_name' })
  patient: Patient;

  @Column({ nullable: true })
  patient_name: string;

  @Column({ nullable: true })
  servicos: string;

  @Column({ nullable: true })
  convenio: string;

  @Column({ nullable: true })
  preco: string;

  @Column({ nullable: true, default: false })
  situacaoDoPagamento: boolean;

  @Column({ nullable: true })
  estado: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  transacao_id: string;

  @OneToOne(() => Transacao, (transacao) => transacao.consulta)
  @JoinColumn({ name: 'transacao_id' })
  transacao: Transacao;

  @BeforeInsert()
  generateChaveERP() {
    if (!this.chaveERP) {
      this.chaveERP = uuid();
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export default Consulta;
