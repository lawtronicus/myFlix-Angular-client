// src/app/movie-card/movie-card.component.ts
import { Component } from '@angular/core';
import { ApiService, Movie, Director, User } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: Movie[] = [];
  favoriteMovies: string[] = []; //

  constructor(
    public fetchApiData: ApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getUserFavorites();
  }

  getMovies(): void {
    this.fetchApiData.getMovies().subscribe((resp: Movie[]) => {
      this.movies = resp;
      return this.movies;
    });
  }

  openMovieDetailsDialog(title: string): void {
    this.dialog.open(MovieDetailsComponent, {
      width: '400px',
      data: { title: title }, // Pass the movie title to the dialog
    });
  }

  openGenreDialog(title: string): void {
    this.dialog.open(GenreComponent, {
      width: '400px',
      data: { title: title },
    });
  }

  openDirectorDialog(director: string): void {
    if (director) {
      this.dialog.open(DirectorComponent, {
        data: { directorName: director },
      });
    } else {
      console.error('No directors available or name is missing');
    }
  }

  // Fetch user's favorite movies
  getUserFavorites(): void {
    this.fetchApiData.getUser().subscribe(
      (user: User) => {
        // Since user.favorite_movies is already an array of IDs, we don't need to map or extract anything further.
        this.favoriteMovies = user.favorite_movies;
      },
      (error) => {
        console.error('Error fetching user data:', error); // Log if there's an issue fetching the user
      }
    );
  }

  // Check if a movie is in the favorite list
  // Check if a movie is in the favorite list
  isFavorite(movie: Movie): boolean {
    if (!this.favoriteMovies || this.favoriteMovies.length === 0) {
      return false;
    }

    // Check if the current movie's ID is in the favoriteMovies array
    return this.favoriteMovies.includes(movie._id);
  }

  // Toggle favorite status for a movie
  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie)) {
      // If it's already a favorite, remove it using the movie's ID
      this.fetchApiData.deleteFavoriteMovie(movie.title).subscribe(
        (response) => {
          this.favoriteMovies = this.favoriteMovies.filter(
            (favMovieId) => favMovieId !== movie._id
          ); // Remove movie ID from local favorite list
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
      // If it's not a favorite, add it using the movie's title
      this.fetchApiData.addFavoriteMovie(movie.title).subscribe(
        (response) => {
          this.favoriteMovies.push(movie._id); // Add movie ID to local favorite list
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
