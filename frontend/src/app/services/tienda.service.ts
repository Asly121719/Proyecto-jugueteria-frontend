import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tienda {
  id_tienda?: string;
  nombre_sucursal: string;
  direccion: string;
  telefono: string;
  horario_apertura: string;
}

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private apiUrl = 'http://localhost:8000/tiendas';

  constructor(private http: HttpClient) {}

  getTiendas(): Observable<Tienda[]> {
    return this.http.get<Tienda[]>(this.apiUrl);
  }

  crearTienda(tienda: Tienda): Observable<Tienda> {
    return this.http.post<Tienda>(this.apiUrl, tienda);
  }

  actualizarTienda(id: string, tienda: Tienda): Observable<Tienda> {
    return this.http.put<Tienda>(`${this.apiUrl}/${id}`, tienda);
  }

  eliminarTienda(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}