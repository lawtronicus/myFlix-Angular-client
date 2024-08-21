import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Declaring the api url that will provide data for the client app
const apiUrl = 'YOUR_HOSTED_API_URL_HERE/';
const token = localStorage.getItem('token');

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Making the api call to delete the user
  public deleteUser(): Observable<any> {
    const user = localStorage.getItem('user'); // Retrieve the username from local storage

    return this.http
      .delete(apiUrl + 'users/' + user, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Making the api call to get the user details
  public getUser(): Observable<any> {
    const user = localStorage.getItem('user'); // Retrieve the username from local storage

    return this.http
      .get(apiUrl + 'users/' + user, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Making the api call for the user login endpoint
  public userLogin(userData: any): Observable<any> {
    const { email, password } = userData;

    // Construct the URL with query parameters
    const url = `${apiUrl}login/?email=${encodeURIComponent(
      email
    )}&password=${encodeURIComponent(password)}`;

    return this.http
      .get(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //Edit user
  public editUser(userId: string, userData: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users/' + userId, userData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Add movie to favorites
  public addFavoriteMovie(movieId: string): Observable<any> {
    const user = localStorage.getItem('user'); // Retrieve the username from local storage

    return this.http
      .put(apiUrl + `users/${user}/Movies/${movieId}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Delete movie to favorites
  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    const user = localStorage.getItem('user'); // Retrieve the username from local storage

    return this.http
      .delete(apiUrl + `users/${user}/Movies/${movieId}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Get all movies call
  public getMovies(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make api call to get a movie by title
  public getMovieByTitle(title: string): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    return this.http
      .get(apiUrl + `movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make api call to get the director of a specific movie
  public getDirector(movie: string): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    return this.http
      .get(apiUrl + `movies/${movie}/directors`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make api call to get the genre of a specific movie
  public getGenre(movie: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${movie}/genre`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get writers of a specific movie
  public getWriters(movie: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${movie}/writers`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get the main_actor of a specific movie
  public getMainActor(movie: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${movie}/main-actors`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get the description of a movie
  public getDescription(movie: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${movie}/description`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get a movie's image
  public getImage(movie: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${movie}/image`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get a director's info
  public getDirectorInfo(director: string): Observable<any> {
    return this.http
      .get(apiUrl + `directors/${director}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get a genre's info
  public getGenreInfo(genre: string): Observable<any> {
    return this.http
      .get(apiUrl + `genre/${genre}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
