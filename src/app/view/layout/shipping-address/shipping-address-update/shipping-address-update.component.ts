import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { startWithSpaceValidator } from 'src/app/validator/startWithSpace.validator';
import { ConfirmDialogComponent } from '../../../share/confirm-dialog/confirm-dialog.component';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { customValidator } from 'src/app/validator/custom.validator';
import { HttpStatusCode } from '@angular/common/http';
import { ShippingAddress } from 'src/app/model/ShippingAddress';
import { ShippingAddressService } from 'src/app/service/shipping-address.service';

@Component({
  selector: 'app-shipping-address-update',
  templateUrl: './shipping-address-update.component.html',
  styleUrls: ['./shipping-address-update.component.scss']
})
export class ShippingAddressUpdateComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  id: number = 0;
  shippingAddressDto: ShippingAddress = new ShippingAddress();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private shippingAddressService: ShippingAddressService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      { address: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"), startWithSpaceValidator(), customValidator('duplication')]] }
    );

    this.route.queryParams.subscribe(params => {
      this.id = Number(params['id']);
    });

    this.shippingAddressService.fetchById(this.id).subscribe({
      next: (response: ShippingAddress) => {
        this.form.get('address')!.setValue(response.address);
        this.shippingAddressDto = response;
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.toastrService.error(error.error.message, error.error.title);
        }
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
        let requestDto: ShippingAddress = new ShippingAddress();
        requestDto.id = this.shippingAddressDto.id;
        requestDto.address = this.form.get('address')!.value.trim();

        this.shippingAddressService.update(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.back();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotFound) {
              this.toastrService.error(error.error.message, error.error.title);
            } else if (error.status == HttpStatusCode.Conflict) {
              this.form.get('address')!.setErrors({ required: false, duplication: true });
            }
          }
        });
      }
    });
  }

  reset(): void {
    this.form.setValue({
      address: this.shippingAddressDto.address
    });
  }

  back(): void {
    this.router.navigate(['/app/shipping-address']);
  }

}
