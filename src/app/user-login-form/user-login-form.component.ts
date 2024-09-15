import { Router } from '@angular/router';

// src/app/user-login-form/user-login-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { ApiService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent {
  @Input() userData = { email: '', password: '' };

  constructor(
    public fetchApiData: ApiService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router // Inject the Router here
  ) {}

  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // Logic for a successful login goes here! (To be implemented)
        this.dialogRef.close(); // This will close the modal on success!
        this.snackBar.open(`Welcome, ${result.user.username}!`, 'OK', {
          duration: 2000,
        });
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        this.router.navigate(['movies']);
      },
      (error) => {
        // Display an error message
        this.snackBar.open('Login failed. Please try again.', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
