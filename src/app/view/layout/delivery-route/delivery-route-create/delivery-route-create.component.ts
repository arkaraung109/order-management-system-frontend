import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { OrderDetails } from 'src/app/model/OrderDetails';
import { OrderDetailsService } from 'src/app/service/order-details.service';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ShippingAddress } from 'src/app/model/ShippingAddress';
import { ShippingAddressService } from 'src/app/service/shipping-address.service';
import { DeliveryRouteCart } from 'src/app/model/DeliveryRouteCart';
import { DeliveryRouteDetails } from 'src/app/model/DeliveryRouteDetails';
import { DeliveryRouteService } from 'src/app/service/delivery-route.service';
import { quantityValidator } from 'src/app/validator/quantity.validator';

@Component({
  selector: 'app-delivery-route-create',
  templateUrl: './delivery-route-create.component.html',
  styleUrls: ['./delivery-route-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryRouteCreateComponent implements OnInit {

  @ViewChild("submitFormDirective") submitFormDirective!: FormGroupDirective;
  @ViewChild("saveFormDirective") saveFormDirective!: FormGroupDirective;
  submitForm!: FormGroup;
  saveForm!: FormGroup;
  submitted: boolean = false;
  saved: boolean = false;
  dataSource: MatTableDataSource<OrderDetails> = new MatTableDataSource<OrderDetails>();
  cartDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['select', 'nonSortIndex', 'nonSortOrderId', 'nonSortCustomer', 'nonSortOrderDate', 'nonSortProduct', 'nonSortQuantity', 'nonSortDeliveredQuantity', 'nonSortShippingAddress'];
  displayedColumnsForCart: string[] = ['nonSortIndex', 'nonSortOrderId', 'nonSortCustomer', 'nonSortOrderDate', 'nonSortProduct', 'nonSortDeliveredQuantity', 'nonSortShippingAddress'];
  elementArray: any[] = [];
  allElementArray: any[] = [];
  pageData: any[] = [];
  cartData: any[] = [];
  shippingAddressList: ShippingAddress[] = [];
  selection = new SelectionModel<OrderDetails>(true, []);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private shippingAddressService: ShippingAddressService,
    private orderDetailsService: OrderDetailsService,
    private deliveryRouteService: DeliveryRouteService
  ) { }

  ngOnInit(): void {
    this.submitForm = this.fb.group(
      {
        formArray: this.fb.array([])
      }
    );

    this.saveForm = this.fb.group(
      {
        deliveryDate: ['', Validators.required],
      }
    );

    this.shippingAddressService.fetchAll().subscribe(data => {
      this.shippingAddressList = data;
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
    this.orderDetailsService.fetchNotFulfilled().subscribe({
      next: (response: OrderDetails[]) => {
        this.submitForm.controls['formArray'] = this.fb.array([]);
        this.pageData = response.map((obj: any) => {
          let formControl = this.fb.group({
            deliveredQuantity: new FormControl({ value: '', disabled: true }, [Validators.required, quantityValidator(obj.orderedQuantity - obj.fulfilledQuantity)]),
            shippingAddress: new FormControl({ value: '', disabled: true }, [Validators.required])
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
        this.getFormArray(i, 'deliveredQuantity').setValue('');
        this.getFormArray(i, 'shippingAddress').setValue('');
        this.getFormArray(i, 'deliveredQuantity').disable();
        this.getFormArray(i, 'shippingAddress').disable();
      }
      return;
    }

    for (let i = 0; i < this.formArray.length; i++) {
      this.getFormArray(i, 'deliveredQuantity').enable();
      this.getFormArray(i, 'shippingAddress').enable();
      this.elementArray.push({ 'selectedIndex': i, ...this.pageData[i] });
    }

    this.selection.select(...this.dataSource.data);
  }

  toggleEachRow(element: any, index: any) {
    if (!this.selection.isSelected(element)) {
      this.getFormArray(index, 'deliveredQuantity').setValue('');
      this.getFormArray(index, 'shippingAddress').setValue('');
      this.getFormArray(index, 'deliveredQuantity').disable();
      this.getFormArray(index, 'shippingAddress').disable();
      let i = this.elementArray.findIndex(obj => obj.id == element.id);
      this.elementArray.splice(i, 1);
    } else {
      this.getFormArray(index, 'deliveredQuantity').enable();
      this.getFormArray(index, 'shippingAddress').enable();
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
      this.toastrService.warning("There are no order details for delivery.", "Not Found");
      return;
    }
    if (this.elementArray.length == 0) {
      this.toastrService.warning("Please select order details for delivery.", "Not Finished");
      return;
    }

    let deletedElementArray = [];
    for (let i = 0; i < this.elementArray.length; i++) {
      let index = this.elementArray[i].selectedIndex;

      let deliveredQuantity = this.getFormArray(index, 'deliveredQuantity').value;
      let shippingAddress = this.getFormArray(index, 'shippingAddress').value;
      let findIndex = this.cartData.findIndex(obj => obj.id == this.elementArray[i].id && obj.shippingAddress == shippingAddress);

      if (findIndex != -1) {
        this.cartData[findIndex].deliveredQuantity = Number(this.cartData[findIndex].deliveredQuantity) + Number(deliveredQuantity);
      } else {
        this.cartData.push({ ...this.elementArray[i], 'deliveredQuantity': deliveredQuantity, 'shippingAddress': shippingAddress });
      }

      this.pageData[index].quantity -= deliveredQuantity;

      if (this.pageData[index].quantity == 0) {
        deletedElementArray.push(this.pageData[index]);
      } else {
        this.getFormArray(index, 'deliveredQuantity').clearValidators();
        this.getFormArray(index, 'deliveredQuantity').addValidators([Validators.required, quantityValidator(this.pageData[index].quantity)]);
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
    this.toastrService.success("Successfully created.", "Delivery Route Details Creation");
  }

  save(): void {
    this.saved = true;
    if (this.saveForm.invalid) {
      return;
    }
    if (this.cartData.length == 0) {
      this.toastrService.warning("Please add order details to delivery route cart.", "Not Finished");
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'create'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestDto: DeliveryRouteCart = new DeliveryRouteCart();
        requestDto.deliveryDate = format(this.saveForm.get('deliveryDate')!.value, "yyyy-MM-dd");
        requestDto.deliveryRouteCart = [];

        for (let i = 0; i < this.cartData.length; i++) {
          let cartItem: DeliveryRouteDetails = new DeliveryRouteDetails();
          cartItem.deliveredQuantity = this.cartData[i].deliveredQuantity;
          cartItem.shippingAddress = this.cartData[i].shippingAddress;
          cartItem.orderDetails.id = this.cartData[i].id;
          requestDto.deliveryRouteCart.push(cartItem);
        }

        this.deliveryRouteService.create(requestDto).subscribe({
          next: (response: HttpResponse) => {
            const moreDialogRef = this.matDialog.open(ConfirmDialogComponent, {
              width: '300px', data: 'create more'
            });

            moreDialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.resetSaveForm();
              } else {
                this.back();
              }
            });
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.error("Delivered quantity should not be more than ordered quantity.", error.error.title);
            }
          }
        });
      }
    });
  }

  resetSubmitForm(): void {
    this.selection.clear();
    for (let i = 0; i < this.formArray.length; i++) {
      this.getFormArray(i, 'deliveredQuantity').setValue('');
      this.getFormArray(i, 'shippingAddress').setValue('');
      this.getFormArray(i, 'deliveredQuantity').disable();
      this.getFormArray(i, 'shippingAddress').disable();
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
    this.router.navigate(['/app/delivery-route']);
  }

}
