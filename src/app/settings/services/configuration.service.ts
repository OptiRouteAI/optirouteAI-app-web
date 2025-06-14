import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiUrl = 'http://127.0.0.1:8000/configuration/configuration/configuracion/';

  constructor(private http: HttpClient) {}

  // Obtener configuraciones
  getConfigurations(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Actualizar configuración
  setConfiguration(cod_estrategia: string, data: any): Observable<any> {
    const url = `${this.apiUrl}${cod_estrategia}/set`;
    return this.http.put(url, data);
  }
}
