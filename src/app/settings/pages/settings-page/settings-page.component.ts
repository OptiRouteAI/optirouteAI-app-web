import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';

interface Estrategia {
  cod_estrategia: string;
  nombre: string;
  descripcion: string;
  flg_activo: number;
}

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css'],
})
export class SettingsPageComponent implements OnInit {
  estrategias: Estrategia[] = [];

  constructor(private configService: ConfigurationService) {}

  ngOnInit(): void {
    this.configService.getConfigurations().subscribe((data: Estrategia[]) => {
      this.estrategias = data;
    });
  }

  activarEstrategia(cod: string) {
    this.configService.setConfiguration(cod, {}).subscribe(() => {
      // Guardar en localStorage
      localStorage.setItem('estrategiaActiva', cod);

      // Recargar visualmente
      this.configService.getConfigurations().subscribe((data: Estrategia[]) => {
        this.estrategias = data;
      });
    });
  }
}
