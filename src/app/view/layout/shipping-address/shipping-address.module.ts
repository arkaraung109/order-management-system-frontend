import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingAddressRoutingModule } from './shipping-address-routing.module';
import { ShippingAddressComponent } from './shipping-address.component';
import { ShippingAddressCreateComponent } from './shipping-address-create/shipping-address-create.component';
import { ShippingAddressUpdateComponent } from './shipping-address-update/shipping-address-update.component';
import { ShippingAddressListComponent } from './shipping-address-list/shipping-address-list.component';
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

@NgModule({
  declarations: [
    ShippingAddressComponent,
    ShippingAddressCreateComponent,
    ShippingAddressUpdateComponent,
    ShippingAddressListComponent
  ],
  imports: [
    CommonModule,
    ShippingAddressRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ShareModule,

    // Angular Material Modules
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSlideToggleModule
  ]
})
export class ShippingAddressModule { }
