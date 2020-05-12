import { Injectable } from '@angular/core';
import { Country } from '../models/country.model';
import { WorkLocation } from '../models/work-location.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private _countries: Country[] = [];
  private _workLocations: WorkLocation[] = [];

  constructor() {

  }

  get countries(): Country[] {
    return [...this._countries];
  }

  get workLocations(): WorkLocation[] {
    return [...this._workLocations];
  }

  getCountries() {
    return [];
  }

  getWorkLocations() {
    return [];
  }
}
