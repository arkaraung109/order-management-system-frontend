import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpStatusCode } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private toastrService: ToastrService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((error) => {
      if (error) {
        let statusCode = error.status;
        if (statusCode == HttpStatusCode.Unauthorized) {
          if (error.error.title != "Bad Credentials") {
            localStorage.removeItem('access_token');
            this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
          }
        } else if (statusCode == HttpStatusCode.Forbidden) {
          this.router.navigate(['/error', HttpStatusCode.Forbidden]);
        } else if (statusCode == HttpStatusCode.BadRequest || statusCode == HttpStatusCode.Locked) {
          this.toastrService.error(error.error.message, error.error.title);
        } else if (statusCode == HttpStatusCode.NotFound || statusCode == HttpStatusCode.NotAcceptable || statusCode == HttpStatusCode.Conflict) {

        } else if (statusCode >= 400 && statusCode < 500) {
          this.toastrService.error("Something went wrong from client side.", "Client Error");
        } else if (statusCode >= 500) {
          this.toastrService.error("Please contact administrator.", "Server Error");
        } else {
          this.toastrService.error("Something went wrong.", "Unknown Error");
        }
      }
      throw error;
    }));
  }
}
