import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  BASE_URL = 'http://localhost:3000/api/user/';
  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(this.BASE_URL + '/signup', authData).subscribe(response => {
      console.log(response);
    });
  }
}
