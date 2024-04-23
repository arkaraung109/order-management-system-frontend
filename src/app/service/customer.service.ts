import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../model/Customer';
import { environment } from 'src/environment/environment';
import { PaginationResponse } from '../common/PaginationResponse';
import { HttpResponse } from '../common/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${environment.baseUrl}/customer/findById?id=${id}`, { responseType: "json" });
  }

  fetchAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.baseUrl}/customer/findAll`, { responseType: "json" });
  }

  fetchPage(keyword: string = "", pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<Customer>> {
    return this.http.get<PaginationResponse<Customer>>(`${environment.baseUrl}/customer/findPage?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  create(requestDto: Customer): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/customer/create`, requestDto, { responseType: "json" });
  }

  update(requestDto: Customer): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/customer/update`, requestDto, { responseType: "json" });
  }

  delete(id: number): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/customer/delete/${id}`, { responseType: "json" });
  }

}
