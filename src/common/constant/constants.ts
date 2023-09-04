export enum Routes {
  APPOINTMENT = 'appointment',
  AUTH = 'auth',
  STATUS = 'status',
  PATIENT = 'patient',
  SECURITY = 'security-token',
  ADMIN = 'admin',
  PAYMENT = 'payment',
  CONSULTA = 'consulta',
}

export const URL_CANCEL_PAYMENT_CONTSELF = `http://apphml.contself.com.br/ApiEcommerce/CancelaPagamento?ID=7&ChavePessoa=1b3893b3-1f9b-4a12-a2f7-555122caed61&ChaveERP=118.53352`;

export const URL_PAYMENT_CONTSELF = `http://apphml.contself.com.br/ApiEcommerce/SolicitaPagamentoTransparente?ChavePessoa=f6ed13da-a4e5-4bc0-965e-df2a67d2e59e&chaveERP=c6ae63f5-de4e-4f3b-8764-6ba15582fa27`;

export const URL_LOGIN_CONTSELF = `http://apphml.contself.com.br/ApiMobile/Login`;

export const PROPS_LOGIN_CONTSELF = {
  username: 'medicoteste@contself.com.br',
  password: 'med123',
};

export enum Services {
  AUTH = 'AUTH_SERVICE',
  USERS = 'USERS_SERVICE',
}

export enum Frequency {
  MENSAL = 'monthly',
  SEMANAL = 'weekly',
  QUINZENAL = 'fortnightly',
  NULL = 'nulo',
}
