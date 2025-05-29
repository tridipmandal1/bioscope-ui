import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "../../../service/auth.service";
import {ToastNotificationComponent} from "../../../utils/toast-notification/toast-notification.component";
import {AuthRequest} from "../../../model/AuthRequest";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgClass,
    ToastNotificationComponent
  ],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class UserAuthComponent implements OnInit{
  @ViewChild('toast') toast!: ToastNotificationComponent;
  isLoginMode = true;
  loginForm: FormGroup = this.fb.group({});
  signupForm: FormGroup = this.fb.group({});
  showPassword = false;
  showConfirmPassword = false;
  userAuthReq: AuthRequest= new AuthRequest();

  constructor(private fb: FormBuilder, private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });


    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }


  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login form submitted', this.loginForm.value);
      this.userAuthReq.email = this.loginForm.value.email;
      this.userAuthReq.password = this.loginForm.value.password;
      this.userAuthReq.role = 'USER';
      this.authService.login(this.userAuthReq).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.toast.showToast('Login successful!', true);
          this.router.navigate(['']).then(() => {});
        },
        error: (error) => {
          console.error('Login failed', error);
          this.toast.showToast(error.error.message, false);
        }
      })
    }
  }


  onSignupSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Signup form submitted', this.signupForm.value);
      this.userAuthReq.email = this.signupForm.value.email;
      this.userAuthReq.password = this.signupForm.value.password;
      this.userAuthReq.role = 'USER';
      this.authService.registerHost(this.userAuthReq).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.toast.showToast('A verification link has been send to your email, ' +
            'verify account to continue login', true);
          this.toggleMode();
        },
        error: (error) => {
          console.error('Signup failed', error);
          if(error.errors.errorCode === 201){
            this.toast.showToast('Email already exists!', false);
          }else{
            this.toast.showToast('Signup failed!', false);
          }

        }
      })
    }
  }
}
