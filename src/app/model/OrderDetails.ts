import { Order } from "./Order";
import { Product } from "./Product";

export class OrderDetails {
  id!: number;
  orderedQuantity!: number;
  fulfilledQuantity!: number;
  sellingPrice!: number;
  manufacturingCost!: number;
  amount!: number;
  fulfilmentStatus!: string;
  order: Order = new Order();
  product: Product = new Product();
}
