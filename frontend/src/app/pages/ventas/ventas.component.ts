import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { TiendaService } from '../../services/tienda.service';
import { EmpleadoService } from '../../services/empleado.service';
import { ClienteService } from '../../services/cliente.service';
import { JugueteService } from '../../services/juguete.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ventaForm!: FormGroup;
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  idVentaEnEdicion: string | null = null;

  ventasRegistradas: any[] = [];
  juguetesDisponibles: any[] = [];
  tiendas: any[] = [];
  empleados: any[] = [];
  clientes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private tiendaService: TiendaService,
    private empleadoService: EmpleadoService,
    private clienteService: ClienteService,
    private jugueteService: JugueteService,
    private cdr: ChangeDetectorRef // 👈 Forzar actualización visual inmediata de la tabla
  ) {}

  ngOnInit(): void {
    this.construirFormulario();
    this.cargarVentas();
    this.cargarCatalogos();
  }

  construirFormulario(): void {
    this.ventaForm = this.fb.group({
      id_tienda: ['', Validators.required],
      id_empleado: ['', Validators.required],
      id_cliente: ['', Validators.required],
      fecha_hora_venta: [this.obtenerFechaActualInput(), Validators.required],
      detalles: this.fb.array([], Validators.required)
    });
    this.agregarFilaDetalle();
  }

  get detalles() {
    return this.ventaForm.get('detalles') as any;
  }

  agregarFilaDetalle(detalleData: any = null): void {
    const grupoDetalle = this.fb.group({
      id_juguete: [detalleData?.id_juguete || '', Validators.required],
      cantidad_comprada: [detalleData?.cantidad_comprada || 1, [Validators.required, Validators.min(1)]]
    });
    this.detalles.push(grupoDetalle);
  }

  eliminarFilaDetalle(index: number): void {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(index);
    }
  }

  obtenerDescuentoJuguete(idJuguete: any): number {
    if (!idJuguete) return 0;
    const juguete = this.juguetesDisponibles.find(j => j.id_juguete === Number(idJuguete) || j.id_juguete === idJuguete);
    if (juguete) {
      return Number(juguete.valor_descuento || juguete.descuento || juguete.porcentaje_descuento) || 0;
    }
    return 0;
  }

  calcularSubtotal(): number {
    let subtotal = 0;
    for (let control of this.detalles.controls) {
      const idJuguete = control.get('id_juguete')?.value;
      const cantidad = Number(control.get('cantidad_comprada')?.value) || 0;
      const jugueteEncontrado = this.juguetesDisponibles.find(j => j.id_juguete === Number(idJuguete) || j.id_juguete === idJuguete);
      if (jugueteEncontrado) {
        subtotal += Number(jugueteEncontrado.precio_unitario) * cantidad;
      }
    }
    return subtotal;
  }

  calcularDescuentoTotal(): number {
    let descuentoTotal = 0;
    for (let control of this.detalles.controls) {
      const idJuguete = control.get('id_juguete')?.value;
      const cantidad = Number(control.get('cantidad_comprada')?.value) || 0;
      const jugueteEncontrado = this.juguetesDisponibles.find(j => j.id_juguete === Number(idJuguete) || j.id_juguete === idJuguete);
      
      if (jugueteEncontrado) {
        const descuentoUnitario = this.obtenerDescuentoJuguete(idJuguete);
        if (descuentoUnitario > 0) {
          descuentoTotal += descuentoUnitario * cantidad;
        }
      }
    }
    return descuentoTotal;
  }

  calcularTotalFinal(): number {
    const subtotal = this.calcularSubtotal();
    const descuento = this.calcularDescuentoTotal();
    return Math.max(0, subtotal - descuento);
  }

  abrirFormularioRegistro(): void {
    this.modoEdicion = false;
    this.idVentaEnEdicion = null;
    this.mostrarFormulario = true;
    this.ventaForm.reset();
    this.detalles.clear();
    this.agregarFilaDetalle();
    this.ventaForm.patchValue({ fecha_hora_venta: this.obtenerFechaActualInput() });
  }

  abrirFormularioEdicion(venta: any): void {
    this.modoEdicion = true;
    this.idVentaEnEdicion = venta.id_venta;
    this.mostrarFormulario = true;
    
    this.ventaForm.patchValue({
      id_tienda: venta.id_tienda,
      id_empleado: venta.id_empleado,
      id_cliente: venta.id_cliente,
      fecha_hora_venta: venta.fecha_hora_venta ? venta.fecha_hora_venta.slice(0, 16) : this.obtenerFechaActualInput()
    });

    this.detalles.clear();
    if (venta.detalles && venta.detalles.length > 0) {
      venta.detalles.forEach((det: any) => {
        this.agregarFilaDetalle(det);
      });
    } else {
      this.agregarFilaDetalle();
    }
  }

  cancelarRegistro(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.idVentaEnEdicion = null;
  }

  cargarVentas(): void {
    this.ventaService.getVentas().subscribe({
      next: (res: any) => { 
        this.ventasRegistradas = res; 
        this.cdr.detectChanges(); // 👈 Fuerza a Angular a pintar la tabla de inmediato
      },
      error: (err: any) => { console.error('Error al cargar ventas', err); }
    });
  }

  cargarCatalogos(): void {
    this.tiendaService.getTiendas().subscribe({ next: (res: any) => { this.tiendas = res; } });
    this.empleadoService.getEmpleados().subscribe({ next: (res: any) => { this.empleados = res; } });
    this.clienteService.getClientes().subscribe({ next: (res: any) => { this.clientes = res; } });
    this.jugueteService.getJuguetes().subscribe({ next: (res: any) => { this.juguetesDisponibles = res; } });
  }

  obtenerFechaActualInput(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  guardarVenta(): void {
    if (this.ventaForm.invalid) {
      this.ventaForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.ventaForm.value,
      subtotal: this.calcularSubtotal(),
      descuento: this.calcularDescuentoTotal(),
      total: this.calcularTotalFinal()
    };

    if (this.modoEdicion && this.idVentaEnEdicion !== null) {
      this.ventaService.actualizarVenta(this.idVentaEnEdicion, payload).subscribe({
        next: () => {
          alert('¡Venta actualizada con éxito!');
          this.cancelarRegistro();
          this.cargarVentas();
        },
        error: (err: any) => { console.error(err); alert('Error al actualizar venta.'); }
      });
    } else {
      this.ventaService.crearVenta(payload).subscribe({
        next: () => {
          alert('¡Venta registrada con éxito!');
          this.cancelarRegistro();
          this.cargarVentas();
        },
        error: (err: any) => { console.error(err); alert('Error al guardar venta.'); }
      });
    }
  }

  eliminarVenta(idVenta: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      this.ventaService.eliminarVenta(idVenta).subscribe({
        next: () => {
          alert('Venta eliminada correctamente.');
          this.cargarVentas();
        },
        error: (err: any) => { console.error(err); alert('No se pudo eliminar la venta.'); }
      });
    }
  }
}