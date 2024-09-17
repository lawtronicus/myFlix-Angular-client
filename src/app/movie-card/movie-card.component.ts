// src/app/movie-card/movie-card.component.ts
import { Component } from '@angular/core';
import { ApiService, Movie, Director, User } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component to display a list of movies in a card format.
 * Allows users to view movie details, genres, directors, and manage their favorite movies.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  /**
   * Array to store the list of movies fetched from the API.
   */
  movies: Movie[] = [];

  /**
   * Array to store the list of the user's favorite movie IDs.
   */
  favoriteMovies: string[] = [];

  /**
   * Constructor for the MovieCardComponent.
   *
   * @param fetchApiData - The service used to make API calls.
   * @param dialog - The Angular Material dialog for displaying modals.
   * @param snackBar - The Angular Material snack bar for displaying notifications.
   */
  constructor(
    public fetchApiData: ApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   *
   * Fetches the list of movies and the user's favorite movies.
   */
  ngOnInit(): void {
    this.getMovies();
    this.getUserFavorites();
  }

  /**
   * Fetches the list of movies from the API and assigns them to the `movies` property.
   */
  getMovies(): void {
    this.fetchApiData.getMovies().subscribe((resp: Movie[]) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * Opens a modal dialog to display movie details.
   *
   * @param title - The title of the movie whose details are to be displayed.
   */
  openMovieDetailsDialog(title: string): void {
    this.dialog.open(MovieDetailsComponent, {
      width: '400px',
      data: { title: title }, // Pass the movie title to the dialog
    });
  }

  /**
   * Opens a modal dialog to display the genre of a movie.
   *
   * @param title - The title of the movie whose genre is to be displayed.
   */
  openGenreDialog(title: string): void {
    this.dialog.open(GenreComponent, {
      width: '400px',
      data: { title: title },
    });
  }

  /**
   * Opens a modal dialog to display the director of a movie.
   *
   * @param director - The name of the director whose details are to be displayed.
   */
  openDirectorDialog(director: string): void {
    if (director) {
      this.dialog.open(DirectorComponent, {
        data: { directorName: director },
      });
    } else {
      console.error('No directors available or name is missing');
    }
  }

  /**
   * Fetches the user's favorite movies from the API and assigns them to the `favoriteMovies` array.
   */
  getUserFavorites(): void {
    this.fetchApiData.getUser().subscribe(
      (user: User) => {
        this.favoriteMovies = user.favorite_movies;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  /**
   * Checks if a specific movie is part of the user's favorite movies.
   *
   * @param movie - The movie object to check.
   * @returns `true` if the movie is a favorite, `false` otherwise.
   */
  isFavorite(movie: Movie): boolean {
    if (!this.favoriteMovies || this.favoriteMovies.length === 0) {
      return false;
    }
    return this.favoriteMovies.includes(movie._id);
  }

  /**
   * Toggles the favorite status of a movie.
   *
   * If the movie is already a favorite, it will be removed from the user's favorites.
   * If the movie is not a favorite, it will be added to the user's favorites.
   *
   * @param movie - The movie object whose favorite status is to be toggled.
   */
  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie)) {
      this.fetchApiData.deleteFavoriteMovie(movie.title).subscribe(
        (response) => {
          this.favoriteMovies = this.favoriteMovies.filter(
            (favMovieId) => favMovieId !== movie._id
          );
          this.snackBar.open('Removed from favorites', 'OK', {
            duration: 2000,
          });
        },
        (error) => {
          this.snackBar.open('Something went wrong. Please try again.', 'OK', {
            duration: 2000,
          });
        }
      );
    } else {
      this.fetchApiData.addFavoriteMovie(movie.title).subscribe(
        (response) => {
          this.favoriteMovies.push(movie._id);
          this.snackBar.open('Added to favorites', 'OK', {
            duration: 2000,
          });
        },
        (error) => {
          this.snackBar.open('Something went wrong. Please try again.', 'OK', {
            duration: 2000,
          });
        }
      );
    }
  }
}
