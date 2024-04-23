import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, startWith, switchMap } from 'rxjs';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { Product } from 'src/app/model/Product';
import { RetailPrice } from 'src/app/model/RetailPrice';
import { ProductService } from 'src/app/service/product.service';
import { RetailPriceService } from 'src/app/service/retail-price.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-retail-price-history',
  templateUrl: './product-retail-price-history.component.html',
  styleUrls: ['./product-retail-price-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductRetailPriceHistoryComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<RetailPrice> = new MatTableDataSource<RetailPrice>();
  displayedColumns: string[] = ['index', 'price', 'creationTimestamp', 'action'];
  pageData: any[] = [];
  pageSizes = [5, 10, 15];
  totalElements: number = 0;
  searchedStartDate: string = "";
  searchedEndDate: string = "";
  startDate!: string;
  endDate!: string;
  productId: number = 0;
  productDto: Product = new Product();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private productService: ProductService,
    private retailPriceService: RetailPriceService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productId = Number(params['productId']);
    });

    this.productService.fetchById(this.productId).subscribe({
      next: (response: Product) => {
        this.productDto = response;
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
    this.dataSource.paginator = this.paginator;
    this.assignPageData();
  }

  assignPageData() {
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.retailPriceService.fetchPage(this.productId, this.searchedStartDate, this.searchedEndDate, this.paginator.pageIndex + 1, this.paginator.pageSize)
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

  delete(id: number): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'delete'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.pageData.length == 1) {
          this.toastrService.warning("There must be at least one retail price, so it cannot be deleted.", "Retail Price Deletion");
          return;
        }

        this.retailPriceService.delete(id).subscribe({
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

  back(): void {
    this.router.navigate(['/app/product']);
  }

}
