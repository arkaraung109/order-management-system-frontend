import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDetails } from 'src/app/model/OrderDetails';
import { OrderDetailsService } from 'src/app/service/order-details.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-unfulfilled-order-list',
  templateUrl: './unfulfilled-order-list.component.html',
  styleUrls: ['./unfulfilled-order-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnfulfilledOrderListComponent {

  displayedColumns: string[] = ['nonSortIndex', 'nonSortProduct', 'nonSortQuantity', 'nonSortSellingPrice'];
  orderList: any[] = [];

  constructor(
    private orderService: OrderService,
    private orderDetailsService: OrderDetailsService
  ) { }

  ngAfterViewInit() {
    this.assignPageData();
  }

  assignPageData(): void {
    this.orderService.fetchNotFulfilled().subscribe(data => {
      this.orderList = data;
      for (let i = 0; i < this.orderList.length; i++) {
        this.orderDetailsService.fetchNotFulfilledByOrderId(this.orderList[i].id).subscribe({
          next: (response: OrderDetails[]) => {
            let dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
            dataSource = new MatTableDataSource(response);
            this.orderList[i].dataSource = dataSource;
            this.orderList[i].orderDetailsCount = response.length;
          },
          error: (error) => {

          }
        });
      }
    });
  }

}
