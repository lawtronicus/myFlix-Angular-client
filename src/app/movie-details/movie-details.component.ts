import { Component, OnInit, Inject } from '@angular/core';
import { ApiService, Movie } from '../fetch-api-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Component to display detailed information about a movie.
 * This component is opened in a modal dialog and fetches movie details using the movie title passed to it.
 */
@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  /**
   * The movie object that holds the details of the fetched movie.
   */
  movie: Movie | null = null;

  /**
   * Constructor for the MovieDetailsComponent.
   *
   * @param dialogRef - Reference to the dialog opened by the component.
   * @param data - Injected data containing the title of the movie to fetch.
   * @param fetchApiData - The service used to make API calls to fetch movie details.
   */
  constructor(
    public dialogRef: MatDialogRef<MovieDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }, // Receive the title from the component that opens the dialog
    private fetchApiData: ApiService
  ) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   *
   * Fetches the movie details by its title when the component is initialized.
   */
  ngOnInit(): void {
    this.getMovieByTitle(this.data.title); // Fetch movie using the passed title
  }

  /**
   * Fetches the movie details from the API using the provided movie title.
   *
   * @param title - The title of the movie to fetch details for.
   */
  getMovieByTitle(title: string): void {
    if (title) {
      this.fetchApiData.getMovieByTitle(title).subscribe((resp: Movie) => {
        this.movie = resp;
      });
    }
  }

  /**
   * Closes the dialog containing the movie details.
   */
  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog
  }
}
