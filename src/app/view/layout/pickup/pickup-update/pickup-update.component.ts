import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../share/confirm-dialog/confirm-dialog.component';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { HttpStatusCode } from '@angular/common/http';
import { format } from 'date-fns';
import { Pickup } from 'src/app/model/Pickup';
import { PickupService } from 'src/app/service/pickup.service';

@Component({
  selector: 'app-pickup-update',
  templateUrl: './pickup-update.component.html',
  styleUrls: ['./pickup-update.component.scss']
})
export class PickupUpdateComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  id: string = "";
  pickupDto: Pickup = new Pickup();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private pickupService: PickupService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        pickupDate: ['', Validators.required],
      }
    );

    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.pickupService.fetchById(this.id).subscribe({
      next: (response: Pickup) => {
        this.form.get('pickupDate')!.setValue(response.pickupDate);
        this.pickupDto = response;
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
        let requestDto: Pickup = new Pickup();
        requestDto.id = this.pickupDto.id;
        requestDto.pickupDate = format(this.form.get('pickupDate')!.value, "yyyy-MM-dd");

        this.pickupService.update(requestDto).subscribe({
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
      pickupDate: this.pickupDto.pickupDate,
    });
  }

  back(): void {
    this.router.navigate(['/app/pickup']);
  }

}
