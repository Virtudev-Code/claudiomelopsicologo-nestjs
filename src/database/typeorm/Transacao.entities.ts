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
}

export default Transacao;
