import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environment/environment';
import { HttpResponse } from '../common/HttpResponse';
import { User } from '../model/User';
import { PasswordReset } from '../model/PasswordReset';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(
    private http: HttpClient
  ) { }

  sendPasswordResetEmail(username: String): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/forgotPassword/sendPasswordResetEmail`, username, { responseType: "json" });
  }

  resetPassword(requestDto: PasswordReset): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/forgotPassword/resetPassword`, requestDto, { responseType: "json" });
  }

}
