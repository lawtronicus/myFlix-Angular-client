import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://my-flix-application-66e35a87937e.herokuapp.com/';

//Define interfaces for the user registration
export interface UserDetails {
  username: string;
  password: string;
  email: string;
  dob: string;
  favorite_movies: string[];
}

interface UserRegistrationResponse {
  username: string;
  password: string;
  email: string;
  dob: string; // ISO 8601 date string
  favorite_movies: string[]; // Array of movie IDs or objects, depending on your API design
  _id: string; // MongoDB document ID
  __v: number; // Version key set by Mongoose
}

// Define interface for deleteuser
interface DeleteUserResponse {
  message: string;
  // Add any other fields your API might return
}

//Define interface for getUser
export interface User {
  _id: string; // MongoDB ID
  username: string; // Username of the user
  password: string; // Hashed password
  email: string; // User's email address
  dob: Date; // Date of birth as an ISO 8601 string
  favorite_movies: string[]; // Array of favorite movie IDs
  __v: number; // Version key set by Mongoose
}

//Define movie interface
export interface Movie {
  _id: string;
  title: string;
  description: string;
  imageurl: string;
  featured: boolean;
  writers: string[]; // Array of writer IDs or names
  genres: Genre[]; // Array of genre IDs
  directors: Director[]; // Array of director IDs
  main_actor: MainActor; // ID of the main actor
}

//Define Genre Interface
export interface Genre {
  _id: string;
  name: string;
  description: string;
}

//Define Director Interface
export interface Director {
  _id: string;
  name: string;
  bio: string;
  dob: string; // Date of birth
  dod?: string | null; // Date of death, optional (nullable)
}

//Define Interface for userLogin
interface UserLoginData {
  email: string;
  password: string; // Hashed password
}

//Define Main Character Interface
interface MainActor {
  _id: string;
  name: string;
  dob: string; // Date of birth
  bio: string;
}

//Define interface for userLoginResponse
interface UserLoginResponse {
  user: User;
  token: string; // JWT token returned by the API
}

//Define interface for EditUserData
export interface EditUserData {
  username: string;
  password: string;
  email: string;
  dob: string; // ISO 8601 formatted date string
}

//Movie Genres Response Interface
export interface MovieGenreResponse {
  title: string;
  genres: Genre[];
}

//Movie writers Response interface
interface MovieWritersResponse {
  title: string;
  writers: string[]; // Array of writer names as strings
}

//Main Actor Response interface
interface MovieMainActorResponse {
  title: string;
  main_actor: MainActor;
}

//Description response interface
interface MovieDescriptionResponse {
  title: string;
  description: string;
}

interface MovieImageUrlResponse {
  title: string;
  imageUrl: string;
}
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  // Making the api call for the user registration endpoint
  public userRegistration(
    userDetails: UserDetails
  ): Observable<UserRegistrationResponse> {
    console.log(userDetails);
    return this.http
      .post<UserRegistrationResponse>(apiUrl + 'users', userDetails)
      .pipe(
        catchError(this.handleError) // Handle errors
      );
  }

  // Making the api call to delete the user
  public deleteUser(): Observable<DeleteUserResponse> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user'); // Retrieve the username from local storage

    return this.http
      .delete<DeleteUserResponse>(`${apiUrl}users/${user}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Making the api call to get the user details
  public getUser(): Observable<User> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Retrieve the username from local storage

    if (storedUser) {
      const user = JSON.parse(storedUser); // Parse the string back into an object
      const userId = user._id; // Access the _id property
      console.log('User ID:', userId); // Now userId will be the actual ID

      // Now make the HTTP request inside the `if` block using the `userId`
      return this.http
        .get<User>(apiUrl + 'users/' + userId, {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token, // Include the token in the Authorization header
          }),
        })
        .pipe(catchError(this.handleError));
    } else {
      // Handle the case where no user is found in localStorage (perhaps throw an error or return an empty observable)
      console.error('No user found in localStorage.');
      return throwError(() => new Error('No user found in localStorage.'));
    }
  }

  // Making the api call for the user login endpoint
  public userLogin(userData: UserLoginData): Observable<UserLoginResponse> {
    const { email, password } = userData;

    // Construct the URL with query parameters
    const url = `${apiUrl}login/?email=${email}&password=${password}`;

    return this.http
      .post<UserLoginResponse>(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //Edit user
  public editUser(userId: string, userData: EditUserData): Observable<User> {
    console.log(userId);
    console.log(userData);
    const token = localStorage.getItem('token');
    return this.http
      .put<User>(apiUrl + 'users/' + userId, userData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  public addFavoriteMovie(movieTitle: string): Observable<User> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Retrieve the user object from localStorage

    if (storedUser) {
      const user = JSON.parse(storedUser); // Parse the user object
      const userId = user._id; // Extract the user _id

      return this.http
        .put<User>(`${apiUrl}users/${userId}/${movieTitle}`, null, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          }),
        })
        .pipe(catchError(this.handleError));
    } else {
      // Handle the case where the user is not available in localStorage
      throw new Error('User not found in localStorage');
    }
  }

  // Delete movie from favorites
  public deleteFavoriteMovie(movieTitle: string): Observable<User> {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    const storedUser = localStorage.getItem('user'); // Retrieve the user object from localStorage

    if (storedUser) {
      const user = JSON.parse(storedUser); // Parse the user object
      const userId = user._id; // Extract the user _id

      return this.http
        .delete<User>(`${apiUrl}users/${userId}/${movieTitle}`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          }),
        })
        .pipe(catchError(this.handleError));
    } else {
      // Handle the case where the user is not available in localStorage
      throw new Error('User not found in localStorage');
    }
  }

  // Get all movies call
  public getMovies(): Observable<Movie[]> {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    return this.http
      .get<Movie[]>(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make api call to get a movie by title
  public getMovieByTitle(title: string): Observable<Movie> {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    return this.http
      .get<Movie>(apiUrl + `movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make api call to get the director of a specific movie
  public getDirector(director: string): Observable<Director> {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    return this.http
      .get<Director>(`${apiUrl}directors/${director}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make api call to get movie genre
  public getGenreByMovieTitle(title: string): Observable<MovieGenreResponse> {
    const token = localStorage.getItem('token');
    return this.http.get<MovieGenreResponse>(`${apiUrl}movies/${title}/genre`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    });
  }

  // Make an api call to get writers of a specific movie
  public getWriters(movie: string): Observable<MovieWritersResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .get<MovieWritersResponse>(apiUrl + `movies/${movie}/writers`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get the main_actor of a specific movie
  public getMainActor(movie: string): Observable<MovieMainActorResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .get<MovieMainActorResponse>(apiUrl + `movies/${movie}/main-actors`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get the description of a movie
  public getDescription(movie: string): Observable<MovieDescriptionResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .get<MovieDescriptionResponse>(apiUrl + `movies/${movie}/description`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get a movie's image
  public getImage(movie: string): Observable<MovieImageUrlResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .get<MovieImageUrlResponse>(apiUrl + `movies/${movie}/image`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get a director's info
  public getDirectorInfo(director: string): Observable<Director> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Director>(apiUrl + `directors/${director}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Make an api call to get a genre's info
  public getGenreInfo(genre: string): Observable<Genre> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Genre>(apiUrl + `genre/${genre}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Include the token in the Authorization header
        }),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
