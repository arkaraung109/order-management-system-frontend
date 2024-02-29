import { Product } from "./Product";

export class RetailPrice {
  id!: number;
  price!: number;
  creationTimestamp!: string;
  product: Product = new Product();
}
