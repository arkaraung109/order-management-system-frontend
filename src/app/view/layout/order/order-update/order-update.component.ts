import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../share/confirm-dialog/confirm-dialog.component';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { HttpStatusCode } from '@angular/common/http';
import { Customer } from 'src/app/model/Customer';
import { CustomerService } from 'src/app/service/customer.service';
import { Order } from 'src/app/model/Order';
import { OrderService } from 'src/app/service/order.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-order-update',
  templateUrl: './order-update.component.html',
  styleUrls: ['./order-update.component.scss']
})
export class OrderUpdateComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  id: string = "";
  orderDto: Order = new Order();
  customerList: Customer[] = [];
  searchText: string = "";

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private customerService: CustomerService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        orderDate: ['', Validators.required],
        customer: ['', Validators.required]
      }
    );

    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.customerService.fetchAll().subscribe(data => {
      this.customerList = data;
    });

    this.orderService.fetchById(this.id).subscribe({
      next: (response: Order) => {
        this.form.get('orderDate')!.setValue(response.orderDate);
        this.form.get('customer')!.setValue(response.customer.id);
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
        let requestDto: Order = new Order();
        requestDto.id = this.orderDto.id;
        requestDto.orderDate = format(this.form.get('orderDate')!.value, "yyyy-MM-dd");
        requestDto.customer.id = this.form.get('customer')!.value;

        this.orderService.update(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.back();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotFound) {
              this.toastrService.error(error.error.message, error.error.title);
            } else if (error.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.error("Either order fulfilment or payment is in progress, so it cannot be updated.", error.error.title);
            }
          }
        });
      }
    });
  }

  reset(): void {
    this.form.setValue({
      orderDate: this.orderDto.orderDate,
      customer: this.orderDto.customer.id
    });
  }

  back(): void {
    this.router.navigate(['/app/order']);
  }

}
