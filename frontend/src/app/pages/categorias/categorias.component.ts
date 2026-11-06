import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../../services/categoria.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  modoFormulario: boolean = false;
  esEdicion: boolean = false;

  categoriaActual: Categoria = {
    nombre_categoria: '',
    descripcion: '',
    edad_recomendada: '',
    es_electrico: false
  };

  categorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar categorías:', err)
    });
  }

  abrirCrear() {
    this.esEdicion = false;
    this.categoriaActual = {
      nombre_categoria: '',
      descripcion: '',
      edad_recomendada: '',
      es_electrico: false // 👈 Por defecto en false
    };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  editarCategoria(categoria: Categoria) {
    this.esEdicion = true;
    this.categoriaActual = { ...categoria };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  cancelar() {
    this.modoFormulario = false;
    this.cdr.detectChanges();
  }

  guardarCategoria() {
    if (this.esEdicion && this.categoriaActual.id_categoria) {
      this.categoriaService.actualizarCategoria(this.categoriaActual.id_categoria, this.categoriaActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Oculta el formulario y muestra la tabla
          this.cargarCategorias();      // 👈 Recarga la lista actualizada
          this.cdr.detectChanges();    // 👈 Refresca la vista instantáneamente
        },
        error: (err: any) => console.error('Error al actualizar categoría:', err)
      });
    } else {
      this.categoriaService.crearCategoria(this.categoriaActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Oculta el formulario y muestra la tabla
          this.cargarCategorias();      // 👈 Recarga la lista actualizada
          this.cdr.detectChanges();    // 👈 Refresca la vista instantáneamente
        },
        error: (err: any) => console.error('Error al crear categoría:', err)
      });
    }
  }

  eliminarCategoria(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás segura de que deseas eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al eliminar categoría:', err)
      });
    }
  }
}