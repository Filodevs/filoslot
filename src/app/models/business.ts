export interface IBusiness {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  services?: { name: string; price: number }[];
}

export interface IBusinessUpdateDTO {
  name?: string;
  address?: string;
  phone?: string;
}
