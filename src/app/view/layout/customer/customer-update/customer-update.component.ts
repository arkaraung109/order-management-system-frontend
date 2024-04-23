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
import { Customer } from 'src/app/model/Customer';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.scss']
})
export class CustomerUpdateComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  id: number = 0;
  customerDto: Customer = new Customer();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"), startWithSpaceValidator(), customValidator('duplication')]],
        phone: ['', [Validators.required, Validators.pattern("^(09-[0-9]{7,9})|(09\\s*[0-9]{7,9})$"), startWithSpaceValidator()]],
      }
    );
    
    this.route.queryParams.subscribe(params => {
      this.id = Number(params['id']);
    });

    this.customerService.fetchById(this.id).subscribe({
      next: (response: Customer) => {
        this.form.get('name')!.setValue(response.name);
        this.form.get('phone')!.setValue(response.phone);
        this.customerDto = response;
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
        let requestDto: Customer = new Customer();
        requestDto.id = this.customerDto.id;
        requestDto.name = this.form.get('name')!.value.trim();
        requestDto.phone = this.form.get('phone')!.value.trim();

        this.customerService.update(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.back();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotFound) {
              this.toastrService.error(error.error.message, error.error.title);
            } else if (error.status == HttpStatusCode.Conflict) {
              this.form.get('name')!.setErrors({ required: false, duplication: true });
            }
          }
        });
      }
    });
  }

  reset(): void {
    this.form.setValue({
      name: this.customerDto.name,
      phone: this.customerDto.phone
    });
  }

  back(): void {
    this.router.navigate(['/app/customer']);
  }

}
