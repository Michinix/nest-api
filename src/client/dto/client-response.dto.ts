import { Expose } from 'class-transformer';

export class ClientResponse {
  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
