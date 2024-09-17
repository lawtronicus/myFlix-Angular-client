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

// Interfaces

/**
 * Interface representing the details of a user for registration.
 */
export interface UserDetails {
  username: string;
  password: string;
  email: string;
  dob: string;
  favorite_movies: string[];
}

/**
 * Interface representing the response after user registration.
 */
interface UserRegistrationResponse {
  username: string;
  password: string;
  email: string;
  dob: string; // ISO 8601 date string
  favorite_movies: string[]; // Array of movie IDs or objects, depending on your API design
  _id: string; // MongoDB document ID
  __v: number; // Version key set by Mongoose
}

/**
 * Interface representing the response after deleting a user.
 */
interface DeleteUserResponse {
  message: string;
  // Add any other fields your API might return
}

/**
 * Interface representing a user fetched from the API.
 */
export interface User {
  _id: string; // MongoDB ID
  username: string; // Username of the user
  password: string; // Hashed password
  email: string; // User's email address
  dob: Date; // Date of birth as an ISO 8601 string
  favorite_movies: string[]; // Array of favorite movie IDs
  __v: number; // Version key set by Mongoose
}

/**
 * Interface representing a movie fetched from the API.
 */
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

/**
 * Interface representing a genre associated with a movie.
 */
export interface Genre {
  _id: string;
  name: string;
  description: string;
}

/**
 * Interface representing a director associated with a movie.
 */
export interface Director {
  _id: string;
  name: string;
  bio: string;
  dob: string; // Date of birth
  dod?: string | null; // Date of death, optional (nullable)
}

/**
 * Interface representing the data required for user login.
 */
interface UserLoginData {
  email: string;
  password: string; // Hashed password
}

/**
 * Interface representing the main actor in a movie.
 */
interface MainActor {
  _id: string;
  name: string;
  dob: string; // Date of birth
  bio: string;
}

/**
 * Interface representing the response after user login.
 */
interface UserLoginResponse {
  user: User;
  token: string; // JWT token returned by the API
}

/**
 * Interface representing the data needed to edit user information.
 */
export interface EditUserData {
  username: string;
  password: string;
  email: string;
  dob: string; // ISO 8601 formatted date string
}

/**
 * Interface representing the response when fetching a movie's genres.
 */
export interface MovieGenreResponse {
  title: string;
  genres: Genre[];
}

/**
 * Interface representing the response when fetching a movie's writers.
 */
interface MovieWritersResponse {
  title: string;
  writers: string[]; // Array of writer names as strings
}

/**
 * Interface representing the response when fetching a movie's main actor.
 */
interface MovieMainActorResponse {
  title: string;
  main_actor: MainActor;
}

/**
 * Interface representing the response when fetching a movie's description.
 */
interface MovieDescriptionResponse {
  title: string;
  description: string;
}

/**
 * Interface representing the response when fetching a movie's image URL.
 */
interface MovieImageUrlResponse {
  title: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * Constructor to inject the HttpClient service.
   *
   * @param http - The HttpClient service used to make HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user by making an API call to the user registration endpoint.
   *
   * @param userDetails - The details of the user to register (username, password, email, etc.).
   * @returns Observable<UserRegistrationResponse> - An observable containing the response from the server.
   */
  public userRegistration(
    userDetails: UserDetails
  ): Observable<UserRegistrationResponse> {
    return this.http
      .post<UserRegistrationResponse>(apiUrl + 'users', userDetails)
      .pipe(
        catchError(this.handleError) // Handle errors
      );
  }

  /**
   * Deletes the currently logged-in user by making an API call.
   *
   * @returns Observable<DeleteUserResponse> - An observable containing the response from the server.
   */
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

  /**
   * Fetches the currently logged-in user's details by making an API call.
   *
   * @returns Observable<User> - An observable containing the user's details.
   */
  public getUser(): Observable<User> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Retrieve the username from local storage

    if (storedUser) {
      const user = JSON.parse(storedUser); // Parse the string back into an object
      const userId = user._id; // Access the _id property

      // Make the HTTP request inside the `if` block using the `userId`
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

  /**
   * Logs in a user by making an API call to the user login endpoint.
   *
   * @param userData - The login credentials (email and password) of the user.
   * @returns Observable<UserLoginResponse> - An observable containing the login response, which includes the user data and a JWT token.
   */
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

  /**
   * Edits the current user's profile by making an API call to update the user information.
   *
   * @param userId - The ID of the user to be updated.
   * @param userData - The updated user data (username, email, dob, password).
   * @returns Observable<User> - An observable containing the updated user data.
   */
  public editUser(userId: string, userData: EditUserData): Observable<User> {
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

  /**
   * Adds a movie to the user's list of favorite movies.
   *
   * @param movieTitle - The title of the movie to add to favorites.
   * @returns Observable<User> - An observable containing the updated user data with the added favorite movie.
   */
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

  /**
   * Removes a movie from the user's list of favorite movies.
   *
   * @param movieTitle - The title of the movie to remove from favorites.
   * @returns Observable<User> - An observable containing the updated user data after the movie is removed from favorites.
   */
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

  /**
   * Fetches all movies from the API.
   *
   * @returns Observable<Movie[]> - An observable containing a list of movies.
   */
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

  /**
   * Fetches a specific movie by its title.
   *
   * @param title - The title of the movie to fetch.
   * @returns Observable<Movie> - An observable containing the movie details.
   */
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

  /**
   * Fetches the director's information for a specific movie.
   *
   * @param director - The name of the director to fetch.
   * @returns Observable<Director> - An observable containing the director's details.
   */
  public getDirector(director: string): Observable<Director> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Director>(`${apiUrl}directors/${director}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches the genre of a specific movie by its title.
   *
   * @param title - The title of the movie.
   * @returns Observable<MovieGenreResponse> - An observable containing the movie's genre.
   */
  public getGenreByMovieTitle(title: string): Observable<MovieGenreResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .get<MovieGenreResponse>(`${apiUrl}movies/${title}/genre`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches the list of writers for a specific movie.
   *
   * @param movie - The title of the movie.
   * @returns Observable<MovieWritersResponse> - An observable containing the movie's writers.
   */
  public getWriters(movie: string): Observable<MovieWritersResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .get<MovieWritersResponse>(`${apiUrl}movies/${movie}/writers`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches the main actor of a specific movie.
   *
   * @param movie - The title of the movie.
   * @returns Observable<MovieMainActorResponse> - An observable containing the main actor of the movie.
   */
  public getMainActor(movie: string): Observable<MovieMainActorResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .get<MovieMainActorResponse>(`${apiUrl}movies/${movie}/main-actors`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches the description of a specific movie.
   *
   * @param movie - The title of the movie.
   * @returns Observable<MovieDescriptionResponse> - An observable containing the movie's description.
   */
  public getDescription(movie: string): Observable<MovieDescriptionResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .get<MovieDescriptionResponse>(`${apiUrl}movies/${movie}/description`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches the image URL of a specific movie.
   *
   * @param movie - The title of the movie.
   * @returns Observable<MovieImageUrlResponse> - An observable containing the movie's image URL.
   */
  public getImage(movie: string): Observable<MovieImageUrlResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .get<MovieImageUrlResponse>(`${apiUrl}movies/${movie}/image`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches the information about a specific director.
   *
   * @param director - The name of the director.
   * @returns Observable<Director> - An observable containing the director's information.
   */
  public getDirectorInfo(director: string): Observable<Director> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Director>(`${apiUrl}directors/${director}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches the information about a specific genre.
   *
   * @param genre - The name of the genre.
   * @returns Observable<Genre> - An observable containing the genre's information.
   */
  public getGenreInfo(genre: string): Observable<Genre> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Genre>(`${apiUrl}genre/${genre}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles any errors that occur during HTTP requests.
   *
   * @param error - The HTTP error response.
   * @returns Observable<never> - An observable that throws an error message.
   */
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
