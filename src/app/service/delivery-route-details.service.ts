import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryRouteDetails } from '../model/DeliveryRouteDetails';
import { environment } from 'src/environment/environment';
import { HttpResponse } from '../common/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class DeliveryRouteDetailsService {

  constructor(
    private http: HttpClient
  ) { }

  fetchById(id: number): Observable<DeliveryRouteDetails> {
    return this.http.get<DeliveryRouteDetails>(`${environment.baseUrl}/deliveryRouteDetails/findById?id=${id}`, { responseType: "json" });
  }

  fetchByDeliveryRouteId(deliveryRouteId: string): Observable<DeliveryRouteDetails[]> {
    return this.http.get<DeliveryRouteDetails[]>(`${environment.baseUrl}/deliveryRouteDetails/findByDeliveryRouteId?deliveryRouteId=${deliveryRouteId}`, { responseType: "json" });
  }

  fetchByOrderDetailsId(orderDetailsId: number): Observable<DeliveryRouteDetails[]> {
    return this.http.get<DeliveryRouteDetails[]>(`${environment.baseUrl}/deliveryRouteDetails/findByOrderDetailsId?orderDetailsId=${orderDetailsId}`, { responseType: "json" });
  }

  update(requestDto: DeliveryRouteDetails): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.baseUrl}/deliveryRouteDetails/update`, requestDto, { responseType: "json" });
  }

  delete(id: number): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.baseUrl}/deliveryRouteDetails/delete/${id}`, { responseType: "json" });
  }

}
