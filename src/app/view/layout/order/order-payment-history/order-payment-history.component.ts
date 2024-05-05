import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/model/Order';
import { Payment } from 'src/app/model/Payment';
import { OrderService } from 'src/app/service/order.service';
import { PaymentService } from 'src/app/service/payment.service';

@Component({
  selector: 'app-order-payment-history',
  templateUrl: './order-payment-history.component.html',
  styleUrls: ['./order-payment-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderPaymentHistoryComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<Payment> = new MatTableDataSource<Payment>();
  displayedColumns: string[] = ['index', 'paymentDate', 'paymentType', 'amount'];
  pageData: any[] = [];
  orderId: string = "";
  orderDto: Order = new Order();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
    });

    this.orderService.fetchById(this.orderId).subscribe({
      next: (response: Order) => {
        this.orderDto = response;
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
    this.paymentService.fetchByOrderId(this.orderId).subscribe({
      next: (response: Payment[]) => {
        let index = 0;
        this.pageData = response.map(obj => {
          return { 'index': ++index, ...obj };
        });
        this.dataSource = new MatTableDataSource(this.pageData);
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.back();
      }
    });
  }

  back(): void {
    this.router.navigate(['/app/order']);
  }

}
