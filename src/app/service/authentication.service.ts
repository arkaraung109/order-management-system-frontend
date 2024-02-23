import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { JWTToken } from '../model/JWTToken';
import { AuthRequest } from '../model/AuthRequest';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  authenticate(requestDto: AuthRequest): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/authenticate`, requestDto, { responseType: "json" });
  }

  storeJwtToken(jwtToken: JWTToken): void {
    localStorage.setItem('access_token', jwtToken.access_token);
  }

  fetchJwtToken(): string {
    return localStorage.getItem('access_token')!;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/auth/sign-in']);
  }

}
