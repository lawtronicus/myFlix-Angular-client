import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * WelcomePageComponent is the landing page component for the application.
 * It provides users with options to either register or log in.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  /**
   * Constructor to inject dependencies
   *
   * @param dialog - Angular Material Dialog used to open registration and login forms.
   */
  constructor(public dialog: MatDialog) {}

  /**
   * Angular lifecycle hook that is called after the component has been initialized.
   * No logic is currently implemented.
   */
  ngOnInit(): void {}

  /**
   * Opens the user registration form in a modal dialog.
   * The dialog width is set to 280px.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /**
   * Opens the user login form in a modal dialog.
   * The dialog width is set to 280px.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
