import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DetalleVenta } from '../models/detalle-venta.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {
  private apiUrl = `${environment.apiUrl}/detalles-venta`;

  constructor(private http: HttpClient) {}

  obtenerDetalles(): Observable<DetalleVenta[]> {
    return this.http.get<DetalleVenta[]>(`${this.apiUrl}/`);
  }

  // Método alias añadido para compatibilidad con el componente de Garantías
  getDetallesVentas(): Observable<DetalleVenta[]> {
    return this.obtenerDetalles();
  }

  obtenerDetallePorId(id: string): Observable<DetalleVenta> {
    return this.http.get<DetalleVenta>(`${this.apiUrl}/${id}`);
  }

  crearDetalle(detalle: Omit<DetalleVenta, 'id_detalle'>): Observable<DetalleVenta> {
    return this.http.post<DetalleVenta>(`${this.apiUrl}/`, detalle);
  }

  actualizarDetalle(id: string, detalle: Partial<DetalleVenta>): Observable<DetalleVenta> {
    return this.http.put<DetalleVenta>(`${this.apiUrl}/${id}`, detalle);
  }

  eliminarDetalle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}