import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, EditUserData } from '../fetch-api-data.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userData: EditUserData = {
    username: '',
    dob: '',
    email: '',
    password: '', // Will be used for the current password
  };

  currentPassword: string = ''; // This will hold the existing password
  userId: string = ''; // Store the user's _id separately

  constructor(
    private fetchApiData: ApiService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.getUserFromLocalStorage();
  }

  // Format date to YYYY-MM-DDTHH:mm:ss.sssZ (ISO format)
  formatDateToISOString(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString(); // Format to ISO 8601
  }

  // Format date to YYYY-MM-DD
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().substring(0, 10); // Format to YYYY-MM-DD
  }

  // Fetch user data from localStorage
  getUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Store the user's _id separately
      this.userId = parsedUser._id;

      // Only keep fields relevant for editing the user profile
      this.userData = {
        username: parsedUser.username,
        dob: this.formatDate(parsedUser.dob), // Assume dob is already in correct format, no need to convert here
        email: parsedUser.email,
        password: '', // Leave password empty initially
      };
    }
  }

  // Update user profile only if the current password is provided
  updateProfile(): void {
    if (!this.currentPassword) {
      this.snackBar.open(
        'Please enter your current password to update your profile.',
        'OK',
        {
          duration: 2000,
        }
      );
      return;
    }

    // Ensure dob is in ISO format before sending to the API
    const updatedUserData: EditUserData = {
      username: this.userData.username,
      dob: this.formatDateToISOString(this.userData.dob), // Convert dob to ISO string
      email: this.userData.email, // Not updating email
      password: this.currentPassword, // Use current password for verification
    };

    this.fetchApiData.editUser(this.userId, updatedUserData).subscribe(
      (response) => {
        // Update the user in localStorage after a successful API update
        localStorage.setItem(
          'user',
          JSON.stringify({ ...response, password: '' })
        );

        this.snackBar.open('Profile updated successfully!', 'OK', {
          duration: 2000,
        });

        // Clear the current password field after the update
        this.currentPassword = '';
      },
      (error) => {
        this.snackBar.open('Something went wrong, please try again.', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
