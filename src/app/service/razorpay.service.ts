import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {PaymentVerification} from "../model/PaymentVerification";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {

  private REST_URL = environment.BIOSCOPE_USERS;
  private RAZORPAY_KEY_ID = environment.RAZOR_PAY_KEY_ID;
  constructor(private http: HttpClient) { }

  loadRazorpayScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any)['Razorpay']) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  verifyPayment(request: PaymentVerification): Observable<any> {
    return this.http.post(`${this.REST_URL}/v01/user/verify-payment`, request, {
      observe: 'response' as 'body'
    });
  }

}
