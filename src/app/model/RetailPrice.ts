import { Product } from "./Product";

export class RetailPrice {
  id!: number;
  price!: number;
  updatedDate!: string;
  product: Product = new Product();
}
