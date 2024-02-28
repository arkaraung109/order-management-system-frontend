import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { startWithSpaceValidator } from 'src/app/validator/startWithSpace.validator';
import { ConfirmDialogComponent } from '../../../share/confirm-dialog/confirm-dialog.component';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { customValidator } from 'src/app/validator/custom.validator';
import { HttpStatusCode } from '@angular/common/http';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/model/Category';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss']
})
export class CategoryUpdateComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  id: number = 0;
  categoryDto: Category = new Category();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = Number(params['id']);
    });

    this.form = this.fb.group(
      { name: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"), startWithSpaceValidator(), customValidator('duplication')]] }
    );

    this.categoryService.fetchById(this.id).subscribe({
      next: (response: Category) => {
        this.form.get('name')!.setValue(response.name);
        this.categoryDto = response;
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
        let requestDto: Category = new Category();
        requestDto.id = this.categoryDto.id;
        requestDto.name = this.form.get('name')!.value.trim();

        this.categoryService.update(requestDto).subscribe({
          next: (response: HttpResponse) => {
            this.back();
            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.Conflict) {
              if (error.error.message == "Duplicated Name") {
                this.form.get('name')!.setErrors({ required: false, duplication: true });
              }
            }
          }
        });
      }
    });
  }

  reset(): void {
    this.form.setValue({
      name: this.categoryDto.name
    });
  }

  back(): void {
    this.router.navigate(['/app/category']);
  }

}
