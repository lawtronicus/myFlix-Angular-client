import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MatIconModule } from '@angular/material/icon';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { GenreComponent } from './genre/genre.component';
import { DirectorComponent } from './director/director.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    MovieCardComponent,
    UserLoginFormComponent,
    UserRegistrationFormComponent,
    MovieDetailsComponent,
    UserProfileComponent,
    NavBarComponent,
    GenreComponent,
    DirectorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule, // Required for Angular Material components
    FormsModule, // Required for ngModel
    MatFormFieldModule, // Importing Angular Material modules
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    HttpClientModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  bootstrap: [AppComponent], // This line is required
})
export class AppModule {}
