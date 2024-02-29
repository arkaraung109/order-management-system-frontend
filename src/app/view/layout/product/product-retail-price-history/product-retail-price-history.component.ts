import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, startWith, switchMap } from 'rxjs';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { UserRole } from 'src/app/common/UserRole';
import { ManufacturingCost } from 'src/app/model/ManufacturingCost';
import { Product } from 'src/app/model/Product';
import { RetailPrice } from 'src/app/model/RetailPrice';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ManufacturingCostService } from 'src/app/service/manufacturing-cost.service';
import { ProductService } from 'src/app/service/product.service';
import { RetailPriceService } from 'src/app/service/retail-price.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-retail-price-history',
  templateUrl: './product-retail-price-history.component.html',
  styleUrls: ['./product-retail-price-history.component.scss']
})
export class ProductRetailPriceHistoryComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  jwtHelperService = new JwtHelperService();
  allowAction: boolean = false;
  dataSource: MatTableDataSource<RetailPrice> = new MatTableDataSource<RetailPrice>();
  displayedColumnsForAdmin: string[] = ['index', 'price', 'creationTimestamp', 'action'];
  displayedColumns: string[] = ['index', 'price', 'creationTimestamp'];
  pageData: any[] = [];
  pageSizes = [5, 10, 15];
  totalElements: number = 0;
  id: number = 0;
  productName: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private authService: AuthenticationService,
    private productService: ProductService,
    private retailPriceService: RetailPriceService
  ) { }

  ngOnInit(): void {
    let jwtToken = this.authService.fetchJwtToken();
    let loginRole = this.jwtHelperService.decodeToken(jwtToken).role;
    if (loginRole == UserRole.ADMIN) {
      this.allowAction = true;
    }

    this.route.queryParams.subscribe(params => {
      this.id = Number(params['id']);
    });

    this.productService.fetchById(this.id).subscribe({
      next: (response: Product) => {
        this.productName = response.name;
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
    this.dataSource.paginator = this.paginator;
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.retailPriceService.fetchPage(this.id, this.paginator.pageIndex + 1, this.paginator.pageSize)
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
      let index = this.paginator.pageIndex * this.paginator.pageSize;
      this.pageData = data.map(obj => {
        return { 'index': ++index, ...obj, 'action': true };
      });
      this.dataSource = new MatTableDataSource(this.pageData);
      this.dataSource.sort = this.sort;
    });
  }

  delete(id: number): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'delete'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.retailPriceService.delete(id).subscribe({
          next: (response: HttpResponse) => {
            this.assignPageData();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {

          }
        });
      }
    });
  }

  back(): void {
    this.router.navigate(['/app/product']);
  }

}
