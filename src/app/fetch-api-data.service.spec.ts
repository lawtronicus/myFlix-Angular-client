import { TestBed } from '@angular/core/testing';

import { ApiService } from './fetch-api-data.service';

describe('FetchApiDataService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
