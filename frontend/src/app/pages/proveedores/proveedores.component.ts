import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProveedorService, Proveedor } from '../../services/proveedor.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  modoFormulario: boolean = false;
  esEdicion: boolean = false;

  proveedorActual: Proveedor = {
    razon_social: '',
    nombre_contacto: '',
    telefono: '',
    pais_origen: ''
  };

  proveedores: Proveedor[] = [];

  constructor(
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (data: Proveedor[]) => {
        this.proveedores = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar proveedores:', err)
    });
  }

  abrirCrear() {
    this.esEdicion = false;
    this.proveedorActual = {
      razon_social: '',
      nombre_contacto: '',
      telefono: '',
      pais_origen: ''
    };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  editarProveedor(proveedor: Proveedor) {
    this.esEdicion = true;
    this.proveedorActual = { ...proveedor };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  cancelar() {
    this.modoFormulario = false;
    this.cdr.detectChanges();
  }

  guardarProveedor() {
    if (this.esEdicion && this.proveedorActual.id_proveedor) {
      this.proveedorService.actualizarProveedor(this.proveedorActual.id_proveedor, this.proveedorActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Regresa a la tabla instantáneamente
          this.cargarProveedores();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al actualizar proveedor:', err)
      });
    } else {
      this.proveedorService.crearProveedor(this.proveedorActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Regresa a la tabla instantáneamente
          this.cargarProveedores();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al crear proveedor:', err)
      });
    }
  }

  eliminarProveedor(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás segura de que deseas eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe({
        next: () => {
          this.cargarProveedores();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al eliminar proveedor:', err)
      });
    }
  }
}