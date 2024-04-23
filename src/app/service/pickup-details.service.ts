import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { HttpResponse } from '../common/HttpResponse';
import { PickupDetails } from '../model/PickupDetails';

@Injectable({
  providedIn: 'root'
})
export class PickupDetailsService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: number): Observable<PickupDetails> {
    return this.http.get<PickupDetails>(`${environment.baseUrl}/pickupDetails/findById?id=${id}`, { responseType: "json" });
  }

  fetchByPickupId(pickupId: string): Observable<PickupDetails[]> {
    return this.http.get<PickupDetails[]>(`${environment.baseUrl}/pickupDetails/findByPickupId?pickupId=${pickupId}`, { responseType: "json" });
  }

  fetchByOrderDetailsId(orderDetailsId: number): Observable<PickupDetails[]> {
    return this.http.get<PickupDetails[]>(`${environment.baseUrl}/pickupDetails/findByOrderDetailsId?orderDetailsId=${orderDetailsId}`, { responseType: "json" });
  }

  update(requestDto: PickupDetails): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/pickupDetails/update`, requestDto, { responseType: "json" });
  }

  delete(id: number): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/pickupDetails/delete/${id}`, { responseType: "json" });
  }

}
