import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, startWith, switchMap } from 'rxjs';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { Customer } from 'src/app/model/Customer';
import { Order } from 'src/app/model/Order';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CustomerService } from 'src/app/service/customer.service';
import { OrderService } from 'src/app/service/order.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderListComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  jwtHelperService = new JwtHelperService();
  loginRole: any;
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
  displayedColumnsForAdmin: string[] = ['index', 'id', 'orderDate', 'customer', 'fulfilmentStatus', 'paymentStatus', 'orderedAmount', 'paidAmount', 'remainingAmount', 'profit', 'user', 'orderDetails', 'paymentHistory', 'action'];
  displayedColumnsForSalesStaff: string[] = ['index', 'id', 'orderDate', 'customer', 'fulfilmentStatus', 'paymentStatus', 'orderedAmount', 'paidAmount', 'remainingAmount', 'user', 'orderDetails', 'paymentHistory', 'action'];
  displayedColumnsForDeliveryManager: string[] = ['index', 'id', 'orderDate', 'customer', 'fulfilmentStatus', 'paymentStatus', 'orderedAmount', 'paidAmount', 'remainingAmount', 'user', 'orderDetails'];
  pageData: any[] = [];
  pageSizes = [5, 10, 15];
  totalElements: number = 0;
  customerList: Customer[] = [];
  searchedCustomerName: string = "";
  searchedStartDate: string = "";
  searchedEndDate: string = "";
  searchedFulfilmentStatus: string = "";
  searchedPaymentStatus: string = "";
  pageIndex!: string;
  pageSize!: string;
  customerName!: string;
  startDate!: string;
  endDate!: string;
  fulfilmentStatus!: string;
  paymentStatus!: string;
  isBacked: boolean = false;
  searchText: string = "";

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private authService: AuthenticationService,
    private customerService: CustomerService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    let jwtToken = this.authService.fetchJwtToken();
    this.loginRole = this.jwtHelperService.decodeToken(jwtToken).role;

    this.customerService.fetchAll().subscribe(data => {
      this.customerList = data;
    });
  }

  ngAfterViewInit() {
    this.pageIndex = localStorage.getItem("pageIndex")!;
    this.pageSize = localStorage.getItem("pageSize")!;
    this.customerName = localStorage.getItem("customerName")!;
    this.startDate = localStorage.getItem("startDate")!;
    this.endDate = localStorage.getItem("endDate")!;
    this.fulfilmentStatus = localStorage.getItem("fulfilmentStatus")!;
    this.paymentStatus = localStorage.getItem("paymentStatus")!;
    if (this.pageIndex != null) {
      this.isBacked = true;
    }
    localStorage.removeItem("pageIndex");
    localStorage.removeItem("pageSize");
    localStorage.removeItem("customerName");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    localStorage.removeItem("fulfilmentStatus");
    localStorage.removeItem("paymentStatus");

    this.paginator.pageIndex = this.pageIndex == null ? this.paginator.pageIndex : this.pageIndex;
    this.paginator.pageSize = this.pageSize == null ? this.paginator.pageSize : this.pageSize;
    this.searchedCustomerName = this.customerName == null ? "" : this.customerName;
    this.searchedStartDate = this.startDate == null ? "" : this.startDate;
    this.searchedEndDate = this.endDate == null ? "" : this.endDate;
    this.searchedFulfilmentStatus = this.fulfilmentStatus == null ? "" : this.fulfilmentStatus;
    this.searchedPaymentStatus = this.paymentStatus == null ? "" : this.paymentStatus;
    this.changeDetector.detectChanges();

    this.dataSource.paginator = this.paginator;
    this.assignPageData();
  }

  assignPageData() {
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.orderService.fetchPage(this.searchedCustomerName, this.searchedStartDate, this.searchedEndDate, this.searchedFulfilmentStatus, this.searchedPaymentStatus, this.paginator.pageIndex + 1, this.paginator.pageSize)
          .pipe(catchError(() => {
            throw new Error("Error");
          }));
      }),
      map((data: any) => {
        if (data == null) return [];
        this.totalElements = data.totalElements;
        return data.elementList;
      })
    ).subscribe((data: any[]) => {
      if (this.isBacked) {
        this.paginator.pageIndex = this.pageIndex == null ? this.paginator.pageIndex : this.pageIndex;
        this.paginator.pageSize = this.pageSize == null ? this.paginator.pageSize : this.pageSize;
        this.isBacked = false;
      }

      let index = this.paginator.pageIndex * this.paginator.pageSize;
      this.pageData = data.map(obj => {
        return { 'index': ++index, ...obj, 'orderDetails': true, 'action': true };
      });
      this.dataSource = new MatTableDataSource(this.pageData);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (element: any, property) => {
        switch (property) {
          case 'index': return element.index;
          case 'id': return element.id;
          case 'orderDate': return element.orderDate;
          case 'customer': return element.customer?.name;
          case 'fulfilmentStatus': return element.fulfilmentStatus;
          case 'paymentStatus': return element.paymentStatus;
          case 'orderedAmount': return element.orderedAmount;
          case 'paidAmount': return element.paidAmount;
          case 'remainingAmount': return element.orderedAmount - element.paidAmount;
          case 'profit': return element.profit;
          case 'user': return element.user?.name;
          default: return 0;
        }
      };
    });
  }

  search(): void {
    if (this.searchedStartDate) {
      this.searchedStartDate = format(this.searchedStartDate, "yyyy-MM-dd");
    }
    if (this.searchedEndDate) {
      this.searchedEndDate = format(this.searchedEndDate, "yyyy-MM-dd");
    }

    if ((this.searchedStartDate && this.searchedEndDate) || (!this.searchedStartDate && !this.searchedEndDate)) {
      this.totalElements = 0;
      this.paginator.pageIndex = 0;
      this.paginator.length = this.totalElements;
      this.dataSource.paginator = this.paginator;
      this.assignPageData();
    }
  }

  update(id: string): void {
    this.orderService.fetchById(id).subscribe({
      next: (response: Order) => {
        if (response.fulfilmentStatus != "Unfulfilled" || response.paymentStatus != "Unpaid") {
          this.toastrService.error("Either order fulfilment or payment is in progress, so it cannot be updated.", "Data Integrity Violation");
          return;
        }

        localStorage.setItem("pageIndex", this.paginator.pageIndex.toString());
        localStorage.setItem("pageSize", this.paginator.pageSize.toString());
        localStorage.setItem("customerName", this.searchedCustomerName);
        localStorage.setItem("startDate", this.searchedStartDate);
        localStorage.setItem("endDate", this.searchedEndDate);
        localStorage.setItem("fulfilmentStatus", this.searchedFulfilmentStatus);
        localStorage.setItem("paymentStatus", this.searchedPaymentStatus);
        this.router.navigate(
          ['/app/order/update'],
          {
            queryParams: {
              id: id
            }
          }
        );
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.toastrService.error(error.error.message, error.error.title);
        }
      }
    });
  }

  delete(id: string): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'delete'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.delete(id).subscribe({
          next: (response: HttpResponse) => {
            if (this.pageData.length == 1 && this.paginator.pageIndex != 0) {
              this.paginator.pageIndex--;
            }

            this.assignPageData();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotFound) {
              this.toastrService.error(error.error.message, error.error.title);
            } else if (error.status == HttpStatusCode.NotAcceptable) {
              if (error.error.message == "Either order fulfilment or payment is in progress.") {
                this.toastrService.error("Either order fulfilment or payment is in progress, so it cannot be deleted.", error.error.title);
              } else {
                this.toastrService.error("There are order details contained in this order, so please delete them at first.", error.error.title);
              }
            }
          }
        });
      }
    });
  }

  navigateToOrderDetails(id: string): void {
    this.orderService.fetchById(id).subscribe({
      next: (response: Order) => {
        localStorage.setItem("pageIndex", this.paginator.pageIndex.toString());
        localStorage.setItem("pageSize", this.paginator.pageSize.toString());
        localStorage.setItem("customerName", this.searchedCustomerName);
        localStorage.setItem("startDate", this.searchedStartDate);
        localStorage.setItem("endDate", this.searchedEndDate);
        localStorage.setItem("fulfilmentStatus", this.searchedFulfilmentStatus);
        localStorage.setItem("paymentStatus", this.searchedPaymentStatus);
        this.router.navigate(
          ['/app/order/details'],
          {
            queryParams: {
              orderId: id
            }
          }
        );
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.toastrService.error(error.error.message, error.error.title);
        }
      }
    });
  }

  navigateToPaymentHistory(id: string): void {
    this.orderService.fetchById(id).subscribe({
      next: (response: Order) => {
        localStorage.setItem("pageIndex", this.paginator.pageIndex.toString());
        localStorage.setItem("pageSize", this.paginator.pageSize.toString());
        localStorage.setItem("customerName", this.searchedCustomerName);
        localStorage.setItem("startDate", this.searchedStartDate);
        localStorage.setItem("endDate", this.searchedEndDate);
        localStorage.setItem("fulfilmentStatus", this.searchedFulfilmentStatus);
        localStorage.setItem("paymentStatus", this.searchedPaymentStatus);
        this.router.navigate(
          ['/app/order/payment-history'],
          {
            queryParams: {
              orderId: id
            }
          }
        );
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.toastrService.error(error.error.message, error.error.title);
        }
      }
    });
  }

}
