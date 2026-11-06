import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TiendaService, Tienda } from '../../services/tienda.service';

@Component({
  selector: 'app-tiendas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css']
})
export class TiendasComponent implements OnInit {
  modoFormulario: boolean = false;
  esEdicion: boolean = false;

  tiendaActual: Tienda = {
    nombre_sucursal: '',
    direccion: '',
    telefono: '',
    horario_apertura: ''
  };

  tiendas: Tienda[] = [];

  constructor(
    private tiendaService: TiendaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTiendas();
  }

  cargarTiendas() {
    this.tiendaService.getTiendas().subscribe({
      next: (data: Tienda[]) => {
        this.tiendas = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar tiendas:', err)
    });
  }

  abrirCrear() {
    this.esEdicion = false;
    this.tiendaActual = {
      nombre_sucursal: '',
      direccion: '',
      telefono: '',
      horario_apertura: ''
    };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  editarTienda(tienda: Tienda) {
    this.esEdicion = true;
    this.tiendaActual = { ...tienda };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  cancelar() {
    this.modoFormulario = false;
    this.cdr.detectChanges();
  }

  guardarTienda() {
    if (this.esEdicion && this.tiendaActual.id_tienda) {
      this.tiendaService.actualizarTienda(this.tiendaActual.id_tienda, this.tiendaActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Cierra el formulario y te devuelve a la tabla
          this.cargarTiendas();      // 👈 Refresca los registros de la BD
          this.cdr.detectChanges();    // 👈 Fuerza la actualización visual
        },
        error: (err: any) => console.error('Error al actualizar tienda:', err)
      });
    } else {
      this.tiendaService.crearTienda(this.tiendaActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Cierra el formulario y te devuelve a la tabla
          this.cargarTiendas();      // 👈 Refresca los registros de la BD incluyendo la nueva
          this.cdr.detectChanges();    // 👈 Fuerza la actualización visual
        },
        error: (err: any) => console.error('Error al crear tienda:', err)
      });
    }
  }
  eliminarTienda(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás segura de que deseas eliminar esta tienda?')) {
      this.tiendaService.eliminarTienda(id).subscribe({
        next: () => {
          this.cargarTiendas();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al eliminar tienda:', err)
      });
    }
  }
}