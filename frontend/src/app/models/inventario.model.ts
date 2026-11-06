export interface InventarioTienda {
  id_inventario: string;
  id_tienda: string;
  id_juguete: string;
  stock_actual: number;
  pasillo_ubicacion?: string;
}