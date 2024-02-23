import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { ForgotPasswordService } from 'src/app/service/forgot-password.service';
import { customValidator } from 'src/app/validator/custom.validator';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  sent: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private forgotPasswordService: ForgotPasswordService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, customValidator('userNotFound')]]
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let username = this.form.get('username')!.value.trim();

    this.forgotPasswordService.sendPasswordResetEmail(username).subscribe({
      next: (response: HttpResponse) => {
        this.sent = true;
        this.toastrService.success(response.message, response.title);
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.form.get('username')!.setErrors({ required: false, userNotFound: true });
        }
      }
    });
  }

}
