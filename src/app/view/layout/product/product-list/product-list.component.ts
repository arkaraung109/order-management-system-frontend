import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { Category } from 'src/app/model/Category';
import { Product } from 'src/app/model/Product';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  jwtHelperService = new JwtHelperService();
  allowAction: boolean = false;
  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>();
  displayedColumnsForAdmin: string[] = ['index', 'name', 'category', 'manufacturingCost', 'retailPrice', 'action'];
  displayedColumns: string[] = ['index', 'name', 'category', 'manufacturingCost', 'retailPrice'];
  pageData: any[] = [];
  pageSizes = [5, 10, 15];
  totalElements: number = 0;
  categoryList: Category[] = [];
  searchedCategory: string = "";
  searchedKeyword: string = "";
  pageIndex!: string;
  pageSize!: string;
  categoryName!: string;
  keyword!: string;
  isBacked: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private authService: AuthenticationService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    let jwtToken = this.authService.fetchJwtToken();
    let loginRole = this.jwtHelperService.decodeToken(jwtToken).role;
    if (loginRole == UserRole.ADMIN) {
      this.allowAction = true;
    }

    this.categoryService.fetchAll().subscribe(data => {
      this.categoryList = data;
    });
  }

  ngAfterViewInit() {
    this.pageIndex = localStorage.getItem("pageIndex")!;
    this.pageSize = localStorage.getItem("pageSize")!;
    this.categoryName = localStorage.getItem("categoryName")!;
    this.keyword = localStorage.getItem("keyword")!;
    if (this.pageIndex != null) {
      this.isBacked = true;
    }
    localStorage.removeItem("pageIndex");
    localStorage.removeItem("pageSize");
    localStorage.removeItem("categoryName");
    localStorage.removeItem("keyword");

    this.paginator.pageIndex = this.pageIndex == null ? this.paginator.pageIndex : this.pageIndex;
    this.paginator.pageSize = this.pageSize == null ? this.paginator.pageSize : this.pageSize;
    this.searchedCategory = this.categoryName == null ? "" : this.categoryName;
    this.searchedKeyword = this.keyword == null ? "" : this.keyword;
    this.changeDetector.detectChanges();

    this.assignPageData();
  }

  assignPageData() {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.productService.fetchPage(this.searchedCategory, this.searchedKeyword, this.paginator.pageIndex + 1, this.paginator.pageSize)
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
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.productService.fetchPage(this.searchedCategory, this.searchedKeyword, this.paginator.pageIndex + 1, this.paginator.pageSize)
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

  update(id: number): void {
    this.productService.fetchById(id).subscribe({
      next: (response: Product) => {
        localStorage.setItem("pageIndex", this.paginator.pageIndex.toString());
        localStorage.setItem("pageSize", this.paginator.pageSize.toString());
        localStorage.setItem("categoryName", this.searchedCategory);
        localStorage.setItem("keyword", this.searchedKeyword);
        this.router.navigate(
          ['/app/product/update'],
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
        this.productService.delete(id).subscribe({
          next: (response: HttpResponse) => {
            this.assignPageData();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.error("Please delete the items used by this product first.", error.error.title);
            }
          }
        });
      }
    });
  }

}

