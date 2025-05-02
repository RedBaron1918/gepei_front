import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'http://127.0.0.1:8000';

  private http: HttpClient = inject(HttpClient);
  user: WritableSignal<User | null> = signal(null);
  private router: Router = inject(Router);

  register(registerForm: Record<string, string>) {
    this.http
      .post<{
        status: string;
        message: string;
        data: { user: User; token: string };
      }>(`${this.url}/api/register`, registerForm)
      .subscribe(
        (response) => {
          const { user, token } = response.data;
          const userWithToken = { ...user, token };
          this.user.set(userWithToken);
          localStorage.setItem('user', JSON.stringify(userWithToken));
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Registration failed:', error);
        }
      );
  }

  login(loginForm: Record<string, string>) {
    this.http
      .post<{
        status: string;
        message: string;
        data: { user: User; token: string };
      }>(`${this.url}/api/login`, loginForm)
      .subscribe(
        (response) => {
          const { user, token } = response.data;
          const userWithToken = { ...user, token };
          this.user.set(userWithToken);
          localStorage.setItem('user', JSON.stringify(userWithToken));
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Login failed:', error);
        }
      );
  }

  logout() {
    const currentUser = this.user();
    const token = currentUser?.token;

    if (!token) {
      console.error('No token found for logout');
      return;
    }

    this.http
      .post(
        `${this.url}/api/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .subscribe(
        () => {
          this.user.set(null);
          localStorage.removeItem('user');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Logout failed:', error);
        }
      );
  }
}
