import { Component, Inject } from '@angular/core';
import {
  ApiService,
  Genre,
  MovieGenreResponse,
} from '../fetch-api-data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
})
export class GenreComponent {
  genre: Genre | null = null;

  constructor(
    public fetchApiData: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string } // Inject the movie title passed to the dialog
  ) {}

  ngOnInit(): void {
    this.getGenreByMovieTitle();
  }

  getGenreByMovieTitle(): void {
    const title = this.data.title;
    console.log('Title from route:', title);

    if (title) {
      this.fetchApiData
        .getGenreByMovieTitle(title)
        .subscribe((resp: MovieGenreResponse) => {
          if (resp && resp.genres && resp.genres.length > 0) {
            this.genre = resp.genres[0];
          }
          console.log('Genre:', this.genre);
        });
    }
  }
}
