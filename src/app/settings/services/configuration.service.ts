import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConfigService } from '../../services/url-config-service.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(private http: HttpClient, private urlConfig: UrlConfigService) {}

  getConfigurations(): Observable<any> {
    return this.http.get(this.urlConfig.CONFIGURATION_URL);
  }

  setConfiguration(cod_estrategia: string, data: any): Observable<any> {
    const url = `${this.urlConfig.CONFIGURATION_URL}${cod_estrategia}/set`;
    return this.http.put(url, data);
  }
}
