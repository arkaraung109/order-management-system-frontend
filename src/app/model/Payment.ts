import { Order } from "./Order";

export class Payment {
  id!: number;
  amount!: number;
  paymentDate!: string;
  paymentType!: string;
  order: Order = new Order();
}
