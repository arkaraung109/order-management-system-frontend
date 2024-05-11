import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { Pickup } from 'src/app/model/Pickup';
import { PickupDetails } from 'src/app/model/PickupDetails';
import { PickupDetailsService } from 'src/app/service/pickup-details.service';
import { PickupService } from 'src/app/service/pickup.service';
import { quantityValidator } from 'src/app/validator/quantity.validator';
import { ConfirmDialogComponent } from 'src/app/view/share/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-pickup-details',
  templateUrl: './pickup-details.component.html',
  styleUrls: ['./pickup-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PickupDetailsComponent implements OnInit {

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  form!: FormGroup;
  submitted: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<PickupDetails> = new MatTableDataSource<PickupDetails>();
  displayedColumns: string[] = ['index', 'product', 'pickupQuantity', 'action'];
  pageData: any[] = [];
  pickupId: string = "";
  pickupDto: Pickup = new Pickup();
  pickupDetailsDto: PickupDetails = new PickupDetails();
  searchText: string = "";
  disable: boolean = true;
  maxQuantity: number = 1;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private pickupService: PickupService,
    private pickupDetailsService: PickupDetailsService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        pickupQuantity: [{ value: '', disabled: true }, Validators.required],
      }
    );

    this.route.queryParams.subscribe(params => {
      this.pickupId = params['pickupId'];
    });

    this.pickupService.fetchById(this.pickupId).subscribe({
      next: (response: Pickup) => {
        this.pickupDto = response;
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
    this.pickupDetailsService.fetchByPickupId(this.pickupId).subscribe({
      next: (response: PickupDetails[]) => {
        let index = 0;
        this.pageData = response.map(obj => {
          return { 'index': ++index, ...obj, 'action': true };
        });
        this.dataSource = new MatTableDataSource(this.pageData);
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (element: any, property) => {
          switch (property) {
            case 'index': return element.index;
            case 'product': return element.orderDetails?.product?.name;
            case 'pickupQuantity': return element.pickupQuantity;
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
        let requestDto: PickupDetails = new PickupDetails();
        requestDto.id = this.pickupDetailsDto.id;
        requestDto.pickupQuantity = this.form.get('pickupQuantity')!.value;
        requestDto.pickup = this.pickupDetailsDto.pickup;
        this.pickupDetailsDto.orderDetails.fulfilledQuantity += (requestDto.pickupQuantity - this.pickupDetailsDto.pickupQuantity);
        let fulfilledQuantity = this.pickupDetailsDto.orderDetails.fulfilledQuantity;
        let orderedQuantity = this.pickupDetailsDto.orderDetails.orderedQuantity;
        if (fulfilledQuantity < orderedQuantity) {
          this.pickupDetailsDto.orderDetails.fulfilmentStatus = 'Partially Fulfilled';
        } else if (fulfilledQuantity == orderedQuantity) {
          this.pickupDetailsDto.orderDetails.fulfilmentStatus = 'Fulfilled';
        }
        requestDto.orderDetails = this.pickupDetailsDto.orderDetails;

        this.pickupDetailsService.update(requestDto).subscribe({
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
    this.form.get('pickupQuantity')!.enable();

    this.pickupDetailsService.fetchById(id).subscribe({
      next: (response: PickupDetails) => {
        this.pickupDetailsDto = response;
        this.maxQuantity = response.pickupQuantity + response.orderDetails.orderedQuantity - response.orderDetails.fulfilledQuantity;
        this.form.get('pickupQuantity')!.clearValidators();
        this.form.get('pickupQuantity')!.addValidators([Validators.required, quantityValidator(this.maxQuantity)]);
        this.form.get('pickupQuantity')!.setValue(response.pickupQuantity);
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
        this.pickupDetailsService.delete(id).subscribe({
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
    this.router.navigate(['/app/pickup']);
  }

}
