import { Order } from "./Order";
import { PickupDetails } from "./PickupDetails";

export class PickupCart {
  pickupDate!: string;
  order: Order = new Order();
  pickupCart!: PickupDetails[];
}
