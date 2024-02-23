import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRequest } from 'src/app/model/AuthRequest';
import { JWTToken } from 'src/app/model/JWTToken';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { customValidator } from 'src/app/validator/custom.validator';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
  //encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit {

  form!: FormGroup;
  hide: boolean = true;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    let token = this.authService.fetchJwtToken();
    if (token) {
      this.router.navigate(['/app/dashboard']);
    }

    this.form = this.fb.group({
      username: ['', [Validators.required, customValidator('userNotFound')]],
      password: ['', [Validators.required, customValidator('wrongPassword')]]
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let requestDto: AuthRequest = new AuthRequest();
    requestDto.username = this.form.get('username')!.value.trim();
    requestDto.password = this.form.get('password')!.value;

    this.authService.authenticate(requestDto).subscribe({
      next: (response: JWTToken) => {
        this.authService.storeJwtToken(response);
        this.router.navigate(['/app/dashboard']);
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.form.get('username')!.setErrors({ required: false, userNotFound: true });
          this.form.get('password')!.setErrors(null);
        } else if (error.status == HttpStatusCode.Unauthorized) {
          this.form.get('username')!.setErrors(null);
          this.form.get('password')!.setErrors({ required: false, wrongPassword: true });
        }
      }
    });
  }

}
