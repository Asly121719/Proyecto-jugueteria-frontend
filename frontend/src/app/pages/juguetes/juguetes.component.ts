import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JugueteService, Juguete } from '../../services/juguete.service';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { ProveedorService, Proveedor } from '../../services/proveedor.service';

@Component({
  selector: 'app-juguetes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './juguetes.component.html',
  styleUrls: ['./juguetes.component.css']
})
export class JuguetesComponent implements OnInit {
  modoFormulario: boolean = false;
  esEdicion: boolean = false;

  jugueteActual: Juguete = {
    id_categoria: '',
    id_proveedor: '',
    nombre_producto: '',
    precio_unitario: 0
  };

  juguetes: Juguete[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  constructor(
    private jugueteService: JugueteService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef // 👈 Inyectamos el detector de cambios
  ) {}

  ngOnInit(): void {
    this.cargarJuguetes();
    this.cargarCategorias();
    this.cargarProveedores();
  }

  cargarJuguetes() {
    this.jugueteService.getJuguetes().subscribe({
      next: (data: Juguete[]) => {
        this.juguetes = [...data];
        this.cdr.detectChanges(); // 👈 Forzamos a la tabla a mostrar los datos
      },
      error: (err: any) => console.error('Error al cargar juguetes:', err)
    });
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar categorías:', err)
    });
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (data: Proveedor[]) => {
        this.proveedores = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar proveedores:', err)
    });
  }

  obtenerNombreCategoria(idCategoria: string): string {
    if (!this.categorias || this.categorias.length === 0) return 'Cargando...';
    const cat = this.categorias.find(c => c.id_categoria === idCategoria);
    return cat ? cat.nombre_categoria : 'Sin categoría';
  }

  obtenerRazonSocialProveedor(idProveedor: string): string {
    if (!this.proveedores || this.proveedores.length === 0) return 'Cargando...';
    const prov = this.proveedores.find(p => p.id_proveedor === idProveedor);
    return prov ? prov.razon_social : 'Sin proveedor';
  }

  abrirCrear() {
    this.esEdicion = false;
    this.jugueteActual = {
      id_categoria: '',
      id_proveedor: '',
      nombre_producto: '',
      precio_unitario: 0
    };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  editarJuguete(juguete: Juguete) {
    this.esEdicion = true;
    this.jugueteActual = { ...juguete };
    this.modoFormulario = true;
    this.cdr.detectChanges();
  }

  cancelar() {
    this.modoFormulario = false;
    this.cdr.detectChanges();
  }

  guardarJuguete() {
    this.jugueteActual.precio_unitario = Number(this.jugueteActual.precio_unitario);

    if (this.esEdicion && this.jugueteActual.id_juguete) {
      this.jugueteService.actualizarJuguete(this.jugueteActual.id_juguete, this.jugueteActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Cierra el formulario
          this.cargarJuguetes();      // 👈 Recarga la lista
          this.cdr.detectChanges();    // 👈 Fuerza el cambio visual a la tabla
        },
        error: (err: any) => console.error('Error al actualizar:', err)
      });
    } else {
      this.jugueteService.crearJuguete(this.jugueteActual).subscribe({
        next: () => {
          this.modoFormulario = false; // 👈 Cierra el formulario
          this.cargarJuguetes();      // 👈 Recarga la lista
          this.cdr.detectChanges();    // 👈 Fuerza el cambio visual a la tabla
        },
        error: (err: any) => console.error('Error al crear:', err)
      });
    }
  }

  eliminarJuguete(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás segura de que deseas eliminar este juguete?')) {
      this.jugueteService.eliminarJuguete(id).subscribe({
        next: () => {
          this.cargarJuguetes();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al eliminar:', err)
      });
    }
  }
}