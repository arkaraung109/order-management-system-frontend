import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../common/PaginationResponse';
import { RetailPrice } from '../model/RetailPrice';
import { environment } from 'src/environment/environment';
import { HttpResponse } from '../common/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class RetailPriceService {

  constructor(
    private http: HttpClient
  ) { }

  fetchPage(productId: number, pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<RetailPrice>> {
    return this.http.get<PaginationResponse<RetailPrice>>(`${environment.baseUrl}/retailPrice/findPage?productId=${productId}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  delete(id: number): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/retailPrice/delete/${id}`, { responseType: "json" });
  }

}
