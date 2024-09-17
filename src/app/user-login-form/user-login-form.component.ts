import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * The UserLoginFormComponent is responsible for handling the user login process.
 * It interacts with the API, handles user input, and displays notifications to the user.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent implements OnInit {
  /**
   * Holds the user's login credentials.
   * @type {{ email: string, password: string }}
   */
  @Input() userData = { email: '', password: '' };

  /**
   * Constructor for UserLoginFormComponent.
   *
   * @param fetchApiData - API service to make the login request
   * @param dialogRef - Reference to the dialog, allowing it to be closed upon success
   * @param snackBar - Material SnackBar to show notifications
   * @param router - Router to navigate the user upon successful login
   */
  constructor(
    public fetchApiData: ApiService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook that runs after the component's view has been initialized.
   */
  ngOnInit(): void {}

  /**
   * Sends the user's login data to the API.
   * If the login is successful, it stores the token and user information in localStorage,
   * shows a success message, and navigates the user to the "movies" page.
   *
   * If the login fails, it shows an error message.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // Close the dialog on success
        this.dialogRef.close();
        // Show welcome message
        this.snackBar.open(`Welcome, ${result.user.username}!`, 'OK', {
          duration: 2000,
        });
        // Store the token and user data in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        // Navigate to the movies page
        this.router.navigate(['movies']);
      },
      (error) => {
        // Show error message on failure
        this.snackBar.open('Login failed. Please try again.', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
