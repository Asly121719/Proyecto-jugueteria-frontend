export interface Venta {
  id_venta: string;
  id_tienda: string;
  id_empleado: string;
  id_cliente?: string;
  fecha_hora_venta: string;
}