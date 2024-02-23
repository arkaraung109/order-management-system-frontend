import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';



@NgModule({
  declarations: [
    SpinnerComponent,
    ConfirmDialogComponent,
    ChangePasswordDialogComponent,
    PasswordDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Angular Material Modules
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    SpinnerComponent
  ]
})
export class ShareModule { }
