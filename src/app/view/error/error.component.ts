import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  errorCode: string = `${HttpStatusCode.InternalServerError}`;
  errorMessage: string = "Something went wrong";
  returnRoute: string = '/';

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.errorCode = params.get('errorCode')!.toString();

      switch (this.errorCode) {
        case `${HttpStatusCode.Unauthorized}`: {
          this.errorCode = `${HttpStatusCode.Unauthorized}`;
          this.errorMessage = "Session Expired! Please login again.";
          this.returnRoute = '/auth';
          break;
        }
        case `${HttpStatusCode.Forbidden}`: {
          this.errorCode = `${HttpStatusCode.Forbidden}`;
          this.errorMessage = "Forbidden access! Sorry, you have no permission to access this page.";
          this.returnRoute = '/auth';
          break;
        }
        case `${HttpStatusCode.NotFound}`: {
          this.errorCode = `${HttpStatusCode.NotFound}`;
          this.errorMessage = "Page Not Found! Sorry, there is no page found with this URL.";
          this.returnRoute = '/auth';
          break;
        }
        case `${HttpStatusCode.BadRequest}`: {
          this.errorCode = `${HttpStatusCode.BadRequest}`;
          this.errorMessage = "Bad Request! The server cannot process the request due to something that is perceived to be a client error.";
          this.returnRoute = '/auth';
          break;
        }
        case `${HttpStatusCode.ServiceUnavailable}`: {
          this.errorCode = `${HttpStatusCode.ServiceUnavailable}`;
          this.errorMessage = "Service Unavailable! Sorry, this service is currently unavailable.";
          this.returnRoute = '/auth';
          break;
        }
      }
    });
  }

}
