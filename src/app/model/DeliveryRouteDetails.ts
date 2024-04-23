import { DeliveryRoute } from "./DeliveryRoute";
import { OrderDetails } from "./OrderDetails";
import { ShippingAddress } from "./ShippingAddress";

export class DeliveryRouteDetails {
  id!: number;
  deliveredQuantity!: number;
  deliveryRoute: DeliveryRoute = new DeliveryRoute();
  shippingAddress: ShippingAddress = new ShippingAddress();
  orderDetails: OrderDetails = new OrderDetails();
}
