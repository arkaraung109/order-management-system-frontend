import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { DeliveryRoute } from 'src/app/model/DeliveryRoute';
import { DeliveryRouteDetails } from 'src/app/model/DeliveryRouteDetails';
import { ShippingAddress } from 'src/app/model/ShippingAddress';
import { DeliveryRouteDetailsService } from 'src/app/service/delivery-route-details.service';
import { DeliveryRouteService } from 'src/app/service/delivery-route.service';
import { ShippingAddressService } from 'src/app/service/shipping-address.service';
import { quantityValidator } from 'src/app/validator/quantity.validator';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-delivery-route-details',
  templateUrl: './delivery-route-details.component.html',
  styleUrls: ['./delivery-route-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryRouteDetailsComponent implements OnInit {

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  form!: FormGroup;
  submitted: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<DeliveryRouteDetails> = new MatTableDataSource<DeliveryRouteDetails>();
  displayedColumns: string[] = ['index', 'orderId', 'customer', 'orderDate', 'product', 'category', 'deliveredQuantity', 'shippingAddress', 'action'];
  pageData: any[] = [];
  shippingAddressList: ShippingAddress[] = [];
  deliveryRouteId: string = "";
  deliveryRouteDto: DeliveryRoute = new DeliveryRoute();
  deliveryRouteDetailsDto: DeliveryRouteDetails = new DeliveryRouteDetails();
  searchText: string = "";
  disable: boolean = true;
  maxQuantity: number = 1;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private shippingAddressService: ShippingAddressService,
    private deliveryRouteService: DeliveryRouteService,
    private deliveryRouteDetailsService: DeliveryRouteDetailsService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        deliveredQuantity: [{ value: '', disabled: true }, Validators.required],
        shippingAddress: [{ value: '', disabled: true }, Validators.required]
      }
    );

    this.route.queryParams.subscribe(params => {
      this.deliveryRouteId = params['deliveryRouteId'];
    });

    this.shippingAddressService.fetchAll().subscribe(data => {
      this.shippingAddressList = data;
    });

    this.deliveryRouteService.fetchById(this.deliveryRouteId).subscribe({
      next: (response: DeliveryRoute) => {
        this.deliveryRouteDto = response;
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
    this.deliveryRouteDetailsService.fetchByDeliveryRouteId(this.deliveryRouteId).subscribe({
      next: (response: DeliveryRouteDetails[]) => {
        let index = 0;
        this.pageData = response.map(obj => {
          return { 'index': ++index, ...obj, 'action': true };
        });
        this.dataSource = new MatTableDataSource(this.pageData);
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (element: any, property) => {
          switch (property) {
            case 'index': return element.index;
            case 'orderId': return element.orderDetails?.order?.id;
            case 'customer': return element.orderDetails?.order?.customer?.name;
            case 'orderDate': return element.orderDetails?.order?.orderDate;
            case 'product': return element.orderDetails?.product?.name;
            case 'category': return element.orderDetails?.product?.category?.name;
            case 'deliveredQuantity': return element.deliveredQuantity;
            case 'shippingAddress': return element.shippingAddress?.address;
            default: return 0;
          }
        };
      },
      error: (error) => {
        this.back();
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
        let requestDto: DeliveryRouteDetails = new DeliveryRouteDetails();
        requestDto.id = this.deliveryRouteDetailsDto.id;
        requestDto.deliveredQuantity = this.form.get('deliveredQuantity')!.value;
        requestDto.shippingAddress.id = this.form.get('shippingAddress')!.value;
        requestDto.deliveryRoute = this.deliveryRouteDetailsDto.deliveryRoute;
        this.deliveryRouteDetailsDto.orderDetails.fulfilledQuantity += (requestDto.deliveredQuantity - this.deliveryRouteDetailsDto.deliveredQuantity);
        let fulfilledQuantity = this.deliveryRouteDetailsDto.orderDetails.fulfilledQuantity;
        let orderedQuantity = this.deliveryRouteDetailsDto.orderDetails.orderedQuantity;
        if (fulfilledQuantity < orderedQuantity) {
          this.deliveryRouteDetailsDto.orderDetails.fulfilmentStatus = 'Partially Fulfilled';
        } else if (fulfilledQuantity == orderedQuantity) {
          this.deliveryRouteDetailsDto.orderDetails.fulfilmentStatus = 'Fulfilled';
        }
        requestDto.orderDetails = this.deliveryRouteDetailsDto.orderDetails;

        this.deliveryRouteDetailsService.update(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.assignPageData();
            this.toastrService.success(response.message, response.title);
            this.reset();
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

  edit(id: number): void {
    this.disable = false;
    this.form.get('deliveredQuantity')!.enable();
    this.form.get('shippingAddress')!.enable();

    this.deliveryRouteDetailsService.fetchById(id).subscribe({
      next: (response: DeliveryRouteDetails) => {
        let shippingAddress = this.shippingAddressList.find(c => c.id == response.shippingAddress.id);
        if (shippingAddress) {
          this.deliveryRouteDetailsDto = response;
          this.maxQuantity = response.deliveredQuantity + response.orderDetails.orderedQuantity - response.orderDetails.fulfilledQuantity;
          this.form.get('deliveredQuantity')!.clearValidators();
          this.form.get('deliveredQuantity')!.addValidators([Validators.required, quantityValidator(this.maxQuantity)]);
          this.form.get('deliveredQuantity')!.setValue(response.deliveredQuantity);
          this.form.get('shippingAddress')!.setValue(shippingAddress.id);
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
        this.deliveryRouteDetailsService.delete(id).subscribe({
          next: (response: HttpResponse) => {
            this.assignPageData();
            this.toastrService.success(response.message, response.title);
            this.reset();
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

  reset(): void {
    this.submitted = false;
    this.formDirective.resetForm();
    this.disable = true;
  }

  back(): void {
    this.router.navigate(['/app/delivery-route']);
  }

}
