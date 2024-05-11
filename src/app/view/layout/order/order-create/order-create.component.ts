import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { CartItem } from 'src/app/model/CartItem';
import { Category } from 'src/app/model/Category';
import { Customer } from 'src/app/model/Customer';
import { OrderCart } from 'src/app/model/OrderCart';
import { Product } from 'src/app/model/Product';
import { CategoryService } from 'src/app/service/category.service';
import { CustomerService } from 'src/app/service/customer.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';
import { format } from 'date-fns';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderCreateComponent implements OnInit {

  @ViewChild("submitFormDirective") submitFormDirective!: FormGroupDirective;
  @ViewChild("saveFormDirective") saveFormDirective!: FormGroupDirective;
  submitForm!: FormGroup;
  saveForm!: FormGroup;
  submitted: boolean = false;
  saved: boolean = false;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['nonSortIndex', 'nonSortProduct', 'nonSortCategory', 'nonSortQuantity', 'nonSortUnitPrice', 'nonSortAmount', 'nonSortOrderDetailsAction'];
  customerList: Customer[] = [];
  categoryList: Category[] = [];
  productList: Product[] = [];
  cart: CartItem[] = [];
  totalAmount: number = 0;
  action: string = "create";
  cartItemIndex: number = 0;
  searchText: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private customerService: CustomerService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.submitForm = this.fb.group(
      {
        category: [null, Validators.required],
        product: [null, Validators.required],
        quantity: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,5}$")]],
        unitPrice: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,5}$")]]
      }
    );

    this.saveForm = this.fb.group(
      {
        orderDate: ['', Validators.required],
        customer: [null, Validators.required],
        remark: [null]
      }
    );

    this.categoryService.fetchAll().subscribe(data => {
      this.categoryList = data;
    });

    this.customerService.fetchAll().subscribe(data => {
      this.customerList = data;
    });

    this.dataSource = new MatTableDataSource(this.cart);
  }

  changeProduct(category: Category): void {
    this.submitForm.get('product')!.setValue(null);
    this.productList = [];
    if (category.id) {
      this.productService.fetchByCategoryId(category.id).subscribe(data => {
        this.productList = data;
      });
    }
  }

  changeUnitPrice(product: Product): void {
    this.submitForm.get('unitPrice')!.setValue('');
    if (product.id) {
      this.submitForm.get('unitPrice')!.setValue(product.retailPrice);
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
    if (this.submitForm.invalid) {
      return;
    }

    let cartItem: CartItem = new CartItem();
    cartItem.product = this.submitForm.get('product')!.value;
    cartItem.quantity = this.submitForm.get('quantity')!.value;
    cartItem.unitPrice = this.submitForm.get('unitPrice')!.value;
    cartItem.amount = cartItem.quantity * cartItem.unitPrice;
    this.totalAmount += cartItem.amount;

    let index = this.cart.findIndex(obj => obj.product.name === cartItem.product.name && obj.unitPrice === cartItem.unitPrice);
    if (index !== -1) {
      this.cart[index].quantity = Number(this.cart[index].quantity) + Number(cartItem.quantity);
      this.cart[index].amount = this.cart[index].quantity * this.cart[index].unitPrice;
    } else {
      this.cart.push(cartItem);
    }

    this.dataSource = new MatTableDataSource(this.cart);
    this.resetSubmitForm();
    this.toastrService.success("Successfully created.", "Order Details Creation");
  }

  update(): void {
    this.submitted = true;
    if (this.submitForm.invalid) {
      return;
    }

    let updatedCartItem = new CartItem();
    updatedCartItem.product = this.submitForm.get('product')!.value;
    updatedCartItem.quantity = this.submitForm.get('quantity')!.value;
    updatedCartItem.unitPrice = this.submitForm.get('unitPrice')!.value;
    updatedCartItem.amount = updatedCartItem.quantity * updatedCartItem.unitPrice;

    let found = false;
    for (let i = 0; i < this.cart.length; i++) {
      if (i != this.cartItemIndex && this.cart[i].product.id == updatedCartItem.product.id && this.cart[i].unitPrice == updatedCartItem.unitPrice) {
        found = true;
        this.cart[i].quantity = Number(this.cart[i].quantity) + Number(updatedCartItem.quantity);
        this.cart[i].amount = this.cart[i].quantity * this.cart[i].unitPrice;
        this.totalAmount -= this.cart[this.cartItemIndex].amount;
        this.cart.splice(this.cartItemIndex, 1);
        break;
      }
    }

    if (!found) {
      this.totalAmount -= this.cart[this.cartItemIndex].amount;
      this.cart[this.cartItemIndex] = updatedCartItem;
    }

    this.totalAmount += updatedCartItem.amount;
    this.dataSource = new MatTableDataSource(this.cart);
    this.resetSubmitForm();
    this.toastrService.success("Successfully updated.", "Order Details Update");
  }

  edit(item: CartItem): void {
    this.action = 'update';
    this.cartItemIndex = this.cart.indexOf(item);
    let category = this.categoryList.find(c => c.id == item.product.category.id);
    if (category) {
      this.submitForm.get('category')!.setValue(category);
      this.submitForm.get('product')!.setValue(null);
      this.productList = [];
      this.productService.fetchByCategoryId(category.id).subscribe(data => {
        this.productList = data;
        this.submitForm.get('product')!.setValue(this.productList.find(p => p.id == item.product.id));
      });
      this.submitForm.get('quantity')!.setValue(item.quantity);
      this.submitForm.get('unitPrice')!.setValue(item.unitPrice);
    }
  }

  delete(item: CartItem): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'delete'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let index = this.cart.indexOf(item);
        if (index !== -1) {
          this.totalAmount -= this.cart[index].amount;
          this.cart.splice(index, 1);
        }
        this.dataSource = new MatTableDataSource(this.cart);
        this.resetSubmitForm();
        this.toastrService.success("Successfully deleted.", "Order Details Deletion");
      }
    });
  }

  save(): void {
    this.saved = true;
    if (this.saveForm.invalid) {
      return;
    }

    if (this.cart.length == 0) {
      this.toastrService.warning("Please add order details to order cart.", "Not Finished");
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'create'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestDto: OrderCart = new OrderCart();
        requestDto.orderDate = format(this.saveForm.get('orderDate')!.value, "yyyy-MM-dd");
        requestDto.customer = this.saveForm.get('customer')!.value;
        requestDto.remark = this.saveForm.get('remark')!.value;
        requestDto.amount = this.totalAmount;
        requestDto.orderCart = this.cart;

        this.orderService.create(requestDto).subscribe({
          next: (response: HttpResponse) => {
            const moreDialogRef = this.matDialog.open(ConfirmDialogComponent, {
              width: '300px', data: 'create more'
            });

            moreDialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.searchText = "";
                this.resetSubmitForm();
                this.resetSaveForm();
              } else {
                this.back();
              }
            });

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

  resetSubmitForm(): void {
    this.submitted = false;
    this.submitFormDirective.resetForm();
    this.productList = [];
    this.action = 'create';
  }

  resetSaveForm(): void {
    this.saved = false;
    this.totalAmount = 0;
    this.saveFormDirective.resetForm();
    this.cart = [];
    this.dataSource = new MatTableDataSource(this.cart);
  }

  back(): void {
    this.router.navigate(['/app/order']);
  }

}
