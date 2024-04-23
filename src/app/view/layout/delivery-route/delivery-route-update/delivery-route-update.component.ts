import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../share/confirm-dialog/confirm-dialog.component';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { HttpStatusCode } from '@angular/common/http';
import { format } from 'date-fns';
import { DeliveryRoute } from 'src/app/model/DeliveryRoute';
import { DeliveryRouteService } from 'src/app/service/delivery-route.service';

@Component({
  selector: 'app-delivery-route-update',
  templateUrl: './delivery-route-update.component.html',
  styleUrls: ['./delivery-route-update.component.scss']
})
export class DeliveryRouteUpdateComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  id: string = "";
  deliveryRouteDto: DeliveryRoute = new DeliveryRoute();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private deliveryRouteService: DeliveryRouteService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        deliveryDate: ['', Validators.required],
      }
    );

    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.deliveryRouteService.fetchById(this.id).subscribe({
      next: (response: DeliveryRoute) => {
        this.form.get('deliveryDate')!.setValue(response.deliveryDate);
        this.deliveryRouteDto = response;
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.toastrService.error(error.error.message, error.error.title);
        }
        this.back();
      }
    });
  }

  update(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'update'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestDto: DeliveryRoute = new DeliveryRoute();
        requestDto.id = this.deliveryRouteDto.id;
        requestDto.deliveryDate = format(this.form.get('deliveryDate')!.value, "yyyy-MM-dd");

        this.deliveryRouteService.update(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.back();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.NotFound) {
              this.toastrService.error(error.error.message, error.error.title);
            }
          }
        });
      }
    });
  }

  reset(): void {
    this.form.setValue({
      deliveryDate: this.deliveryRouteDto.deliveryDate,
    });
  }

  back(): void {
    this.router.navigate(['/app/delivery-route']);
  }

}
