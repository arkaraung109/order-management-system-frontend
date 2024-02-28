import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../common/PaginationResponse';
import { Category } from '../model/Category';
import { environment } from 'src/environment/environment';
import { HttpResponse } from '../common/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: number): Observable<Category> {
    return this.http.get<Category>(`${environment.baseUrl}/category/findById?id=${id}`, { responseType: "json" });
  }

  fetchAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.baseUrl}/category/findAll`, { responseType: "json" });
  }

  fetchPage(keyword: string = "", pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<Category>> {
    return this.http.get<PaginationResponse<Category>>(`${environment.baseUrl}/category/findPage?keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  create(requestDto: Category): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.baseUrl}/category/create`, requestDto, { responseType: "json" });
  }

  update(requestDto: Category): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/category/update`, requestDto, { responseType: "json" });
  }

  delete(id: number): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/category/delete/${id}`, { responseType: "json" });
  }

}
