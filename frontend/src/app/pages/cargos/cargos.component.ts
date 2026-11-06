import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CargoService, Cargo } from '../../services/cargo.service';

@Component({
  selector: 'app-cargos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent implements OnInit {
  modoFormulario: boolean = false;
  esEdicion: boolean = false;

  cargoActual: Cargo = {
    titulo_cargo: '',
    salario_base: 0,
    nivel_acceso: '',
    funciones_principales: ''
  };

  cargos: Cargo[] = [];

  constructor(
    private cargoService: CargoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCargos();
  }

  cargarCargos() {
    this.cargoService.getCargos().subscribe({
      next: (data: Cargo[]) => {
        this.cargos = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar cargos:', err)
    });
  }

  abrirCrear() {
    this.esEdicion = false;
    this.cargoActual = {
      titulo_cargo: '',
      salario_base: 0,
      nivel_acceso: '',
      funciones_principales: ''
    };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  editarCargo(cargo: Cargo) {
    this.esEdicion = true;
    this.cargoActual = { ...cargo };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  cancelar() {
    this.modoFormulario = false;
    this.cdr.detectChanges();
  }

  guardarCargo() {
    // Aseguramos que el salario sea numérico
    this.cargoActual.salario_base = Number(this.cargoActual.salario_base);

    if (this.esEdicion && this.cargoActual.id_cargo) {
      this.cargoService.actualizarCargo(this.cargoActual.id_cargo, this.cargoActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Regresa a la tabla instantáneamente
          this.cargarCargos();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al actualizar cargo:', err)
      });
    } else {
      this.cargoService.crearCargo(this.cargoActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Regresa a la tabla instantáneamente
          this.cargarCargos();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al crear cargo:', err)
      });
    }
  }

  eliminarCargo(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás segura de que deseas eliminar este cargo?')) {
      this.cargoService.eliminarCargo(id).subscribe({
        next: () => {
          this.cargarCargos();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al eliminar cargo:', err)
      });
    }
  }
}