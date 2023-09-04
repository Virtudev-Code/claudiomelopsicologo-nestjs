import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Patient from 'src/database/typeorm/Patient.entities';
import SecurityToken from 'src/database/typeorm/SecurityToken.entities';
import Transacao from 'src/database/typeorm/Transacao.entities';
import Consulta from 'src/database/typeorm/Consulta.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, SecurityToken, Transacao, Consulta]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmFeaturedModule {}
