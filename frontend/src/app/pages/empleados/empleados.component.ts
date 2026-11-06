import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmpleadoService, Empleado } from '../../services/empleado.service';
import { TiendaService, Tienda } from '../../services/tienda.service';
import { CargoService, Cargo } from '../../services/cargo.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  modoFormulario: boolean = false;
  esEdicion: boolean = false;

  empleadoActual: Empleado = {
    id_tienda: '',
    id_cargo: '',
    nombre: '',
    apellido: '',
    correo_electronico: ''
  };

  empleados: Empleado[] = [];
  tiendas: Tienda[] = [];
  cargos: Cargo[] = [];

  constructor(
    private empleadoService: EmpleadoService,
    private tiendaService: TiendaService,
    private cargoService: CargoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
    this.cargarTiendas();
    this.cargarCargos();
  }

  cargarEmpleados() {
    this.empleadoService.getEmpleados().subscribe({
      next: (data: Empleado[]) => {
        this.empleados = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar empleados:', err)
    });
  }

  cargarTiendas() {
    this.tiendaService.getTiendas().subscribe({
      next: (data: Tienda[]) => {
        this.tiendas = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar tiendas:', err)
    });
  }

  cargarCargos() {
    this.cargoService.getCargos().subscribe({
      next: (data: Cargo[]) => {
        this.cargos = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar cargos:', err)
    });
  }

  obtenerNombreSucursal(idTienda: string): string {
    if (!this.tiendas || this.tiendas.length === 0) return 'Cargando...';
    const tienda = this.tiendas.find(t => t.id_tienda === idTienda);
    return tienda ? tienda.nombre_sucursal : 'Sin sucursal';
  }

  obtenerNombreCargo(idCargo: string): string {
    if (!this.cargos || this.cargos.length === 0) return 'Cargando...';
    const cargo = this.cargos.find(c => c.id_cargo === idCargo);
    return cargo ? cargo.titulo_cargo : 'Sin cargo';
  }

  abrirCrear() {
    this.esEdicion = false;
    this.empleadoActual = {
      id_tienda: '',
      id_cargo: '',
      nombre: '',
      apellido: '',
      correo_electronico: ''
    };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  editarEmpleado(empleado: Empleado) {
    this.esEdicion = true;
    this.empleadoActual = { ...empleado };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  cancelar() {
    this.modoFormulario = false;
    this.cdr.detectChanges();
  }

 guardarEmpleado() {
    console.log('Enviando empleado:', this.empleadoActual); // 👈 Revisa la consola F12 si llega algo mal

    if (this.esEdicion && this.empleadoActual.id_empleado) {
      this.empleadoService.actualizarEmpleado(this.empleadoActual.id_empleado, this.empleadoActual).subscribe({
        next: () => {
          this.modoFormulario = false; // Oculta el formulario y muestra la tabla
          this.cargarEmpleados();      // Vuelve a pedir la lista actualizada
          this.cdr.detectChanges();    // Fuerza el refresco visual de Angular
        },
        error: (err: any) => {
          console.error('Error al actualizar empleado:', err);
          alert('Hubo un error al actualizar. Revisa la consola.');
        }
      });
    } else {
      this.empleadoService.crearEmpleado(this.empleadoActual).subscribe({
        next: () => {
          this.modoFormulario = false; // Oculta el formulario y muestra la tabla
          this.cargarEmpleados();      // Vuelve a pedir la lista actualizada
          this.cdr.detectChanges();    // Fuerza el refresco visual de Angular
        },
        error: (err: any) => {
          console.error('Error al crear empleado:', err);
          alert('Hubo un error al guardar. Revisa la consola.');
        }
      });
    }
  }
  eliminarEmpleado(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás segura de que deseas eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(id).subscribe({
        next: () => {
          this.cargarEmpleados();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al eliminar empleado:', err)
      });
    }
  }
}