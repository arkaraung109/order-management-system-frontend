import { Product } from "./Product";

export class CartItem {
  product: Product = new Product();
  quantity!: number;
  unitPrice!: number;
  amount!: number;
}
