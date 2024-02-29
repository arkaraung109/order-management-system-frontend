import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ManufacturingCost } from '../model/ManufacturingCost';
import { environment } from 'src/environment/environment';
import { PaginationResponse } from '../common/PaginationResponse';
import { HttpResponse } from '../common/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class ManufacturingCostService {

  constructor(
    private http: HttpClient
  ) { }

  fetchPage(productId: number, pageNo: number = 1, pageSize: number = 5): Observable<PaginationResponse<ManufacturingCost>> {
    return this.http.get<PaginationResponse<ManufacturingCost>>(`${environment.baseUrl}/manufacturingCost/findPage?productId=${productId}&pageNo=${pageNo}&pageSize=${pageSize}`, { responseType: "json" });
  }

  delete(id: number): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/manufacturingCost/delete/${id}`, { responseType: "json" });
  }

}
