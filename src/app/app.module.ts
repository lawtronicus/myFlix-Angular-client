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

const appRoutes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'prefix' },
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    MovieCardComponent,
    UserLoginFormComponent,
    UserRegistrationFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Required for Angular Material components
    FormsModule, // Required for ngModel
    MatFormFieldModule, // Importing Angular Material modules
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatIconModule,
  ],
  bootstrap: [AppComponent], // This line is required
})
export class AppModule {}
