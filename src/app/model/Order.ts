import { Customer } from "./Customer";
import { User } from "./User";

export class Order {
  id!: string;
  orderDate!: string;
  orderedAmount!: number;
  paidAmount!: number;
  remark!: string;
  fulfilmentStatus!: string;
  paymentStatus!: string;
  customer: Customer = new Customer();
  user: User = new User();
}
