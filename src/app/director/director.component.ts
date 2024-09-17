import { Component, Inject } from '@angular/core';
import { ApiService, Director } from '../fetch-api-data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component to display information about a movie director.
 */
@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss'],
})
export class DirectorComponent {
  /**
   * Holds the director's data after being fetched from the API.
   */
  director: Director | null = null;

  /**
   * Constructor for the DirectorComponent.
   *
   * @param fetchApiData - The service used to make API calls.
   * @param data - Contains the director's name passed from the parent component.
   */
  constructor(
    public fetchApiData: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { directorName: string }
  ) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   *
   * Calls the getDirector method to retrieve the director's details.
   */
  ngOnInit(): void {
    this.getDirector();
  }

  /**
   * Fetches the director's details from the API using the director's name.
   *
   * If the director's name is provided, the method will call the ApiService
   * to fetch the director's data and assign it to the `director` property.
   */
  getDirector(): void {
    const director = this.data.directorName;

    if (director) {
      this.fetchApiData.getDirector(director).subscribe((resp: Director) => {
        this.director = resp;
      });
    }
  }
}
