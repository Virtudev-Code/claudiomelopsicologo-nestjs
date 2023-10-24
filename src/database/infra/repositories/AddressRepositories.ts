import { Between, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createAddressSwagger } from 'src/common/doc/createAddressSwagger';
import { v4 as uuid } from 'uuid';

import Address from 'src/database/typeorm/Address.entities';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async createAddress(data: createAddressSwagger): Promise<Address> {
    const address = new Address();

    address.id = uuid();
    address.cep = data.cep;
    address.logradouro = data.logradouro;
    address.numero = data.numero;
    address.complemento = data.complemento;
    address.bairro = data.bairro;
    address.cidade = data.cidade;
    address.uf = data.uf;
    address.patient_id = data.patient_id;

    const savedAddress = await this.addressRepository.save(address);

    return savedAddress;
  }

  async findAddressByPatientId(id: string): Promise<Address> {
    return await this.addressRepository.findOne({
      where: {
        patient_id: id,
      },
    });
  }

  async updateAddress(id: string, data: createAddressSwagger): Promise<void> {
    await this.addressRepository.update(id, data);
  }

  async deleteAddress(id: string): Promise<void> {
    await this.addressRepository.delete({
      patient_id: id,
    });
  }
}
