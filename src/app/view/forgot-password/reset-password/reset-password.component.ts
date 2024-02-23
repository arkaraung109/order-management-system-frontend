import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { PasswordReset } from 'src/app/model/PasswordReset';
import { ForgotPasswordService } from 'src/app/service/forgot-password.service';
import { UserService } from 'src/app/service/user.service';
import { passwordMatchValidator } from 'src/app/validator/passwordMatch.validator';
import { ConfirmDialogComponent } from '../../share/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { passwordValidator } from 'src/app/validator/password.validator';
import { RandomPasswordService } from 'src/app/service/random-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  token!: string;
  form!: FormGroup;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  submitted: boolean = false;
  valid: boolean = false;
  reset: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private randomPasswordService: RandomPasswordService,
    private forgotPasswordService: ForgotPasswordService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    this.userService.findExistByPasswordResetToken(this.token).subscribe(exist => {
      if (exist) {
        this.valid = true;
      }
    });

    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), passwordValidator()]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: passwordMatchValidator('newPassword', 'confirmPassword')
      }
    );
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let requestDto: PasswordReset = new PasswordReset();
    requestDto.passwordResetToken = this.token;
    requestDto.newPassword = this.form.get('newPassword')!.value;

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'reset password'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.forgotPasswordService.resetPassword(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.reset = true;
            this.toastrService.success(response.message, "Password Reset");
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotFound) {
              this.toastrService.error(error.error.message, "Invalid Token");
            }
          }
        });
      }
    });
  }

  generateRandom(): void {
    var generatedPassword = this.randomPasswordService.generate();
    this.form.get('newPassword')!.setValue(generatedPassword);
    this.form.get('confirmPassword')!.setValue(generatedPassword);
    this.hideNewPassword = false;
    this.hideConfirmPassword = false;
  }

}
