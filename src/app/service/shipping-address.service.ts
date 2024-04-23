import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingAddress } from '../model/ShippingAddress';
import { environment } from 'src/environment/environment';
import { PaginationResponse } from '../common/PaginationResponse';
import { HttpResponse } from '../common/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class ShippingAddressService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: number): Observable<ShippingAddress> {
    return this.http.get<ShippingAddress>(`${environment.baseUrl}/shippingAddress/findById?id=${id}`, { responseType: "json" });
  }

  fetchAll(): Observable<ShippingAddress[]> {
    return this.http.get<ShippingAddress[]>(`${environment.baseUrl}/shippingAddress/findAll`, { responseType: "json" });
  }

  fetchPage(keyword: string, pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<ShippingAddress>> {
    return this.http.get<PaginationResponse<ShippingAddress>>(`${environment.baseUrl}/shippingAddress/findPage?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  create(requestDto: ShippingAddress): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/shippingAddress/create`, requestDto, { responseType: "json" });
  }

  update(requestDto: ShippingAddress): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/shippingAddress/update`, requestDto, { responseType: "json" });
  }

  delete(id: number): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/shippingAddress/delete/${id}`, { responseType: "json" });
  }

}
