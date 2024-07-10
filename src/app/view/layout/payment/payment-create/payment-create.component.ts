import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, startWith, switchMap } from 'rxjs';
import { Customer } from 'src/app/model/Customer';
import { Order } from 'src/app/model/Order';
import { CustomerService } from 'src/app/service/customer.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-payment-create',
  templateUrl: './payment-create.component.html',
  styleUrls: ['./payment-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentCreateComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
  displayedColumns: string[] = ['index', 'id', 'orderDate', 'customer', 'orderedAmount', 'paidAmount', 'remainingAmount', 'createPayment'];
  pageData: any[] = [];
  pageSizes = [5, 10, 15];
  totalElements: number = 0;
  customerList: Customer[] = [];
  searchedCustomerName: string = "";
  searchedStartDate: string = "";
  searchedEndDate: string = "";
  pageIndex!: string;
  pageSize!: string;
  customerName!: string;
  startDate!: string;
  endDate!: string;
  isBacked: boolean = false;
  searchText: string = "";

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private toastrService: ToastrService,
    private customerService: CustomerService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
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
    if (this.pageIndex != null) {
      this.isBacked = true;
    }
    localStorage.removeItem("pageIndex");
    localStorage.removeItem("pageSize");
    localStorage.removeItem("customerName");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");

    this.paginator.pageIndex = this.pageIndex == null ? this.paginator.pageIndex : this.pageIndex;
    this.paginator.pageSize = this.pageSize == null ? this.paginator.pageSize : this.pageSize;
    this.searchedCustomerName = this.customerName == null ? "" : this.customerName;
    this.searchedStartDate = this.startDate == null ? "" : this.startDate;
    this.searchedEndDate = this.endDate == null ? "" : this.endDate;
    this.changeDetector.detectChanges();

    this.dataSource.paginator = this.paginator;
    this.assignPageData();
  }

  assignPageData() {
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.orderService.fetchNotPaidPage(this.searchedCustomerName, this.searchedStartDate, this.searchedEndDate, this.paginator.pageIndex + 1, this.paginator.pageSize)
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
        return { 'index': ++index, ...obj, 'createPayment': true };
      });
      this.dataSource = new MatTableDataSource(this.pageData);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (element: any, property) => {
        switch (property) {
          case 'index': return element.index;
          case 'id': return element.id;
          case 'orderDate': return element.orderDate;
          case 'customer': return element.customer?.name;
          case 'orderedAmount': return element.orderedAmount;
          case 'paidAmount': return element.paidAmount;
          case 'remainingAmount': return element.orderedAmount - element.paidAmount;
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

  createPayment(id: string): void {
    this.orderService.fetchById(id).subscribe({
      next: (response: Order) => {
        localStorage.setItem("pageIndex", this.paginator.pageIndex.toString());
        localStorage.setItem("pageSize", this.paginator.pageSize.toString());
        localStorage.setItem("customerName", this.searchedCustomerName);
        localStorage.setItem("startDate", this.searchedStartDate);
        localStorage.setItem("endDate", this.searchedEndDate);
        this.router.navigate(
          ['/app/payment/create-details'],
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
