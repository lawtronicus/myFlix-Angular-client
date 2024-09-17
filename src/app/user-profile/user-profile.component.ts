import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, EditUserData } from '../fetch-api-data.service';
import { isPlatformBrowser } from '@angular/common';

/**
 * UserProfileComponent is responsible for displaying and allowing updates
 * to the user's profile. It fetches the user's data, formats the date,
 * and interacts with the API to save any updates.
 */
@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  /**
   * Holds the user's data for editing purposes, such as username, date of birth, email, and password.
   * @type {EditUserData}
   */
  userData: EditUserData = {
    username: '',
    dob: '',
    email: '',
    password: '', // Will be used for the current password
  };

  /**
   * Stores the user's current password, used to verify the update.
   * @type {string}
   */
  currentPassword: string = '';

  /**
   * Stores the user's unique ID (_id), fetched from localStorage.
   * @type {string}
   */
  userId: string = '';

  /**
   * Constructor for the UserProfileComponent.
   *
   * @param fetchApiData - The API service used to interact with the backend
   * @param snackBar - Material SnackBar to display notifications
   * @param platformId - Injected platformId to determine if the app is running in the browser
   */
  constructor(
    private fetchApiData: ApiService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Angular lifecycle hook that runs after the component's view has been initialized.
   * It fetches the user's data from localStorage.
   */
  ngOnInit(): void {
    this.getUserFromLocalStorage();
  }

  /**
   * Formats a date string to ISO 8601 format.
   *
   * @param dateString - The date string to format
   * @returns {string} - The formatted date in ISO 8601 format
   */
  formatDateToISOString(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString(); // Format to ISO 8601
  }

  /**
   * Formats a date string to YYYY-MM-DD format.
   *
   * @param dateString - The date string to format
   * @returns {string} - The formatted date as YYYY-MM-DD
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().substring(0, 10); // Format to YYYY-MM-DD
  }

  /**
   * Fetches the user data from localStorage and stores it in `userData`.
   * The password field is left empty initially for security reasons.
   */
  getUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Store the user's _id separately
      this.userId = parsedUser._id;

      // Only keep fields relevant for editing the user profile
      this.userData = {
        username: parsedUser.username,
        dob: this.formatDate(parsedUser.dob), // Format the date
        email: parsedUser.email,
        password: '', // Password left blank initially
      };
    }
  }

  /**
   * Updates the user's profile by calling the API if the current password is provided.
   * The date of birth is formatted to ISO 8601 before sending it to the backend.
   */
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
      email: this.userData.email, // Email is not being updated
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
