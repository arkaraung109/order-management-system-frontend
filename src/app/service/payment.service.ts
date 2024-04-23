import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '../model/Payment';
import { Observable } from 'rxjs';
import { HttpResponse } from '../common/HttpResponse';
import { environment } from 'src/environment/environment';
import { PaginationResponse } from '../common/PaginationResponse';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${environment.baseUrl}/payment/findById?id=${id}`, { responseType: "json" });
  }

  fetchPage(customerName: string = "", startDate: string = "", endDate: string = "", paymentType: string = "", pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<Payment>> {
    return this.http.get<PaginationResponse<Payment>>(`${environment.baseUrl}/payment/findPage?customerName=${customerName}&startDate=${startDate}&endDate=${endDate}&paymentType=${paymentType}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  create(requestDto: Payment): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/payment/create`, requestDto, { responseType: "json" });
  }

  update(requestDto: Payment): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/payment/update`, requestDto, { responseType: "json" });
  }

  delete(id: number): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/payment/delete/${id}`, { responseType: "json" });
  }

}
