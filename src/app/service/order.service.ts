import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../common/PaginationResponse';
import { environment } from 'src/environment/environment';
import { HttpResponse } from '../common/HttpResponse';
import { Order } from '../model/Order';
import { OrderCart } from '../model/OrderCart';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: string): Observable<Order> {
    return this.http.get<Order>(`${environment.baseUrl}/order/findById?id=${id}`, { responseType: "json" });
  }

  fetchNotFulfilled(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.baseUrl}/order/findNotFulfilled`, { responseType: "json" });
  }

  fetchPage(customerName: string = "", startDate: string = "", endDate: string = "", fulfilmentStatus: string = "", paymentStatus: string = "", pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<Order>> {
    return this.http.get<PaginationResponse<Order>>(`${environment.baseUrl}/order/findPage?customerName=${customerName}&startDate=${startDate}&endDate=${endDate}&fulfilmentStatus=${fulfilmentStatus}&paymentStatus=${paymentStatus}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  fetchNotFulfilledPage(customerName: string = "", startDate: string = "", endDate: string = "", pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<Order>> {
    return this.http.get<PaginationResponse<Order>>(`${environment.baseUrl}/order/findNotFulfilledPage?customerName=${customerName}&startDate=${startDate}&endDate=${endDate}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  fetchNotPaidPage(customerName: string = "", startDate: string = "", endDate: string = "", pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<Order>> {
    return this.http.get<PaginationResponse<Order>>(`${environment.baseUrl}/order/findNotPaidPage?customerName=${customerName}&startDate=${startDate}&endDate=${endDate}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  create(requestDto: OrderCart): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/order/create`, requestDto, { responseType: "json" });
  }

  update(requestDto: Order): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/order/update`, requestDto, { responseType: "json" });
  }

  delete(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/order/delete/${id}`, { responseType: "json" });
  }

}
