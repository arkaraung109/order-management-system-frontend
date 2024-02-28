import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/model/Product';


@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  categoryList: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.maxLength(150), Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;?%$\\\\]*$"), startWithSpaceValidator(), customValidator('duplication')]],
        category: ['', Validators.required],
        manufacturingCost: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,5}$")]],
        retailPrice: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,5}$")]]
      }
    );

    this.categoryService.fetchAll().subscribe(data => {
      this.categoryList = data;
    });
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
        let requestDto: Product = new Product();
        requestDto.name = this.form.get('name')!.value.trim();
        requestDto.category.id = this.form.get('category')!.value;
        requestDto.manufacturingCost = this.form.get('manufacturingCost')!.value;
        requestDto.retailPrice = this.form.get('retailPrice')!.value;

        this.productService.create(requestDto).subscribe({
          next: (response: HttpResponse) => {
            const moreDialogRef = this.matDialog.open(ConfirmDialogComponent, {
              width: '300px', data: 'create more'
            });

            moreDialogRef.afterClosed().subscribe(result => {
              if (result) {
                location.reload();
              } else {
                this.back();
              }
            });

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
    this.form.reset();
  }

  back(): void {
    this.router.navigate(['/app/product']);
  }

}
