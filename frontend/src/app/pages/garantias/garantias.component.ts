import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GarantiaService } from '../../services/garantia.service';
import { DetalleVentaService } from '../../services/detalle-venta.service';
import { Garantia } from '../../models/garantia.model';

@Component({
  selector: 'app-garantias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './garantias.component.html',
  styleUrls: ['./garantias.component.css']
})
export class GarantiasComponent implements OnInit {
  garantiaForm!: FormGroup;
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  idGarantiaEnEdicion: string | null = null;

  garantiasRegistradas: Garantia[] = [];
  detallesVentasDisponibles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private garantiaService: GarantiaService,
    private detalleVentaService: DetalleVentaService,
    private cdr: ChangeDetectorRef // 👈 Forzar actualización visual inmediata de la tabla
  ) {}

  ngOnInit(): void {
    this.construirFormulario();
    this.cargarGarantias();
    this.cargarDetallesVentas();
  }

  construirFormulario(): void {
    this.garantiaForm = this.fb.group({
      id_detalle_venta: ['', Validators.required],
      duracion_meses: [1, [Validators.required, Validators.min(1)]],
      tipo_cobertura: ['', Validators.required],
      estado_garantia: ['Activa', Validators.required]
    });
  }

  alternarVistaFormulario(abrir: boolean): void {
    this.mostrarFormulario = abrir;
    this.modoEdicion = false;
    this.idGarantiaEnEdicion = null;
    if (abrir) {
      this.garantiaForm.reset({ duracion_meses: 1, estado_garantia: 'Activa' });
    }
  }

  abrirFormularioEdicion(garantia: Garantia): void {
    this.modoEdicion = true;
    this.idGarantiaEnEdicion = garantia.id_garantia;
    this.mostrarFormulario = true;
    
    this.garantiaForm.patchValue({
      id_detalle_venta: garantia.id_detalle_venta,
      duracion_meses: garantia.duracion_meses,
      tipo_cobertura: garantia.tipo_cobertura,
      estado_garantia: garantia.estado_garantia
    });
  }

  cancelarRegistro(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.idGarantiaEnEdicion = null;
  }

  cargarGarantias(): void {
    this.garantiaService.getGarantias().subscribe({
      next: (res: Garantia[]) => { 
        this.garantiasRegistradas = res; 
        this.cdr.detectChanges(); // 👈 Fuerza a Angular a pintar la tabla de inmediato
      },
      error: (err) => { console.error('Error al cargar garantías', err); }
    });
  }

  cargarDetallesVentas(): void {
    this.detalleVentaService.getDetallesVentas().subscribe({
      next: (res: any[]) => { this.detallesVentasDisponibles = res; },
      error: (err) => { console.error('Error al cargar detalles de ventas', err); }
    });
  }

  guardarGarantia(): void {
    if (this.garantiaForm.invalid) {
      this.garantiaForm.markAllAsTouched();
      return;
    }

    const formValues = this.garantiaForm.value;
    
    const payload = {
      id_detalle_venta: String(formValues.id_detalle_venta).trim(),
      duracion_meses: Number(formValues.duracion_meses),
      tipo_cobertura: String(formValues.tipo_cobertura).trim(),
      estado_garantia: String(formValues.estado_garantia).trim()
    };

    if (this.modoEdicion && this.idGarantiaEnEdicion !== null) {
      this.garantiaService.actualizarGarantia(this.idGarantiaEnEdicion, payload).subscribe({
        next: () => {
          alert('¡Garantía actualizada con éxito!');
          this.cancelarRegistro();
          this.cargarGarantias();
        },
        error: (err) => { console.error(err); alert('Ocurrió un error al actualizar la garantía.'); }
      });
    } else {
      this.garantiaService.crearGarantia(payload).subscribe({
        next: () => {
          alert('¡Garantía registrada con éxito!');
          this.cancelarRegistro();
          this.cargarGarantias();
        },
        error: (err) => { console.error(err); alert('Ocurrió un error al guardar la garantía.'); }
      });
    }
  }

  eliminarGarantia(idGarantia: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta garantía?')) {
      this.garantiaService.eliminarGarantia(idGarantia).subscribe({
        next: () => {
          alert('Garantía eliminada correctamente.');
          this.cargarGarantias();
        },
        error: (err) => { console.error(err); alert('No se pudo eliminar la garantía.'); }
      });
    }
  }
}