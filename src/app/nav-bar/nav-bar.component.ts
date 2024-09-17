import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The NavBarComponent is responsible for displaying the navigation bar
 * and handling user interactions such as logging out.
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  /**
   * Constructor for the NavBarComponent.
   *
   * @param router - The Router service used for navigation between routes.
   */
  constructor(private router: Router) {}

  /**
   * Logs the user out by removing the user's token and information from local storage
   * and then redirects them to the welcome page.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/welcome']);
  }
}
