import { Injectable } from '@angular/core';
import { Country } from '../models/country.model';
import { WorkLocation } from '../models/work-location.model';
import { map, tap } from 'rxjs/operators';

interface Admin {
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserAdminService {
  constructor() { }

  getAdmins() {

  }
}
