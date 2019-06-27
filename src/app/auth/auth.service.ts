import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Route, Router } from '@angular/router';
import { listenerCount } from 'cluster';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuth = false;
  private authStatusListener = new Subject<boolean>();
  BASE_URL = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    console.log(authData);
    this.http.post(this.BASE_URL + '/signup', authData).subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    console.log(authData);
    this.http
      .post<{ token: string }>(this.BASE_URL + '/login', authData)
      .subscribe(response => {
        console.log(response.token);
        this.token = response.token;
        if (this.token) {
          this.isAuth = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getToken(): string {
    console.log(this.token);
    return this.token;
  }

  getIsAuth() {
    return this.isAuth;
  }
}
