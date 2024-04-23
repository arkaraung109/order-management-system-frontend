import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { HttpResponse } from '../common/HttpResponse';
import { PaginationResponse } from '../common/PaginationResponse';
import { Pickup } from '../model/Pickup';
import { PickupCart } from '../model/PickupCart';

@Injectable({
  providedIn: 'root'
})
export class PickupService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: string): Observable<Pickup> {
    return this.http.get<Pickup>(`${environment.baseUrl}/pickup/findById?id=${id}`, { responseType: "json" });
  }

  fetchPage(startDate: string = "", endDate: string = "", pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<Pickup>> {
    return this.http.get<PaginationResponse<Pickup>>(`${environment.baseUrl}/pickup/findPage?startDate=${startDate}&endDate=${endDate}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  create(requestDto: PickupCart): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/pickup/create`, requestDto, { responseType: "json" });
  }

  update(requestDto: Pickup): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/pickup/update`, requestDto, { responseType: "json" });
  }

  delete(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/pickup/delete/${id}`, { responseType: "json" });
  }

}
