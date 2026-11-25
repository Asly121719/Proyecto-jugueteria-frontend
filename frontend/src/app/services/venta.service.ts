import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VentaService {
   private apiUrl = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient) {}

  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearVenta(ventaData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ventaData);
  }

  actualizarVenta(id: string, ventaData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, ventaData);
  }

  eliminarVenta(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}