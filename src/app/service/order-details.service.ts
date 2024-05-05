import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetails } from '../model/OrderDetails';
import { environment } from 'src/environment/environment';
import { HttpResponse } from '../common/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: number): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${environment.baseUrl}/orderDetails/findById?id=${id}`, { responseType: "json" });
  }

  fetchNotFulfilled(): Observable<OrderDetails[]> {
    return this.http.get<OrderDetails[]>(`${environment.baseUrl}/orderDetails/findNotFulfilled`, { responseType: "json" });
  }

  fetchNotFulfilledByOrderId(orderId: string): Observable<OrderDetails[]> {
    return this.http.get<OrderDetails[]>(`${environment.baseUrl}/orderDetails/findNotFulfilledByOrderId?orderId=${orderId}`, { responseType: "json" });
  }

  fetchByOrderId(orderId: string): Observable<OrderDetails[]> {
    return this.http.get<OrderDetails[]>(`${environment.baseUrl}/orderDetails/findByOrderId?orderId=${orderId}`, { responseType: "json" });
  }

  create(requestDto: OrderDetails): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/orderDetails/create`, requestDto, { responseType: "json" });
  }

  update(requestDto: OrderDetails): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/orderDetails/update`, requestDto, { responseType: "json" });
  }

  delete(id: number): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/orderDetails/delete/${id}`, { responseType: "json" });
  }

}
