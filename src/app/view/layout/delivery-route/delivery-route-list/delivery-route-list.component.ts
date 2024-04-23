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
import { DeliveryRoute } from 'src/app/model/DeliveryRoute';
import { DeliveryRouteService } from 'src/app/service/delivery-route.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-delivery-route-list',
  templateUrl: './delivery-route-list.component.html',
  styleUrls: ['./delivery-route-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryRouteListComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<DeliveryRoute> = new MatTableDataSource<DeliveryRoute>();
  displayedColumns: string[] = ['index', 'id', 'deliveryDate', 'deliveryRouteDetails', 'action'];
  pageData: any[] = [];
  pageSizes = [5, 10, 15];
  totalElements: number = 0;
  searchedStartDate: string = "";
  searchedEndDate: string = "";
  pageIndex!: string;
  pageSize!: string;
  startDate!: string;
  endDate!: string;
  isBacked: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private deliveryRouteService: DeliveryRouteService
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.pageIndex = localStorage.getItem("pageIndex")!;
    this.pageSize = localStorage.getItem("pageSize")!;
    this.startDate = localStorage.getItem("startDate")!;
    this.endDate = localStorage.getItem("endDate")!;
    if (this.pageIndex != null) {
      this.isBacked = true;
    }
    localStorage.removeItem("pageIndex");
    localStorage.removeItem("pageSize");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");

    this.paginator.pageIndex = this.pageIndex == null ? this.paginator.pageIndex : this.pageIndex;
    this.paginator.pageSize = this.pageSize == null ? this.paginator.pageSize : this.pageSize;
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
        return this.deliveryRouteService.fetchPage(this.searchedStartDate, this.searchedEndDate, this.paginator.pageIndex + 1, this.paginator.pageSize)
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
        return { 'index': ++index, ...obj, 'deliveryRouteDetails': true, 'action': true };
      });
      this.dataSource = new MatTableDataSource(this.pageData);
      this.dataSource.sort = this.sort;
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
    this.deliveryRouteService.fetchById(id).subscribe({
      next: (response: DeliveryRoute) => {
        localStorage.setItem("pageIndex", this.paginator.pageIndex.toString());
        localStorage.setItem("pageSize", this.paginator.pageSize.toString());
        localStorage.setItem("startDate", this.searchedStartDate);
        localStorage.setItem("endDate", this.searchedEndDate);
        this.router.navigate(
          ['/app/delivery-route/update'],
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
        this.deliveryRouteService.delete(id).subscribe({
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
              this.toastrService.error("There are delivery route details contained in this delivery route, so please delete them at first.", error.error.title);
            }
          }
        });
      }
    });
  }

  navigateToDeliveryRouteDetails(id: string): void {
    this.deliveryRouteService.fetchById(id).subscribe({
      next: (response: DeliveryRoute) => {
        localStorage.setItem("pageIndex", this.paginator.pageIndex.toString());
        localStorage.setItem("pageSize", this.paginator.pageSize.toString());
        localStorage.setItem("startDate", this.searchedStartDate);
        localStorage.setItem("endDate", this.searchedEndDate);
        this.router.navigate(
          ['/app/delivery-route/details'],
          {
            queryParams: {
              deliveryRouteId: id
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
