import { Category } from "./Category";

export class Product {
  id!: number;
  name!: string;
  category: Category = new Category();
  manufacturingCost!: number;
  retailPrice!: number;
}
