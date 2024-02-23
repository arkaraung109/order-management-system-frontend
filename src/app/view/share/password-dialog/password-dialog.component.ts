import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProfileService } from 'src/app/service/profile.service';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpStatusCode } from '@angular/common/http';
import { customValidator } from 'src/app/validator/custom.validator';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  hideOldPassword: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required, customValidator('wrongOldPassword')]],
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'update user profile'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.dto.oldPassword = this.form.get('oldPassword')!.value;

        this.profileService.update(this.data.dto).subscribe({
          next: (response: HttpResponse) => {
            this.router.navigate(['/app/dashboard']).then(() => {
              this.matDialog.closeAll();
              this.toastrService.success(response.message, response.title);
            });
          },
          error: (error) => {
            if (error.status == HttpStatusCode.Unauthorized) {
              this.form.get('oldPassword')!.setErrors({ required: false, wrongOldPassword: true });
            } else {
              this.matDialog.closeAll();

              if (error.status == HttpStatusCode.NotFound) {
                this.toastrService.error(error.error.message, error.error.title);
              } else if (error.status == HttpStatusCode.Conflict) {
                this.data.form.get('email')!.setErrors({ required: false, duplication: true });
              }
            }
          }
        });
      }
    });
  }

}
