import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, startWith, switchMap } from 'rxjs';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { Customer } from 'src/app/model/Customer';
import { Payment } from 'src/app/model/Payment';
import { CustomerService } from 'src/app/service/customer.service';
import { PaymentService } from 'src/app/service/payment.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentListComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<Payment> = new MatTableDataSource<Payment>();
  displayedColumns: string[] = ['index', 'orderId', 'orderDate', 'customer', 'paymentDate', 'amount', 'paymentType', 'action'];
  pageData: any[] = [];
  pageSizes = [5, 10, 15];
  totalElements: number = 0;
  customerList: Customer[] = [];
  searchedCustomerName: string = "";
  searchedStartDate: string = "";
  searchedEndDate: string = "";
  searchedPaymentType: string = "";
  pageIndex!: string;
  pageSize!: string;
  customerName!: string;
  startDate!: string;
  endDate!: string;
  paymentType!: string;
  isBacked: boolean = false;
  searchText: string = "";

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private customerService: CustomerService,
    private paymentService: PaymentService
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
    this.paymentType = localStorage.getItem("paymentType")!;
    if (this.pageIndex != null) {
      this.isBacked = true;
    }
    localStorage.removeItem("pageIndex");
    localStorage.removeItem("pageSize");
    localStorage.removeItem("customerName");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    localStorage.removeItem("paymentType");

    this.paginator.pageIndex = this.pageIndex == null ? this.paginator.pageIndex : this.pageIndex;
    this.paginator.pageSize = this.pageSize == null ? this.paginator.pageSize : this.pageSize;
    this.searchedCustomerName = this.customerName == null ? "" : this.customerName;
    this.searchedStartDate = this.startDate == null ? "" : this.startDate;
    this.searchedEndDate = this.endDate == null ? "" : this.endDate;
    this.searchedPaymentType = this.paymentType == null ? "" : this.paymentType;
    this.changeDetector.detectChanges();

    this.dataSource.paginator = this.paginator;
    this.assignPageData();
  }

  assignPageData() {
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.paymentService.fetchPage(this.searchedCustomerName, this.searchedStartDate, this.searchedEndDate, this.searchedPaymentType, this.paginator.pageIndex + 1, this.paginator.pageSize)
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
        return { 'index': ++index, ...obj, 'action': true };
      });
      this.dataSource = new MatTableDataSource(this.pageData);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (element: any, property) => {
        switch (property) {
          case 'index': return element.index;
          case 'orderId': return element.order?.id;
          case 'orderDate': return element.order?.orderDate;
          case 'customer': return element.customer?.name;
          case 'paymentDate': return element.paymentDate;
          case 'amount': return element.amount;
          case 'paymentType': return element.paymentType;
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

  update(id: number): void {
    this.paymentService.fetchById(id).subscribe({
      next: (response: Payment) => {
        localStorage.setItem("pageIndex", this.paginator.pageIndex.toString());
        localStorage.setItem("pageSize", this.paginator.pageSize.toString());
        localStorage.setItem("customerName", this.searchedCustomerName);
        localStorage.setItem("startDate", this.searchedStartDate);
        localStorage.setItem("endDate", this.searchedEndDate);
        localStorage.setItem("paymentType", this.searchedPaymentType);
        this.router.navigate(
          ['/app/payment/update'],
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

  delete(id: number): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'delete'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentService.delete(id).subscribe({
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
            }
          }
        });
      }
    });
  }

}
