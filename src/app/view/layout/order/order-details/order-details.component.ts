import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { Category } from 'src/app/model/Category';
import { Order } from 'src/app/model/Order';
import { OrderDetails } from 'src/app/model/OrderDetails';
import { Product } from 'src/app/model/Product';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CategoryService } from 'src/app/service/category.service';
import { OrderDetailsService } from 'src/app/service/order-details.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailsComponent implements OnInit {

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  form!: FormGroup;
  submitted: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  jwtHelperService = new JwtHelperService();
  loginRole: any;
  dataSource: MatTableDataSource<OrderDetails> = new MatTableDataSource<OrderDetails>();
  displayedColumnsForAdmin: string[] = ['index', 'product', 'category', 'fulfilmentStatus', 'orderedQuantity', 'fulfilledQuantity', 'sellingPrice', 'manufacturingCost', 'amount', 'fulfilmentHistory', 'action'];
  displayedColumnsForSalesStaff: string[] = ['index', 'product', 'category', 'fulfilmentStatus', 'orderedQuantity', 'fulfilledQuantity', 'sellingPrice', 'amount', 'fulfilmentHistory', 'action'];
  displayedColumnsForDeliveryManager: string[] = ['index', 'product', 'category', 'fulfilmentStatus', 'orderedQuantity', 'fulfilledQuantity', 'sellingPrice', 'amount', 'fulfilmentHistory'];
  pageData: any[] = [];
  orderId: string = "";
  orderDto: Order = new Order();
  orderDetailsDto: OrderDetails = new OrderDetails();
  categoryList: Category[] = [];
  productList: Product[] = [];
  action: string = "create";
  searchText: string = "";

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private authService: AuthenticationService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private orderService: OrderService,
    private orderDetailsService: OrderDetailsService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        category: [null, Validators.required],
        product: [null, Validators.required],
        quantity: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,5}$")]],
        unitPrice: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,5}$")]]
      }
    );

    let jwtToken = this.authService.fetchJwtToken();
    this.loginRole = this.jwtHelperService.decodeToken(jwtToken).role;

    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
    });

    this.categoryService.fetchAll().subscribe(data => {
      this.categoryList = data;
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
    this.orderDetailsService.fetchByOrderId(this.orderId).subscribe({
      next: (response: OrderDetails[]) => {
        let index = 0;
        this.pageData = response.map(obj => {
          return { 'index': ++index, ...obj, 'fulfilmentHistory': true, 'action': true };
        });
        this.dataSource = new MatTableDataSource(this.pageData);
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (element: any, property) => {
          switch (property) {
            case 'index': return element.index;
            case 'product': return element.product?.name;
            case 'category': return element.product?.category?.name;
            case 'fulfilmentStatus': return element.fulfilmentStatus;
            case 'orderedQuantity': return element.orderedQuantity;
            case 'fulfilledQuantity': return element.fulfilledQuantity;
            case 'sellingPrice': return element.sellingPrice;
            case 'manufacturingCost': return element.manufacturingCost;
            case 'amount': return element.amount;
            default: return 0;
          }
        };
      },
      error: (error) => {
        this.back();
      }
    });
  }

  changeProduct(category: Category): void {
    this.form.get('product')!.setValue(null);
    this.productList = [];
    if (category.id) {
      this.productService.fetchByCategoryId(category.id).subscribe(data => {
        this.productList = data;
      });
    }
  }

  changeUnitPrice(product: Product): void {
    this.form.get('unitPrice')!.setValue('');
    if (product.id) {
      this.form.get('unitPrice')!.setValue(product.retailPrice);
    }
  }

  submit(): void {
    if (this.action === 'create') {
      this.create();
    } else {
      this.update();
    }
  }

  create(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'create'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestDto: OrderDetails = new OrderDetails();
        requestDto.orderedQuantity = this.form.get('quantity')!.value;
        requestDto.sellingPrice = this.form.get('unitPrice')!.value;
        requestDto.amount = requestDto.orderedQuantity * requestDto.sellingPrice;
        this.orderDto.orderedAmount += requestDto.amount;
        requestDto.order = this.orderDto;
        requestDto.product = this.form.get('product')!.value;

        this.orderDetailsService.create(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.assignPageData();
            this.toastrService.success(response.message, response.title);
            this.reset();
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.error("Order fulfilment is in progress, so new order details cannot be created.", error.error.title);
            }
          }
        });
      }
    });
  }

  update(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'update'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestDto: OrderDetails = new OrderDetails();
        requestDto.id = this.orderDetailsDto.id;
        requestDto.orderedQuantity = this.form.get('quantity')!.value;
        requestDto.sellingPrice = this.form.get('unitPrice')!.value;
        requestDto.amount = requestDto.orderedQuantity * requestDto.sellingPrice;
        this.orderDto.orderedAmount += (requestDto.amount - this.orderDetailsDto.amount);
        requestDto.order = this.orderDto;
        requestDto.product = this.form.get('product')!.value;

        this.orderDetailsService.update(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.assignPageData();
            this.toastrService.success(response.message, response.title);
            this.reset();
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotFound) {
              this.toastrService.error(error.error.message, error.error.title);
            } else if (error.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.error("Order fulfilment is in progress, so this order details cannot be updated.", error.error.title);
            }
          }
        });
      }
    });
  }

  edit(id: number): void {
    this.action = 'update';

    this.orderDetailsService.fetchById(id).subscribe({
      next: (response: OrderDetails) => {
        let category = this.categoryList.find(c => c.id == response.product.category.id);
        if (category) {
          this.form.get('category')!.setValue(category);
          this.form.get('product')!.setValue(null);
          this.productList = [];
          this.productService.fetchByCategoryId(category.id).subscribe(data => {
            this.productList = data;
            this.form.get('product')!.setValue(this.productList.find(p => p.id == response.product.id));
          });
          this.form.get('quantity')!.setValue(response.orderedQuantity);
          this.form.get('unitPrice')!.setValue(response.sellingPrice);
          this.orderDetailsDto = response;
        }
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
        this.orderDetailsService.delete(id).subscribe({
          next: (response: HttpResponse) => {
            this.assignPageData();
            this.toastrService.success(response.message, response.title);
            this.reset();
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
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotFound) {
              this.toastrService.error(error.error.message, error.error.title);
            } else if (error.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.error("Order fulfilment is in progress, so this order details cannot be deleted.", error.error.title);
            }
          }
        });
      }
    });
  }

  navigateToFulfilmentHistory(id: number): void {
    this.orderDetailsService.fetchById(id).subscribe({
      next: (response: OrderDetails) => {
        this.router.navigate(
          ['/app/order/order-details-fulfilment-history'],
          {
            queryParams: {
              orderDetailsId: id
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

  reset(): void {
    this.submitted = false;
    this.formDirective.resetForm();
    this.productList = [];
    this.action = 'create';
  }

  back(): void {
    this.router.navigate(['/app/order']);
  }

}
