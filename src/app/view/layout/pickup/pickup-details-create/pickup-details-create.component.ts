import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { OrderDetails } from 'src/app/model/OrderDetails';
import { OrderDetailsService } from 'src/app/service/order-details.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { quantityValidator } from 'src/app/validator/quantity.validator';
import { Order } from 'src/app/model/Order';
import { OrderService } from 'src/app/service/order.service';
import { PickupCart } from 'src/app/model/PickupCart';
import { PickupDetails } from 'src/app/model/PickupDetails';
import { PickupService } from 'src/app/service/pickup.service';

@Component({
  selector: 'app-pickup-details-create',
  templateUrl: './pickup-details-create.component.html',
  styleUrls: ['./pickup-details-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PickupDetailsCreateComponent implements OnInit {

  @ViewChild("submitFormDirective") submitFormDirective!: FormGroupDirective;
  @ViewChild("saveFormDirective") saveFormDirective!: FormGroupDirective;
  submitForm!: FormGroup;
  saveForm!: FormGroup;
  submitted: boolean = false;
  saved: boolean = false;
  dataSource: MatTableDataSource<OrderDetails> = new MatTableDataSource<OrderDetails>();
  cartDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['select', 'no', 'orderId', 'customer', 'orderDate', 'product', 'category', 'quantity', 'pickupQuantity'];
  displayedColumnsForCart: string[] = ['no', 'orderId', 'customer', 'orderDate', 'product', 'category', 'pickupQuantity'];
  elementArray: any[] = [];
  allElementArray: any[] = [];
  pageData: any[] = [];
  cartData: any[] = [];
  orderId: string = "";
  orderDto: Order = new Order();
  selection = new SelectionModel<OrderDetails>(true, []);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private orderDetailsService: OrderDetailsService,
    private pickupService: PickupService
  ) { }

  ngOnInit(): void {
    this.submitForm = this.fb.group(
      {
        formArray: this.fb.array([])
      }
    );

    this.saveForm = this.fb.group(
      {
        pickupDate: ['', Validators.required],
      }
    );

    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
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

  getFormArray(index: number, controlName: string): FormControl {
    return (this.formArray.at(index) as FormGroup).get(controlName) as FormControl;
  }

  get formArray() {
    return this.submitForm.controls['formArray'] as FormArray;
  }

  ngAfterViewInit() {
    this.assignPageData();
  }

  assignPageData() {
    this.orderDetailsService.fetchNotFulfilledByOrderId(this.orderId).subscribe({
      next: (response: OrderDetails[]) => {
        this.submitForm.controls['formArray'] = this.fb.array([]);
        this.pageData = response.map((obj: any) => {
          let formControl = this.fb.group({
            pickupQuantity: new FormControl({ value: '', disabled: true }, [Validators.required, quantityValidator(obj.orderedQuantity - obj.fulfilledQuantity)]),
          });
          this.formArray.push(formControl);
          return { 'quantity': obj.orderedQuantity - obj.fulfilledQuantity, ...obj };
        });
        this.dataSource = new MatTableDataSource(this.pageData);
      },
      error: (error) => {

      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.elementArray = [];
    if (this.isAllSelected()) {
      this.selection.clear();
      for (let i = 0; i < this.formArray.length; i++) {
        this.getFormArray(i, 'pickupQuantity').setValue('');
        this.getFormArray(i, 'pickupQuantity').disable();
      }
      return;
    }

    for (let i = 0; i < this.formArray.length; i++) {
      this.getFormArray(i, 'pickupQuantity').enable();
      this.elementArray.push({ 'selectedIndex': i, ...this.pageData[i] });
    }

    this.selection.select(...this.dataSource.data);
  }

  toggleEachRow(element: any, index: any) {
    if (!this.selection.isSelected(element)) {
      this.getFormArray(index, 'pickupQuantity').setValue('');
      this.getFormArray(index, 'pickupQuantity').disable();
      let i = this.elementArray.findIndex(obj => obj.id == element.id);
      this.elementArray.splice(i, 1);
    } else {
      this.getFormArray(index, 'pickupQuantity').enable();
      this.elementArray.push({ 'selectedIndex': index, ...element });
    }

    if (this.isAllSelected()) {
      this.elementArray = [];
      for (let i = 0; i < this.formArray.length; i++) {
        this.elementArray.push({ 'selectedIndex': i, ...this.pageData[i] });
      }
    }
  }

  submit(): void {
    this.submitted = true;
    if (this.submitForm.invalid) {
      return;
    }
    if (this.pageData.length == 0) {
      this.toastrService.warning("There are no order details for pickup.", "Not Found");
      return;
    }
    if (this.elementArray.length == 0) {
      this.toastrService.warning("Please select order details for pickup.", "Not Finished");
      return;
    }

    let deletedElementArray = [];
    for (let i = 0; i < this.elementArray.length; i++) {
      let index = this.elementArray[i].selectedIndex;

      let pickupQuantity = this.getFormArray(index, 'pickupQuantity').value;
      let findIndex = this.cartData.findIndex(obj => obj.id == this.elementArray[i].id);

      if (findIndex != -1) {
        this.cartData[findIndex].pickupQuantity = Number(this.cartData[findIndex].pickupQuantity) + Number(pickupQuantity);
      } else {
        this.cartData.push({ ...this.elementArray[i], 'pickupQuantity': pickupQuantity });
      }

      this.pageData[index].quantity -= pickupQuantity;

      if (this.pageData[index].quantity == 0) {
        deletedElementArray.push(this.pageData[index]);
      } else {
        this.getFormArray(index, 'pickupQuantity').clearValidators();
        this.getFormArray(index, 'pickupQuantity').addValidators([Validators.required, quantityValidator(this.pageData[index].quantity)]);
      }
    }

    for (let i = 0; i < deletedElementArray.length; i++) {
      let id = deletedElementArray[i].id;
      let index = this.pageData.findIndex(obj => obj.id == id);
      this.pageData.splice(index, 1);
      this.formArray.removeAt(index);
    }

    this.dataSource = new MatTableDataSource(this.pageData);
    this.cartDataSource = new MatTableDataSource(this.cartData);
    this.resetSubmitForm();
  }

  save(): void {
    this.saved = true;
    if (this.saveForm.invalid) {
      return;
    }
    if (this.cartData.length == 0) {
      this.toastrService.warning("Please add order details to pickup cart.", "Not Finished");
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'create'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestDto: PickupCart = new PickupCart();
        requestDto.pickupDate = format(this.saveForm.get('pickupDate')!.value, "yyyy-MM-dd");
        requestDto.pickupCart = [];

        for (let i = 0; i < this.cartData.length; i++) {
          let cartItem: PickupDetails = new PickupDetails();
          cartItem.pickupQuantity = this.cartData[i].pickupQuantity;
          cartItem.orderDetails.id = this.cartData[i].id;
          requestDto.pickupCart.push(cartItem);
        }

        this.pickupService.create(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.back();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.error("Pickup quantity should not be more than ordered quantity.", error.error.title);
            }
          }
        });
      }
    });
  }

  resetSubmitForm(): void {
    this.selection.clear();
    for (let i = 0; i < this.formArray.length; i++) {
      this.getFormArray(i, 'pickupQuantity').setValue('');
      this.getFormArray(i, 'pickupQuantity').disable();
    }
    this.elementArray = [];
  }

  resetSaveForm(): void {
    this.resetSubmitForm();
    this.saved = false;
    this.saveFormDirective.resetForm();
    this.cartData = [];
    this.assignPageData();
    this.cartDataSource = new MatTableDataSource(this.cartData);
  }

  back(): void {
    this.router.navigate(['/app/pickup/create']);
  }

}
