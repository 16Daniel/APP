import { AlarmaComponent } from './task-evening/alarma/alarma.component';
import { ResguardoTabletaComponent } from './task-evening/resguardo-tableta/resguardo-tableta.component';
import { LimpiezaSalonBanosComponent } from './task-evening/limpieza-salon-banos/limpieza-salon-banos.component';
import { ResguardoPropinaComponent } from './task-evening/resguardo-propina/resguardo-propina.component';
import { VoladoEfectivoComponent } from './task-evening/volado-efectivo/volado-efectivo.component';
import { TransferenciasComponent } from './task-evening/transferencias/transferencias.component';
import { AlbaranesComponent } from './task-evening/albaranes/albaranes.component';
import { ProductoRiesgoComponent } from './task-evening/producto-riesgo/producto-riesgo.component';
import { RemisionesComponent } from './task-evening/remisiones/remisiones.component';
import { SalesExpectationComponent } from './task-morning/sales-expectation/sales-expectation.component';
import { LoungeMountedComponent } from './task-morning/lounge-mounted/lounge-mounted.component';
import { GasValidationComponent } from './task-morning/gas-validation/gas-validation.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CentroControlMatutinoComponent } from './task-morning/centro-control-matutino/centro-control-matutino.component';
import { CentroControlVespertinoComponent } from './task-evening/centro-control-vespertino/centro-control-vespertino.component';
import { AttendanceValidationComponent } from './task-morning/attendance-validation/attendance-validation.component';
import { WaitTablesComponent } from './task-morning/wait-tables/wait-tables.component';
import { ResguardoTabletAlarmaComponent } from './task-evening/resguardo-tablet-alarma/resguardo-tablet-alarma.component';
const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent,
  },
  {
    path: 'control-matutino', // child route path
    component: CentroControlMatutinoComponent, // child route component that the router renders
  },
  {
    path: 'control-vespertino',
    component: CentroControlVespertinoComponent, // another child route component that the router renders
  },
  {
    path: 'validacion-assistencia/:turno',
    component: AttendanceValidationComponent,
  },
  {
    path: 'validacion-gas/:id',
    component: GasValidationComponent,
  },
  {
    path: 'salon-montado/:id',
    component: LoungeMountedComponent,
  },
  {
    path: 'expectativa-venta/:id',
    component: SalesExpectationComponent,
  },
  {
    path: 'mesa-espera/:turno/:id',
    component: WaitTablesComponent,
  },
  {
    path: 'remisiones/:id',
    component: RemisionesComponent,
  },
  {
    path: 'producto-riesgo/:id',
    component: ProductoRiesgoComponent,
  },
  {
    path: 'albaranes/:id',
    component: AlbaranesComponent,
  },
  {
    path: 'transferencias/:id',
    component: TransferenciasComponent,
  },
  {
    path: 'volado-efectivo/:id',
    component: VoladoEfectivoComponent,
  },
  {
    path: 'resguardo-propina/:id',
    component: ResguardoPropinaComponent,
  },
  {
    path: 'limpieza-salon-banos/:id',
    component: LimpiezaSalonBanosComponent,
  },
  {
    path: 'resguardo-tableta/:id',
    component: ResguardoTabletaComponent,
  },
  {
    path: 'alarma/:id',
    component: AlarmaComponent,
  },
  {
    path: 'resguardo-tableta/:idTablet/alarma/:idAlarma',
    component: ResguardoTabletAlarmaComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisoresRoutingModule {}
