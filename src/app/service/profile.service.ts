import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PasswordChange } from '../model/PasswordChange';
import { Observable } from 'rxjs';
import { HttpResponse } from '../common/HttpResponse';
import { environment } from 'src/environment/environment';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient
  ) { }

  changePassword(requestDto: PasswordChange): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/profile/changePassword`, requestDto, { responseType: "json" });
  }

  update(requestDto: User): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/profile/update`, requestDto, { responseType: "json" });
  }

}
