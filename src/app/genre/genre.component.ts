import { Component, Inject } from '@angular/core';
import {
  ApiService,
  Genre,
  MovieGenreResponse,
} from '../fetch-api-data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component to display information about a movie genre.
 */
@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
})
export class GenreComponent {
  /**
   * Holds the genre data after being fetched from the API.
   */
  genre: Genre | null = null;

  /**
   * Constructor for the GenreComponent.
   *
   * @param fetchApiData - The service used to make API calls.
   * @param data - Contains the movie title passed from the parent component to fetch the genre.
   */
  constructor(
    public fetchApiData: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string } // Inject the movie title passed to the dialog
  ) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   *
   * Calls the getGenreByMovieTitle method to retrieve the genre information for the movie.
   */
  ngOnInit(): void {
    this.getGenreByMovieTitle();
  }

  /**
   * Fetches the genre data for the provided movie title.
   *
   * If a title is provided, the method will call the ApiService to fetch the genre
   * associated with the movie and assigns the first genre found to the `genre` property.
   */
  getGenreByMovieTitle(): void {
    const title = this.data.title;

    if (title) {
      this.fetchApiData
        .getGenreByMovieTitle(title)
        .subscribe((resp: MovieGenreResponse) => {
          if (resp && resp.genres && resp.genres.length > 0) {
            this.genre = resp.genres[0];
          }
        });
    }
  }
}
