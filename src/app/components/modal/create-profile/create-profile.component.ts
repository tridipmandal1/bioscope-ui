import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import { MatDialogRef} from "@angular/material/dialog";
import {HostService} from "../../../service/host.service";
import {ProfileRequest} from "../../../model/ProfileRequest";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css'
})
export class CreateProfileComponent {

  name: string = '';
  location: string = '';
  profile: ProfileRequest = new ProfileRequest();

  constructor(
    public dialogRef: MatDialogRef<CreateProfileComponent>,
    private hostService: HostService,
    private router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  updateProfile(): void {
    this.profile.name = this.name;
    this.profile.location = this.location;

    console.log('Profile data:', this.profile);
    console.log(localStorage.getItem('TOKEN'));
    this.hostService.updateProfile(this.profile).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        this.dialogRef.close();
        this.router.navigate(['/host/home']).then(r => {
          window.location.reload();
        });
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      }
    });
  }
}
