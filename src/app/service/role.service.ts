import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Role } from '../model/Role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private http: HttpClient
  ) { }

  fetchAll(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.baseUrl}/role/findAll`, { responseType: "json" });
  }

}
