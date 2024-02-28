import { Product } from "./Product";

export class ManufacturingCost {
  id!: number;
  cost!: number;
  updatedDate!: string;
  product: Product = new Product();
}
