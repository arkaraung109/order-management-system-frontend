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
import { Product } from 'src/app/model/Product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss']
})
export class ProductUpdateComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  id: number = 0;
  categoryList: Category[] = [];
  productDto: Product = new Product();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = Number(params['id']);
    });

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

    this.productService.fetchById(this.id).subscribe({
      next: (response: Product) => {
        this.form.setValue({
          name: response.name,
          category: response.category.id,
          manufacturingCost: response.manufacturingCost,
          retailPrice: response.retailPrice
        });
        this.productDto = response;
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
        let requestDto: Product = new Product();
        requestDto.id = this.productDto.id;
        requestDto.name = this.form.get('name')!.value.trim();
        requestDto.category.id = this.form.get('category')!.value;
        requestDto.manufacturingCost = this.form.get('manufacturingCost')!.value;
        requestDto.retailPrice = this.form.get('retailPrice')!.value;

        this.productService.update(requestDto).subscribe({
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
      name: this.productDto.name,
      category: this.productDto.category.id,
      manufacturingCost: this.productDto.manufacturingCost,
      retailPrice: this.productDto.retailPrice
    });
  }

  back(): void {
    this.router.navigate(['/app/product']);
  }

}
