import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

/**
 * Defines the application's routes and their associated components.
 */
const routes: Routes = [
  /**
   * Route for the welcome page.
   * Path: 'welcome'
   * Component: WelcomePageComponent
   */
  { path: 'welcome', component: WelcomePageComponent },

  /**
   * Route for the movies page (list of movie cards).
   * Path: 'movies'
   * Component: MovieCardComponent
   */
  { path: 'movies', component: MovieCardComponent },

  /**
   * Redirect route to the welcome page when accessing the root URL.
   * Path: ''
   * Redirects to: 'welcome'
   */
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },

  /**
   * Route for the user profile page.
   * Path: 'profile'
   * Component: UserProfileComponent
   */
  { path: 'profile', component: UserProfileComponent },
];

/**
 * AppRoutingModule is responsible for setting up the application's routes.
 * It imports and exports the Angular RouterModule configured with the app's routes.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
