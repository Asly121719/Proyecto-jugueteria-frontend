import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PromocionJuguete {
  id_promocion_juguete?: string; // Por si tu base de datos genera un ID propio
  id_promocion: string;
  id_juguete: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromocionJugueteService {
  // Ajusta aquí la ruta exacta que te indique tu Swagger de FastAPI (ej: '/promocion-juguetes' o '/promociones-juguetes')
 private apiUrl = ' http://localhost:8000/promocion-juguetes';

  constructor(private http: HttpClient) {}

  getAsignaciones(): Observable<PromocionJuguete[]> {
    return this.http.get<PromocionJuguete[]>(this.apiUrl);
  }

  asignarPromocionAJuguete(data: PromocionJuguete): Observable<PromocionJuguete> {
    return this.http.post<PromocionJuguete>(this.apiUrl, data);
  }

  eliminarAsignacion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}