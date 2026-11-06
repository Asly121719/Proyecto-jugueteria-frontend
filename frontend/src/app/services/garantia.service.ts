import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Garantia } from '../models/garantia.model';

@Injectable({
  providedIn: 'root'
})
export class GarantiaService {
  private apiUrl = `${environment.apiUrl}/garantias/`;

  constructor(private http: HttpClient) {}

  getGarantias(): Observable<Garantia[]> {
    return this.http.get<Garantia[]>(this.apiUrl);
  }

  crearGarantia(garantia: Omit<Garantia, 'id_garantia'>): Observable<Garantia> {
    return this.http.post<Garantia>(this.apiUrl, garantia);
  }

  actualizarGarantia(id: string, garantia: Partial<Garantia>): Observable<Garantia> {
    return this.http.put<Garantia>(`${this.apiUrl}${id}`, garantia);
  }

  eliminarGarantia(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }
}