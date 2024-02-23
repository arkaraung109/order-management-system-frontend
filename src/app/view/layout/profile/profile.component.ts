import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/model/User';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';
import { containSpaceValidator } from 'src/app/validator/containSpace.validator';
import { startWithSpaceValidator } from 'src/app/validator/startWithSpace.validator';
import { PasswordDialogComponent } from '../../share/password-dialog/password-dialog.component';
import { customValidator } from 'src/app/validator/custom.validator';
import { HttpStatusCode } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  userDto: User = new User();
  jwtHelperService: JwtHelperService = new JwtHelperService();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private authService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    let jwtToken = this.authService.fetchJwtToken();
    let username = this.jwtHelperService.decodeToken(jwtToken)!.username;

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"), startWithSpaceValidator()]],
      email: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^([\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4})$"), startWithSpaceValidator(), containSpaceValidator(), customValidator('duplication')]],
      phone: ['', [Validators.required, Validators.pattern("^(09-[0-9]{7,9})|(09\\s*[0-9]{7,9})$"), startWithSpaceValidator()]],
      username: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }]
    });

    this.userService.fetchByUsername(username).subscribe({
      next: (response: User) => {
        this.userDto = response;
        this.form.setValue({
          name: response.name,
          email: response.email,
          phone: response.phone,
          username: response.username,
          role: response.role.name
        });
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.toastrService.error(error.error.message, error.error.title);
        }
      }
    });
  }

  update(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let requestDto: User = new User();
    requestDto.name = this.form.get('name')!.value.trim();
    requestDto.email = this.form.get('email')!.value.trim();
    requestDto.phone = this.form.get('phone')!.value.trim();

    this.matDialog.open(PasswordDialogComponent, {
      width: '400px', data: { dto: requestDto, form: this.form }
    });
  }

  reset(): void {
    this.form.setValue({
      name: this.userDto.name,
      email: this.userDto.email,
      phone: this.userDto.phone,
      username: this.userDto.username,
      role: this.userDto.role.name
    });
  }

  back(): void {
    this.router.navigate(['/app/dashboard']);
  }

}
