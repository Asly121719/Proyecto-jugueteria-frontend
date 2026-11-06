import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:8000/ventas';

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