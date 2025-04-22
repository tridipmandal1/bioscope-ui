import {Component, OnInit, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {HostService} from "../../../service/host.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CreateProfileComponent} from "../../modal/create-profile/create-profile.component";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AuthRequest} from "../../../model/AuthRequest";
import {ToastNotificationComponent} from "../../../utils/toast-notification/toast-notification.component";
import {Router} from "@angular/router";


@Component({
  selector: 'app-host-landing',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ToastNotificationComponent
  ],
  templateUrl: './host-landing.component.html',
  styleUrl: './host-landing.component.css'
})
export class HostLandingComponent implements OnInit {
  @ViewChild('toast') toast!: ToastNotificationComponent;

  public isSignup: boolean = true;
  isCreatingProfile: boolean = false;
  hostHere: AuthRequest = new AuthRequest();

  signUpFormGroup: FormGroup = new FormGroup({});
  loginFormGroup: FormGroup = new FormGroup({});

  constructor(
    private hostService: HostService,
    private profileDialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit() {
    if(this.hostService.isAuthenticated()){
      this.router.navigate(['/']).then(r => {});
    }
    this.isSignup = true;

    this.signUpFormGroup = this.formBuilder.group({
      signupEmail: new FormControl(''),
      signupPassword: new FormControl('')
    });

    this.loginFormGroup = this.formBuilder.group({
      loginEmail: new FormControl(''),
      loginPassword: new FormControl('')
    });
  }


  onSignup(){
    this.hostHere.email = this.signUpFormGroup.get('signupEmail')?.value;
    this.hostHere.password = this.signUpFormGroup.get('signupPassword')?.value;
    this.hostHere.role = 'HOST';
    console.log(this.hostHere);
    this.hostService.registerHost(this.hostHere).subscribe(
      {
        next: (response) => {
          console.log(response);
          this.isSignup = false;
          const astrixEmail = this.hostHere.email
            .replace(/(.{2})(.*)(@.*)/, '$1****$3');
          this.toast.showToast(`A verification email has been sent to ${astrixEmail}.
     Please check your inbox and verify your email address.`, true);
        },
        error: (error) => {
          console.error(error);
          if(error.status === 409){
            this.toast.showToast('Email already exists', false);
          }
        }
      }
    );
  }

  onLogin() {
    this.hostHere.email = this.loginFormGroup.get('loginEmail')?.value;
    this.hostHere.password = this.loginFormGroup.get('loginPassword')?.value;
    console.log(this.hostHere);
    this.hostService.login(this.hostHere).subscribe({
      next: (response) => {
        console.log(response);
        this.hostService.getUserProfile().subscribe({
          next: op => {
            if(op.body.name === null || op.body.name === ''){
              this.isCreatingProfile = true;
              this.openCreateProfileDialog();
            }else{
              this.router.navigate(['/']).then(r => {});
            }
          },
          error: error => {
            console.error(error);
          }
        });
      },
      error: (error) => {
        console.error(error);
        if (error.status === 401) {
          this.toast.showToast('Invalid email or password', false);
        }
      }
    });
  }

  toggleSignup() {
    this.isSignup = !this.isSignup;
  }

  openCreateProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'my-no-padding-dialog';
    this.profileDialog.open(CreateProfileComponent, dialogConfig);
  }

}
