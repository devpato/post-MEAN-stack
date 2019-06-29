import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { repeat } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuth = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private userId: string;
  BASE_URL = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string): void {
    const authData: AuthData = { email: email, password: password };
    this.http.post(this.BASE_URL + '/signup', authData).subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string): void {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        this.BASE_URL + '/login',
        authData
      )
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuth = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(this.getToken(), expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  logout(): void {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  authoAuthUser(): any {
    const authInformation = this.getAuthData();
    const now = new Date();
    if (!authInformation) {
      return;
    }
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuth = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getToken(): string {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuth;
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string
  ): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getUserId(): string {
    return this.userId;
  }
}
