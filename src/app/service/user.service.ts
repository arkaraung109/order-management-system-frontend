import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { HttpResponse } from '../common/HttpResponse';
import { PaginationResponse } from '../common/PaginationResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  findExistByPasswordResetToken(token: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.baseUrl}/user/findExistByPasswordResetToken?token=${token}`, { responseType: "json" });
  }

  fetchByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${environment.baseUrl}/user/findByUsername?username=${username}`, { responseType: "json" });
  }

  fetchPage(roleName: string = "", keyword: string = "", pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<User>> {
    return this.http.get<PaginationResponse<User>>(`${environment.baseUrl}/user/findPage?roleName=${roleName}&keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  create(requestDto: User): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/user/create`, requestDto, { responseType: "json" });
  }

  activate(token: String): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/user/activate`, token, { responseType: "json" });
  }

  changeStatus(id: number): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/user/changeStatus`, id, { responseType: "json" });
  }

}
