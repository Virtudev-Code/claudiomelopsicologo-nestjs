import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import Consulta from './Consulta.entities';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'transacao' })
class Transacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  consulta_id: string;

  @OneToOne(() => Consulta, (consulta) => consulta.transacao)
  @JoinColumn({ name: 'consulta_id' })
  consulta: Consulta;

  @Column({ type: 'json', nullable: true })
  infoPayment: object;

  @Column({ type: 'json', nullable: true })
  cancelPayment: object;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid(); // Gera um novo UUID ao criar uma instância de User
    }
  }
}

export default Transacao;
