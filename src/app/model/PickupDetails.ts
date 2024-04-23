import { OrderDetails } from "./OrderDetails";
import { Pickup } from "./Pickup";

export class PickupDetails {
  id!: number;
  pickupQuantity!: number;
  pickup: Pickup = new Pickup();
  orderDetails: OrderDetails = new OrderDetails();
}
