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

@Entity({ name: 'consulta' })
class Consulta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  chaveERP: string;

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
      this.id = uuid(); // Gera um novo UUID ao criar uma instância de User
    }
  }
}

export default Consulta;
