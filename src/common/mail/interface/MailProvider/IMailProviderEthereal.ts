import ISendMailDTO from '../ISendMailDTO';

export default interface IMailProviderEthereal {
  sendMail(data: ISendMailDTO): Promise<string>;
}
