import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeliveryRouteDetails } from 'src/app/model/DeliveryRouteDetails';
import { OrderDetails } from 'src/app/model/OrderDetails';
import { PickupDetails } from 'src/app/model/PickupDetails';
import { DeliveryRouteDetailsService } from 'src/app/service/delivery-route-details.service';
import { OrderDetailsService } from 'src/app/service/order-details.service';
import { PickupDetailsService } from 'src/app/service/pickup-details.service';

@Component({
  selector: 'app-order-details-fulfilment-history',
  templateUrl: './order-details-fulfilment-history.component.html',
  styleUrls: ['./order-details-fulfilment-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailsFulfilmentHistoryComponent implements OnInit {

  @ViewChild("deliveryMatSort", { read: MatSort, static: true }) deliveryMatSort!: MatSort;
  @ViewChild("pickupMatSort", { read: MatSort, static: true }) pickupMatSort!: MatSort;
  deliveryDataSource: MatTableDataSource<DeliveryRouteDetails> = new MatTableDataSource<DeliveryRouteDetails>();
  pickupDataSource: MatTableDataSource<PickupDetails> = new MatTableDataSource<PickupDetails>();
  displayedColumnsForDelivery: string[] = ['index', 'deliveryRouteId', 'deliveryDate', 'deliveredQuantity', 'shippingAddress'];
  displayedColumnsForPickup: string[] = ['index', 'pickupId', 'pickupDate', 'pickupQuantity'];
  deliveryPageData: any[] = [];
  pickupPageData: any[] = [];
  orderDetailsId: number = 0;
  orderDetailsDto: OrderDetails = new OrderDetails();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private orderDetailsService: OrderDetailsService,
    private deliveryRouteDetailsService: DeliveryRouteDetailsService,
    private pickupDetailsService: PickupDetailsService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderDetailsId = Number(params['orderDetailsId']);
    });

    this.orderDetailsService.fetchById(this.orderDetailsId).subscribe({
      next: (response: OrderDetails) => {
        this.orderDetailsDto = response;
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.toastrService.error(error.error.message, error.error.title);
        }
        this.back();
      }
    });
  }

  ngAfterViewInit() {
    this.assignPageData();
  }

  assignPageData() {
    this.deliveryRouteDetailsService.fetchByOrderDetailsId(this.orderDetailsId).subscribe({
      next: (response: DeliveryRouteDetails[]) => {
        let index = 0;
        this.deliveryPageData = response.map(obj => {
          return { 'index': ++index, ...obj };
        });
        this.deliveryDataSource = new MatTableDataSource(this.deliveryPageData);
        this.deliveryDataSource.sort = this.deliveryMatSort;
        this.deliveryDataSource.sortingDataAccessor = (element: any, property) => {
          switch (property) {
            case 'index': return element.index;
            case 'deliveryRouteId': return element.deliveryRoute?.id;
            case 'deliveryDate': return element.deliveryRoute?.deliveryDate;
            case 'deliveredQuantity': return element.deliveredQuantity;
            case 'shippingAddress': return element.shippingAddress?.address;
            default: return 0;
          }
        };
      },
      error: (error) => {
        this.back();
      }
    });

    this.pickupDetailsService.fetchByOrderDetailsId(this.orderDetailsId).subscribe({
      next: (response: PickupDetails[]) => {
        let index = 0;
        this.pickupPageData = response.map(obj => {
          return { 'index': ++index, ...obj };
        });
        this.pickupDataSource = new MatTableDataSource(this.pickupPageData);
        this.pickupDataSource.sort = this.pickupMatSort;
        this.pickupDataSource.sortingDataAccessor = (element: any, property) => {
          switch (property) {
            case 'index': return element.index;
            case 'pickupId': return element.pickup?.id;
            case 'pickupDate': return element.pickup?.pickupDate;
            case 'pickupQuantity': return element.pickupQuantity;
            default: return 0;
          }
        };
      },
      error: (error) => {
        this.back();
      }
    });
  }

  back(): void {
    this.router.navigate(
      ['/app/order/details'],
      {
        queryParams: {
          orderId: this.orderDetailsDto.order.id
        }
      }
    );
  }

}
