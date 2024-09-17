import { Component, OnInit, Input } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { ApiService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * UserRegistrationFormComponent is responsible for handling user registration.
 * It collects user input for creating a new account and interacts with the API to register the user.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss',
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * Object that holds the user's input data for registration, such as username, password, email, date of birth, and favorite movies.
   * @type {{username: string, password: string, email: string, dob: string, favorite_movies: string[]}}
   */
  @Input() userData = {
    username: '',
    password: '',
    email: '',
    dob: '',
    favorite_movies: [],
  };

  /**
   * Constructs an instance of UserRegistrationFormComponent.
   *
   * @param dialogRef - Reference to the dialog used to close it after registration.
   * @param fetchApiData - The service responsible for making API calls.
   * @param snackBar - Material Snackbar used for displaying notifications.
   */
  constructor(
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public fetchApiData: ApiService,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Angular lifecycle hook that is called after the component has been initialized.
   * Currently, no specific logic is implemented here.
   */
  ngOnInit(): void {}

  /**
   * This function sends the user input data to the API for registration.
   * It will display a success message upon registration and close the dialog.
   * In case of failure, an error message is displayed.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        // Logic for a successful user registration
        this.dialogRef.close(); // This will close the modal on success
        this.snackBar.open('User registered successfully!', 'OK', {
          duration: 2000,
        });
      },
      (result) => {
        // Logic for a failed registration
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
