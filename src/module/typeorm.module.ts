import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Patient from 'src/database/typeorm/Patient.entities';
import SecurityToken from 'src/database/typeorm/SecurityToken.entities';
import Transacao from 'src/database/typeorm/Transacao.entities';
import Consulta from 'src/database/typeorm/Consulta.entities';
import Address from 'src/database/typeorm/Address.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      SecurityToken,
      Transacao,
      Consulta,
      Address,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmFeaturedModule {}
