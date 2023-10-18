// import Patient from 'src/database/typeorm/Patient.entities';
import { updateEmailSwagger } from '../doc/updatePatientSwagger';

export type UpdateUser = {
  patient: updateEmailSwagger;
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type IRequestMonth = {
  month: number;
  year: number;
};

export type IRequestMonthPatient = {
  patient_name: string;
  month: number;
  year: number;
};

export type IRequestDayPatient = {
  patient_name: string;
  day: number;
  month: number;
  year: number;
};

export type IRequest = {
  patient_name: string;
  day: number;
  month: number;
  year: number;
};

export type IRequestPatient = {
  user_id: string;
  month: number;
  year: number;
};

export type IResponseDay = Array<{
  hour: string;
  available: boolean;
}>;

export type IResponseMonth = Array<{
  day: number;
  available: boolean;
}>;

export type IEmail = {
  email: string;
};

export type IReset = {
  token: string;
  password: string;
};

export type IFilterConsulta = {
  patient_name?: string;
  servicos?: string;
  convenio?: string;
  preco?: string;
  situacaoDoPagamento?: boolean;
  estado?: string;
  startDate?: Date;
  endDate?: Date;
};
