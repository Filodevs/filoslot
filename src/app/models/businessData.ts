export interface BusinessData {
  name: string;
  address: string;
  rating: number;
  reviews: number;
  services: { name: string; price: number }[];
}
