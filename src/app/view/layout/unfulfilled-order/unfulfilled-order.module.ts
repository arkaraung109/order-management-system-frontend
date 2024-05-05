import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnfulfilledOrderRoutingModule } from './unfulfilled-order-routing.module';
import { UnfulfilledOrderComponent } from './unfulfilled-order.component';
import { UnfulfilledOrderListComponent } from './unfulfilled-order-list/unfulfilled-order-list.component';
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

@NgModule({
  declarations: [
    UnfulfilledOrderComponent,
    UnfulfilledOrderListComponent
  ],
  imports: [
    CommonModule,
    UnfulfilledOrderRoutingModule,
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
    MatDatepickerModule
  ]
})
export class UnfulfilledOrderModule { }
