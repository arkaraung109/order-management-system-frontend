import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { LoadingService } from '../service/loading.service';

const AUTHORIZATION_HEADER: string = 'Authorization';
const BARER: string = 'Bearer ';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(
    private loadingService: LoadingService,
    private authService: AuthenticationService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.totalRequests++;
    this.loadingService.setLoading(true);
    const jwtToken = this.authService.fetchJwtToken();

    if (jwtToken) {
      const cloned = request.clone({
        headers: request.headers.set(AUTHORIZATION_HEADER, `${BARER}${jwtToken}`)
      });

      return next.handle(cloned).pipe(
        finalize(() => {
          this.totalRequests--;
          if (this.totalRequests == 0) {
            this.loadingService.setLoading(false);
          }
        })
      );
    } else {
      return next.handle(request).pipe(
        finalize(() => {
          this.totalRequests--;
          if (this.totalRequests == 0) {
            this.loadingService.setLoading(false);
          }
        })
      );
    }
  }
}
