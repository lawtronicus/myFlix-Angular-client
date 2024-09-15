import { Component, Inject } from '@angular/core';
import { ApiService, Director } from '../fetch-api-data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss'],
})
export class DirectorComponent {
  director: Director | null = null;

  constructor(
    public fetchApiData: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { directorName: string }
  ) {}

  ngOnInit(): void {
    this.getDirector();
  }

  getDirector(): void {
    const director = this.data.directorName;
    console.log('Director from route:', director);

    if (director) {
      this.fetchApiData.getDirector(director).subscribe((resp: Director) => {
        this.director = resp;
        console.log(this.director);
      });
    }
  }
}
