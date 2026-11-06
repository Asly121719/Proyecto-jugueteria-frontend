import { Routes } from '@angular/router';
import { ShellComponent } from './layouts/shell/shell.component'; // 👈 Usamos tu Shell existente
import { JuguetesComponent } from './pages/juguetes/juguetes.component';
import { TiendasComponent } from './pages/tiendas/tiendas.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { CargosComponent } from './pages/cargos/cargos.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { PromocionesComponent } from './pages/promociones/promociones.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { GarantiasComponent } from './pages/garantias/garantias.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent, // 👈 Carga el menú y cabecera al iniciar la app
    children: [
      { path: 'juguetes', component: JuguetesComponent },
      { path: 'tiendas', component: TiendasComponent },
      { path: 'empleados', component: EmpleadosComponent },
      { path: 'cargos', component: CargosComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'inventario-tiendas', component: InventarioComponent },
      { path: 'promociones', component: PromocionesComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'garantias', component: GarantiasComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];