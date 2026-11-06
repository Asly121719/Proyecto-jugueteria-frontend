import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cargo {
  id_cargo?: string;
  titulo_cargo: string;
  salario_base: number;
  nivel_acceso: string;
  funciones_principales: string;
}

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private apiUrl = 'http://localhost:8000/cargos';

  constructor(private http: HttpClient) {}

  getCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.apiUrl);
  }

  crearCargo(cargo: Cargo): Observable<Cargo> {
    return this.http.post<Cargo>(this.apiUrl, cargo);
  }

  actualizarCargo(id: string, cargo: Cargo): Observable<Cargo> {
    return this.http.put<Cargo>(`${this.apiUrl}/${id}`, cargo);
  }

  eliminarCargo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}