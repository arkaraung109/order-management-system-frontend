import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../share/confirm-dialog/confirm-dialog.component';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { HttpStatusCode } from '@angular/common/http';
import { format } from 'date-fns';
import { Payment } from 'src/app/model/Payment';
import { PaymentService } from 'src/app/service/payment.service';
import { quantityValidator } from 'src/app/validator/quantity.validator';

@Component({
  selector: 'app-payment-update',
  templateUrl: './payment-update.component.html',
  styleUrls: ['./payment-update.component.scss']
})
export class PaymentUpdateComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  id: number = 0;
  paymentDto: Payment = new Payment();
  remainingAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        amount: ['', Validators.required],
        paymentDate: ['', Validators.required],
        paymentType: ['', Validators.required]
      }
    );

    this.route.queryParams.subscribe(params => {
      this.id = Number(params['id']);
    });

    this.paymentService.fetchById(this.id).subscribe({
      next: (response: Payment) => {
        this.remainingAmount = response.order.orderedAmount - response.order.paidAmount + response.amount;
        this.form.get('amount')!.setValue(response.amount);
        this.form.get('amount')!.addValidators([quantityValidator(Number(this.remainingAmount))]);
        this.form.get('paymentDate')!.setValue(response.paymentDate);
        this.form.get('paymentType')!.setValue(response.paymentType);
        this.paymentDto = response;
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
        let requestDto: Payment = new Payment();
        requestDto.id = this.paymentDto.id;
        requestDto.amount = this.form.get('amount')!.value;
        requestDto.paymentDate = format(this.form.get('paymentDate')!.value, "yyyy-MM-dd");
        requestDto.paymentType = this.form.get('paymentType')!.value;

        this.paymentService.update(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.back();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotFound || error.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.error(error.error.message, error.error.title);
            }
          }
        });
      }
    });
  }

  reset(): void {
    this.form.setValue({
      amount: this.paymentDto.amount,
      paymentDate: this.paymentDto.paymentDate,
      paymentType: this.paymentDto.paymentType
    });
  }

  back(): void {
    this.router.navigate(['/app/payment']);
  }

}
