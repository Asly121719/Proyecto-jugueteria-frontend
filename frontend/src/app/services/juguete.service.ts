import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Juguete {
  id_juguete?: string;
  id_categoria: string;
  id_proveedor: string;
  nombre_producto: string;
  precio_unitario: number;
}

@Injectable({
  providedIn: 'root'
})
export class JugueteService {
  private apiUrl = 'http://localhost:8000/juguetes';

  constructor(private http: HttpClient) {}

  getJuguetes(): Observable<Juguete[]> {
    return this.http.get<Juguete[]>(this.apiUrl);
  }

  crearJuguete(juguete: Juguete): Observable<Juguete> {
    return this.http.post<Juguete>(this.apiUrl, juguete);
  }

  actualizarJuguete(id: string, juguete: Juguete): Observable<Juguete> {
    return this.http.put<Juguete>(`${this.apiUrl}/${id}`, juguete);
  }

  eliminarJuguete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}