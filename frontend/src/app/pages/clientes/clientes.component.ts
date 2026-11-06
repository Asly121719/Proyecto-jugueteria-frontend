import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  modoFormulario: boolean = false;
  esEdicion: boolean = false;

  clienteActual: Cliente = {
    nombre: '',
    apellido: '',
    correo_electronico: '',
    telefono: ''
  };

  clientes: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar clientes:', err)
    });
  }

  abrirCrear() {
    this.esEdicion = false;
    this.clienteActual = {
      nombre: '',
      apellido: '',
      correo_electronico: '',
      telefono: ''
    };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  editarCliente(cliente: Cliente) {
    this.esEdicion = true;
    this.clienteActual = { ...cliente };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  cancelar() {
    this.modoFormulario = false;
    this.cdr.detectChanges();
  }

 guardarCliente() {
    if (this.esEdicion && this.clienteActual.id_cliente) {
      this.clienteService.actualizarCliente(this.clienteActual.id_cliente, this.clienteActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Oculta el formulario y muestra la tabla
          this.cargarClientes();      // 👈 Recarga la lista actualizada desde FastAPI
          this.cdr.detectChanges();    // 👈 Refresca la vista al instante
        },
        error: (err: any) => console.error('Error al actualizar cliente:', err)
      });
    } else {
      this.clienteService.crearCliente(this.clienteActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Oculta el formulario y muestra la tabla
          this.cargarClientes();      // 👈 Recarga la lista actualizada desde FastAPI
          this.cdr.detectChanges();    // 👈 Refresca la vista al instante
        },
        error: (err: any) => console.error('Error al crear cliente:', err)
      });
    }
  }
  eliminarCliente(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás segura de que deseas eliminar este cliente?')) {
      this.clienteService.eliminarCliente(id).subscribe({
        next: () => {
          this.cargarClientes();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al eliminar cliente:', err)
      });
    }
  }
}