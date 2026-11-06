import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Promocion {
  id_promocion?: string;
  nombre_campana: string;
  porcentaje_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromocionService {
  private apiUrl = 'http://localhost:8000/promociones';

  constructor(private http: HttpClient) {}

  getPromociones(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(this.apiUrl);
  }

  crearPromocion(promocion: Promocion): Observable<Promocion> {
    return this.http.post<Promocion>(this.apiUrl, promocion);
  }

  actualizarPromocion(id: string, promocion: Promocion): Observable<Promocion> {
    return this.http.put<Promocion>(`${this.apiUrl}/${id}`, promocion);
  }

  eliminarPromocion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}