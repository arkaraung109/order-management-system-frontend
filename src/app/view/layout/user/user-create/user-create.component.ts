import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/service/user.service';
import { containSpaceValidator } from 'src/app/validator/containSpace.validator';
import { startWithSpaceValidator } from 'src/app/validator/startWithSpace.validator';
import { ConfirmDialogComponent } from '../../../share/confirm-dialog/confirm-dialog.component';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { passwordMatchValidator } from 'src/app/validator/passwordMatch.validator';
import { passwordValidator } from 'src/app/validator/password.validator';
import { RoleService } from 'src/app/service/role.service';
import { Role } from 'src/app/model/Role';
import { customValidator } from 'src/app/validator/custom.validator';
import { HttpStatusCode } from '@angular/common/http';
import { RandomPasswordService } from 'src/app/service/random-password.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {

  form!: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  submitted: boolean = false;
  roleList: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private randomPasswordService: RandomPasswordService,
    private userService: UserService,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"), startWithSpaceValidator()]],
        email: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^([\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4})$"), startWithSpaceValidator(), containSpaceValidator(), customValidator('duplication')]],
        phone: ['', [Validators.required, Validators.pattern("^(09-[0-9]{7,9})|(09\\s*[0-9]{7,9})$"), startWithSpaceValidator()]],
        username: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^[^<>~`!\\[\\]()\\&\\-,{}|@#^*+=:;/?%$\"\\\\]*$"), startWithSpaceValidator(), containSpaceValidator(), customValidator('duplication')]],
        role: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), passwordValidator()]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: passwordMatchValidator('password', 'confirmPassword')
      }
    );

    this.roleService.fetchAll().subscribe(data => {
      this.roleList = data;
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
        let requestDto: User = new User();
        requestDto.name = this.form.get('name')!.value.trim();
        requestDto.email = this.form.get('email')!.value.trim();
        requestDto.phone = this.form.get('phone')!.value.trim();
        requestDto.username = this.form.get('username')!.value.trim();
        requestDto.role.id = this.form.get('role')!.value;
        requestDto.password = this.form.get('password')!.value;

        this.userService.create(requestDto).subscribe({
          next: (response: HttpResponse) => {
            const moreDialogRef = this.matDialog.open(ConfirmDialogComponent, {
              width: '300px', data: 'create more'
            });

            moreDialogRef.afterClosed().subscribe(result => {
              if (result) {
                location.reload();
              } else {
                this.back();
              }
            });

            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.Conflict) {
              if (error.error.message == "Duplicated Email") {
                this.form.get('email')!.setErrors({ required: false, duplication: true });
              } else if (error.error.message == "Duplicated Username") {
                this.form.get('username')!.setErrors({ required: false, duplication: true });
              } else if (error.error.message == "Duplicated Email & Duplicated Username") {
                this.form.get('email')!.setErrors({ required: false, duplication: true });
                this.form.get('username')!.setErrors({ required: false, duplication: true });
              }
            }
          }
        });
      }
    });
  }

  generateRandom(): void {
    var generatedPassword = this.randomPasswordService.generate();
    this.form.get('password')!.setValue(generatedPassword);
    this.form.get('confirmPassword')!.setValue(generatedPassword);
    this.hidePassword = false;
    this.hideConfirmPassword = false;
  }

  reset(): void {
    this.form.reset();
  }

  back(): void {
    this.router.navigate(['/app/user']);
  }

}
