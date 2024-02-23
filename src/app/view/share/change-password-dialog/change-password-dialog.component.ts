import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from 'src/app/validator/passwordMatch.validator';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { passwordValidator } from 'src/app/validator/password.validator';
import { PasswordChange } from 'src/app/model/PasswordChange';
import { ProfileService } from 'src/app/service/profile.service';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { ToastrService } from 'ngx-toastr';
import { HttpStatusCode } from '@angular/common/http';
import { customValidator } from 'src/app/validator/custom.validator';
import { RandomPasswordService } from 'src/app/service/random-password.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private randomPasswordService: RandomPasswordService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        oldPassword: ['', [Validators.required, customValidator('wrongOldPassword')]],
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

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'change new password'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestDto: PasswordChange = new PasswordChange();
        requestDto.oldPassword = this.form.get('oldPassword')!.value;
        requestDto.newPassword = this.form.get('newPassword')!.value;

        this.profileService.changePassword(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.matDialog.closeAll();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotFound) {
              this.toastrService.error(error.error.message, error.error.title);
            } else if (error.status == HttpStatusCode.Unauthorized) {
              this.form.get('oldPassword')!.setErrors({ required: false, wrongOldPassword: true });
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
