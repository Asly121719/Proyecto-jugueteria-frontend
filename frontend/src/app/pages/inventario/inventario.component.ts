import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventarioService, InventarioTienda } from '../../services/inventario.service';
import { TiendaService, Tienda } from '../../services/tienda.service';
import { JugueteService, Juguete } from '../../services/juguete.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  modoFormulario: boolean = false;
  esEdicion: boolean = false;

  inventarioActual: InventarioTienda = {
    id_tienda: '',
    id_juguete: '',
    stock_actual: 0,
    pasillo_ubicacion: ''
  };

  inventarios: InventarioTienda[] = [];
  tiendas: Tienda[] = [];
  juguetes: Juguete[] = [];

  constructor(
    private inventarioService: InventarioService,
    private tiendaService: TiendaService,
    private jugueteService: JugueteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.inventarioService.getInventarios().subscribe({
      next: (data) => {
        this.inventarios = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar inventario:', err)
    });

    this.tiendaService.getTiendas().subscribe({
      next: (data) => { this.tiendas = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error al cargar tiendas:', err)
    });

    this.jugueteService.getJuguetes().subscribe({
      next: (data) => { this.juguetes = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error al cargar juguetes:', err)
    });
  }

  // 👈 Método para obtener el nombre de la sucursal por su ID
  obtenerNombreTienda(id_tienda: string): string {
    const tienda = this.tiendas.find(t => t.id_tienda === id_tienda);
    return tienda ? tienda.nombre_sucursal : id_tienda;
  }

  // 👈 Método para obtener el nombre del producto por su ID
  obtenerNombreJuguete(id_juguete: string): string {
    const juguete = this.juguetes.find(j => j.id_juguete === id_juguete);
    return juguete ? juguete.nombre_producto : id_juguete;
  }

  abrirCrear() {
    this.esEdicion = false;
    this.inventarioActual = {
      id_tienda: '',
      id_juguete: '',
      stock_actual: 0,
      pasillo_ubicacion: ''
    };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  editarInventario(item: InventarioTienda) {
    this.esEdicion = true;
    this.inventarioActual = { ...item };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  cancelar() {
    this.modoFormulario = false;
    this.cdr.detectChanges();
  }

  guardarInventario() {
    console.log('Enviando inventario:', this.inventarioActual);

    if (this.esEdicion && this.inventarioActual.id_inventario) {
      this.inventarioService.actualizarInventario(this.inventarioActual.id_inventario, this.inventarioActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Oculta el formulario y regresa a la tabla
          this.cargarDatos();          // 👈 Recarga la lista
          this.cdr.detectChanges();    // 👈 Refresca la vista
        },
        error: (err) => {
          console.error('Error detallado al actualizar inventario:', err);
          alert('Error al actualizar. Revisa la consola (F12) para ver el detalle.');
        }
      });
    } else {
      this.inventarioService.crearInventario(this.inventarioActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Oculta el formulario y regresa a la tabla
          this.cargarDatos();          // 👈 Recarga la lista
          this.cdr.detectChanges();    // 👈 Refresca la vista
        },
        error: (err) => {
          console.error('Error detallado al crear inventario:', err);
          alert('Error al crear. Revisa la consola (F12) para ver el detalle.');
        }
      });
    }
  }
  eliminarInventario(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás segura de que deseas eliminar este registro de inventario?')) {
      this.inventarioService.eliminarInventario(id).subscribe({
        next: () => {
          this.cargarDatos();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al eliminar inventario:', err)
      });
    }
  }
}