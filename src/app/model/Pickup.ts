import { Order } from "./Order";

export class Pickup {
  id!: string;
  pickupDate!: string;
  order: Order = new Order();
}
