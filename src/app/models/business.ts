import { IService } from './service';

export interface IBusiness {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  services?: IService[];
}

export interface IBusinessUpdateDTO {
  name?: string;
  address?: string;
  phone?: string;
}
