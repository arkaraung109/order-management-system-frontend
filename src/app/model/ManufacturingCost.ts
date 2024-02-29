import { Product } from "./Product";

export class ManufacturingCost {
  id!: number;
  cost!: number;
  creationTimestamp!: string;
  product: Product = new Product();
}
