import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickupRoutingModule } from './pickup-routing.module';
import { PickupComponent } from './pickup.component';
import { PickupListComponent } from './pickup-list/pickup-list.component';
import { PickupUpdateComponent } from './pickup-update/pickup-update.component';
import { PickupDetailsComponent } from './pickup-details/pickup-details.component';
import { PickupCreateComponent } from './pickup-create/pickup-create.component';
import { PickupDetailsCreateComponent } from './pickup-details-create/pickup-details-create.component';
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
    PickupComponent,
    PickupListComponent,
    PickupUpdateComponent,
    PickupDetailsComponent,
    PickupCreateComponent,
    PickupDetailsCreateComponent
  ],
  imports: [
    CommonModule,
    PickupRoutingModule,
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
export class PickupModule { }
