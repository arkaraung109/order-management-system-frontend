import { CartItem } from "./CartItem";
import { Customer } from "./Customer";

export class OrderCart {
  orderDate!: string;
  customer: Customer = new Customer();
  amount!: number;
  remark!: string;
  orderCart!: CartItem[];
}
