export interface IService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface CreateServiceDTO {
  name: string;
  price: number;
  duration: number;
}
