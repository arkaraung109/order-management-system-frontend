import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { HttpResponse } from '../common/HttpResponse';
import { DeliveryRouteCart } from '../model/DeliveryRouteCart';
import { PaginationResponse } from '../common/PaginationResponse';
import { DeliveryRoute } from '../model/DeliveryRoute';

@Injectable({
  providedIn: 'root'
})
export class DeliveryRouteService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: string): Observable<DeliveryRoute> {
    return this.http.get<DeliveryRoute>(`${environment.baseUrl}/deliveryRoute/findById?id=${id}`, { responseType: "json" });
  }

  fetchPage(startDate: string = "", endDate: string = "", pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<DeliveryRoute>> {
    return this.http.get<PaginationResponse<DeliveryRoute>>(`${environment.baseUrl}/deliveryRoute/findPage?startDate=${startDate}&endDate=${endDate}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  create(requestDto: DeliveryRouteCart): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/deliveryRoute/create`, requestDto, { responseType: "json" });
  }

  update(requestDto: DeliveryRoute): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/deliveryRoute/update`, requestDto, { responseType: "json" });
  }

  delete(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/deliveryRoute/delete/${id}`, { responseType: "json" });
  }

}
