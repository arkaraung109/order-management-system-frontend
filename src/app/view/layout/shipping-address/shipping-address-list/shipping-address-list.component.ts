import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, startWith, switchMap } from 'rxjs';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { UserRole } from 'src/app/common/UserRole';
import { ShippingAddress } from 'src/app/model/ShippingAddress';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ShippingAddressService } from 'src/app/service/shipping-address.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-shipping-address-list',
  templateUrl: './shipping-address-list.component.html',
  styleUrls: ['./shipping-address-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShippingAddressListComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  jwtHelperService = new JwtHelperService();
  allowAction: boolean = false;
  dataSource: MatTableDataSource<ShippingAddress> = new MatTableDataSource<ShippingAddress>();
  displayedColumnsWithAction: string[] = ['index', 'address', 'action'];
  displayedColumns: string[] = ['index', 'address'];
  pageData: any[] = [];
  pageSizes = [5, 10, 15];
  totalElements: number = 0;
  searchedKeyword: string = "";
  pageIndex!: string;
  pageSize!: string;
  keyword!: string;
  isBacked: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private authService: AuthenticationService,
    private shippingAddressService: ShippingAddressService
  ) { }

  ngOnInit(): void {
    let jwtToken = this.authService.fetchJwtToken();
    let loginRole = this.jwtHelperService.decodeToken(jwtToken).role;
    if (loginRole == UserRole.ADMIN) {
      this.allowAction = true;
    }
  }

  ngAfterViewInit() {
    this.pageIndex = localStorage.getItem("pageIndex")!;
    this.pageSize = localStorage.getItem("pageSize")!;
    this.keyword = localStorage.getItem("keyword")!;
    if (this.pageIndex != null) {
      this.isBacked = true;
    }
    localStorage.removeItem("pageIndex");
    localStorage.removeItem("pageSize");
    localStorage.removeItem("keyword");

    this.paginator.pageIndex = this.pageIndex == null ? this.paginator.pageIndex : this.pageIndex;
    this.paginator.pageSize = this.pageSize == null ? this.paginator.pageSize : this.pageSize;
    this.searchedKeyword = this.keyword == null ? "" : this.keyword;
    this.changeDetector.detectChanges();

    this.dataSource.paginator = this.paginator;
    this.assignPageData();
  }

  assignPageData() {
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.shippingAddressService.fetchPage(this.searchedKeyword, this.paginator.pageIndex + 1, this.paginator.pageSize)
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
    });
  }

  search(): void {
    this.totalElements = 0;
    this.paginator.pageIndex = 0;
    this.paginator.length = this.totalElements;
    this.dataSource.paginator = this.paginator;
    this.assignPageData();
  }

  update(id: number): void {
    this.shippingAddressService.fetchById(id).subscribe({
      next: (response: ShippingAddress) => {
        localStorage.setItem("pageIndex", this.paginator.pageIndex.toString());
        localStorage.setItem("pageSize", this.paginator.pageSize.toString());
        localStorage.setItem("keyword", this.searchedKeyword);
        this.router.navigate(
          ['/app/shipping-address/update'],
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
        this.shippingAddressService.delete(id).subscribe({
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
              this.toastrService.error("There are delivery route details which use this shipping address, so please delete them at first.", error.error.title);
            }
          }
        });
      }
    });
  }

}
