import { createConsultaSwagger } from 'src/common/doc/createConsultaSwagger';
import Consulta from 'src/database/typeorm/Consulta.entities';

export default interface IConsultaRepository {
  createConsultas(data: createConsultaSwagger[]): Promise<Consulta[]>;
}
