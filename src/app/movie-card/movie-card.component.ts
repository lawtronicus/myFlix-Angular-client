// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService, Movie } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: Movie[] = [];
  constructor(public fetchApiData: ApiService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getMovies().subscribe((resp: Movie[]) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
}
