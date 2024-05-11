import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../share/confirm-dialog/confirm-dialog.component';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { HttpStatusCode } from '@angular/common/http';
import { PaymentService } from 'src/app/service/payment.service';
import { Payment } from 'src/app/model/Payment';
import { OrderService } from 'src/app/service/order.service';
import { quantityValidator } from 'src/app/validator/quantity.validator';
import { Order } from 'src/app/model/Order';
import { format } from 'date-fns';

@Component({
  selector: 'app-payment-details-create',
  templateUrl: './payment-details-create.component.html',
  styleUrls: ['./payment-details-create.component.scss']
})
export class PaymentDetailsCreateComponent implements OnInit {

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  form!: FormGroup;
  submitted: boolean = false;
  orderId: string = "";
  orderDto: Order = new Order();
  remainingAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private orderService: OrderService,
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
      this.orderId = params['orderId'];
    });

    this.orderService.fetchById(this.orderId).subscribe({
      next: (response: Order) => {
        this.orderDto = response;
        this.remainingAmount = this.orderDto.orderedAmount - this.orderDto.paidAmount;
        this.form.get('amount')!.addValidators([quantityValidator(Number(this.remainingAmount))]);
        this.form.get('amount')!.setValue(this.remainingAmount);
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.toastrService.error(error.error.message, error.error.title);
        }
        this.back();
      }
    });
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
        let requestDto: Payment = new Payment();
        requestDto.amount = this.form.get('amount')!.value;
        requestDto.paymentDate = format(this.form.get('paymentDate')!.value, "yyyy-MM-dd");
        requestDto.paymentType = this.form.get('paymentType')!.value;
        requestDto.order = this.orderDto;
        requestDto.order.paidAmount += Number(requestDto.amount);

        this.paymentService.create(requestDto).subscribe({
          next: (response: HttpResponse) => {
            const moreDialogRef = this.matDialog.open(ConfirmDialogComponent, {
              width: '300px', data: 'create more'
            });

            moreDialogRef.afterClosed().subscribe(result => {
              localStorage.removeItem("pageIndex");
              localStorage.removeItem("pageSize");
              localStorage.removeItem("customerName");
              localStorage.removeItem("startDate");
              localStorage.removeItem("endDate");

              if (result) {
                this.back();
              } else {
                this.router.navigate(['/app/payment']);
              }
            });

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
    this.submitted = false;
    this.formDirective.resetForm();
    this.form.setValue({
      amount: this.orderDto.orderedAmount,
    });
  }

  back(): void {
    this.router.navigate(['/app/payment/create']);
  }

}
