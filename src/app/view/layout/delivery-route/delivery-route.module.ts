import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryRouteRoutingModule } from './delivery-route-routing.module';
import { DeliveryRouteComponent } from './delivery-route.component';
import { DeliveryRouteCreateComponent } from './delivery-route-create/delivery-route-create.component';
import { DeliveryRouteListComponent } from './delivery-route-list/delivery-route-list.component';
import { DeliveryRouteUpdateComponent } from './delivery-route-update/delivery-route-update.component';
import { DeliveryRouteDetailsComponent } from './delivery-route-details/delivery-route-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '../../share/share.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    DeliveryRouteComponent,
    DeliveryRouteCreateComponent,
    DeliveryRouteListComponent,
    DeliveryRouteDetailsComponent,
    DeliveryRouteUpdateComponent
  ],
  imports: [
    CommonModule,
    DeliveryRouteRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ShareModule,
    PipeModule,

    // Angular Material Modules
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatCheckboxModule
  ]
})
export class DeliveryRouteModule { }
