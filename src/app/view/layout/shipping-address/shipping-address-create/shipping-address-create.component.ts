import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { startWithSpaceValidator } from 'src/app/validator/startWithSpace.validator';
import { ConfirmDialogComponent } from '../../../share/confirm-dialog/confirm-dialog.component';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { customValidator } from 'src/app/validator/custom.validator';
import { HttpStatusCode } from '@angular/common/http';
import { ShippingAddressService } from 'src/app/service/shipping-address.service';
import { ShippingAddress } from 'src/app/model/ShippingAddress';

@Component({
  selector: 'app-shipping-address-create',
  templateUrl: './shipping-address-create.component.html',
  styleUrls: ['./shipping-address-create.component.scss']
})
export class ShippingAddressCreateComponent implements OnInit {

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  form!: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private shippingAddressService: ShippingAddressService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      { address: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"), startWithSpaceValidator(), customValidator('duplication')]] }
    );
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
        let requestDto: ShippingAddress = new ShippingAddress();
        requestDto.address = this.form.get('address')!.value.trim();

        this.shippingAddressService.create(requestDto).subscribe({
          next: (response: HttpResponse) => {
            const moreDialogRef = this.matDialog.open(ConfirmDialogComponent, {
              width: '300px', data: 'create more'
            });

            moreDialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.reset();
              } else {
                this.back();
              }
            });

            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.Conflict) {
              this.form.get('address')!.setErrors({ required: false, duplication: true });
            }
          }
        });
      }
    });
  }

  reset(): void {
    this.submitted = false;
    this.formDirective.resetForm();
  }

  back(): void {
    this.router.navigate(['/app/shipping-address']);
  }

}
