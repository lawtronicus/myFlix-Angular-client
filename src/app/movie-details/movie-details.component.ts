import { Component, OnInit, Inject } from '@angular/core';
import { ApiService, Movie } from '../fetch-api-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;

  constructor(
    public dialogRef: MatDialogRef<MovieDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }, // Receive the title from the component that opens the dialog
    private fetchApiData: ApiService
  ) {}

  ngOnInit(): void {
    this.getMovieByTitle(this.data.title); // Fetch movie using the passed title
  }

  getMovieByTitle(title: string): void {
    if (title) {
      this.fetchApiData.getMovieByTitle(title).subscribe((resp: Movie) => {
        this.movie = resp;
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog
  }
}
