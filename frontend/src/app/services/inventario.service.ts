import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface InventarioTienda {
  id_inventario?: string;
  id_tienda: string;
  id_juguete: string;
  stock_actual: number;
  pasillo_ubicacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = `${environment.apiUrl}/inventario`;

  constructor(private http: HttpClient) {}

  getInventarios(): Observable<InventarioTienda[]> {
    return this.http.get<InventarioTienda[]>(this.apiUrl);
  }

  crearInventario(inventario: InventarioTienda): Observable<InventarioTienda> {
    return this.http.post<InventarioTienda>(this.apiUrl, inventario);
  }

  actualizarInventario(id: string, inventario: InventarioTienda): Observable<InventarioTienda> {
    return this.http.put<InventarioTienda>(`${this.apiUrl}${id}`, inventario);
  }

  eliminarInventario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }
}