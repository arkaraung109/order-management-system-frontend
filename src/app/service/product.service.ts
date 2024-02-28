import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../common/PaginationResponse';
import { environment } from 'src/environment/environment';
import { HttpResponse } from '../common/HttpResponse';
import { Product } from '../model/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.baseUrl}/product/findById?id=${id}`, { responseType: "json" });
  }

  fetchPage(categoryName: string = "", keyword: string = "", pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<Product>> {
    return this.http.get<PaginationResponse<Product>>(`${environment.baseUrl}/product/findPage?categoryName=${categoryName}&keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  create(requestDto: Product): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/product/create`, requestDto, { responseType: "json" });
  }

  update(requestDto: Product): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/product/update`, requestDto, { responseType: "json" });
  }

  delete(id: number): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/product/delete/${id}`, { responseType: "json" });
  }

}
