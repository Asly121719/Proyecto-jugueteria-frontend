import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PromocionService, Promocion } from '../../services/promocion.service';
import { PromocionJugueteService, PromocionJuguete } from '../../services/promocion-juguete.service';
import { JugueteService, Juguete } from '../../services/juguete.service';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {
  modoFormulario: boolean = false;
  esEdicion: boolean = false;
  pestanaActiva: 'promociones' | 'asignar' = 'promociones';

  promocionActual: Promocion = {
    nombre_campana: '',
    porcentaje_descuento: 0,
    fecha_inicio: '',
    fecha_fin: ''
  };

  asignacionActual: PromocionJuguete = {
    id_promocion: '',
    id_juguete: ''
  };

  promociones: Promocion[] = [];
  juguetes: Juguete[] = [];

  constructor(
    private promocionService: PromocionService,
    private promocionJugueteService: PromocionJugueteService, // 👈 Inyectamos el servicio separado
    private jugueteService: JugueteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.promocionService.getPromociones().subscribe({
      next: (data) => {
        this.promociones = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar promociones:', err)
    });

    this.jugueteService.getJuguetes().subscribe({
      next: (data) => {
        this.juguetes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar juguetes:', err)
    });
  }

  abrirCrear() {
    this.esEdicion = false;
    this.promocionActual = {
      nombre_campana: '',
      porcentaje_descuento: 0,
      fecha_inicio: '',
      fecha_fin: ''
    };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  editarPromocion(promo: Promocion) {
    this.esEdicion = true;
    this.promocionActual = { ...promo };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  cancelar() {
    this.modoFormulario = false;
    this.cdr.detectChanges();
  }

  guardarPromocion() {
    if (this.esEdicion && this.promocionActual.id_promocion) {
      this.promocionService.actualizarPromocion(this.promocionActual.id_promocion, this.promocionActual).subscribe({
        next: () => {
          this.modoFormulario = false;
          this.cargarDatos();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al actualizar promoción:', err)
      });
    } else {
      this.promocionService.crearPromocion(this.promocionActual).subscribe({
        next: () => {
          this.modoFormulario = false;
          this.cargarDatos();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al crear promoción:', err)
      });
    }
  }

  guardarAsignacion() {
    this.promocionJugueteService.asignarPromocionAJuguete(this.asignacionActual).subscribe({
      next: () => {
        alert('¡Promoción asignada exitosamente al juguete!');
        this.asignacionActual = { id_promocion: '', id_juguete: '' };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al asignar promoción:', err)
    });
  }

  eliminarPromocion(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás segura de eliminar esta promoción?')) {
      this.promocionService.eliminarPromocion(id).subscribe({
        next: () => {
          this.cargarDatos();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }
}