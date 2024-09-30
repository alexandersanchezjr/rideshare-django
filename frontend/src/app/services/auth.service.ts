import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'environment'
import { User, UserGroup, UserResponse } from '@models/user';

type Token = {
  access: string;
  refresh: string;
};

type LoginData = {
  username: string;
  password: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl: string = `http://${environment.hostname}`;
  private readonly loginUrl:string = `${this.apiUrl}${environment.login}`;
  private readonly signupUrl: string = `${this.apiUrl}${environment.signup}`;

  constructor(private http: HttpClient) { }

  login (data: LoginData): Observable<Token> {
    return this.http.post<Token>(this.loginUrl, data).pipe(
      tap(token => localStorage.setItem('rideshare.auth', JSON.stringify(token)))
    );
  }

  logout(): void {
    localStorage.removeItem('rideshare.auth');
  }

  refreshToken(): Observable<Token> {
    const refreshToken = localStorage.getItem('rideshare.auth') ? JSON.parse(localStorage.getItem('rideshare.auth')!).refresh : '';
    return this.http.post<Token>(`${this.apiUrl}/auth/token/refresh/`, { refresh: refreshToken }).pipe(
      tap(token => localStorage.setItem('rideshare.auth', JSON.stringify(token)))
    );
  }

  get accessToken(): string {
    const token = localStorage.getItem('rideshare.auth');
    return token ? JSON.parse(token).access : '';
  }

  signup (data: User): Observable<User> {
    const formData = new FormData();
    formData.append('username', data.username!);
    formData.append('password1', data.password!);
    formData.append('password2', data.password!);
    formData.append('firstname', data.firstname!);
    formData.append('lastname', data.lastname!);
    formData.append('photo', data.photo!);
    formData.append('group', data.isDriver ? UserGroup.DRIVER : UserGroup.RIDER);

    return this.http.post<User>(this.signupUrl, formData);
  }

  get user(): User | undefined {
    const accessToken = this.accessToken;
    return accessToken ? this.getUserFromAccessToken(accessToken) : undefined;
  }

  private getUserFromAccessToken(accessToken: string): User {
    const payload: string = accessToken.split('.')[1];
    const userResponse: UserResponse = JSON.parse(atob(payload));
    const user = new User(userResponse);
    return user;
  }
}
