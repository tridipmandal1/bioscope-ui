import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.css'
})
export class ToastNotificationComponent {

  @ViewChild('toast') toastElement!: ElementRef;
  message = '';
  success = false;

  showToast(message: string, success: boolean) {
    this.message = message;
    const toast = new (window as any).bootstrap.Toast(this.toastElement.nativeElement);
    this.success = success;
    toast.show();

    setTimeout(() => toast.hide(), 5000);
  }
}
