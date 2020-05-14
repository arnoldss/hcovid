import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { PeriodicElement } from './admin.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private API_URL= environment.API_URL;

   constructor(    private httpClient:HttpClient) {
  }


  registerServiceWorker(username, password, role) {
    
    if (role) { role = "500"} else { role = ""}
    return this.httpClient.post<any>(this.API_URL + '/user',{username,password, role}).pipe(
     map(
       userData => {
        return userData;
       }
     )

    );
  }
}
