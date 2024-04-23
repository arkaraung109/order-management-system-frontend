import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { startWithSpaceValidator } from 'src/app/validator/startWithSpace.validator';
import { ConfirmDialogComponent } from '../../../share/confirm-dialog/confirm-dialog.component';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { customValidator } from 'src/app/validator/custom.validator';
import { HttpStatusCode } from '@angular/common/http';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/model/Category';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  form!: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      { name: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"), startWithSpaceValidator(), customValidator('duplication')]] }
    );
  }

  create(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'create'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestDto: Category = new Category();
        requestDto.name = this.form.get('name')!.value.trim();

        this.categoryService.create(requestDto).subscribe({
          next: (response: HttpResponse) => {
            const moreDialogRef = this.matDialog.open(ConfirmDialogComponent, {
              width: '300px', data: 'create more'
            });

            moreDialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.reset();
              } else {
                this.back();
              }
            });

            this.toastrService.success(response.message, response.title);
          },
          error: (error) => {
            if (error.status == HttpStatusCode.Conflict) {
              this.form.get('name')!.setErrors({ required: false, duplication: true });
            }
          }
        });
      }
    });
  }

  reset(): void {
    this.submitted = false;
    this.formDirective.resetForm();
  }

  back(): void {
    this.router.navigate(['/app/category']);
  }

}
