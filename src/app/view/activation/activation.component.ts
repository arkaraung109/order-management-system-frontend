import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from 'src/app/common/HttpResponse';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

  token!: string;
  valid: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    this.userService.activate(this.token).subscribe({
      next: (response: HttpResponse) => {
        this.valid = true;
      },
      error: (error) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.valid = false;
        }
      }
    });
  }

}
