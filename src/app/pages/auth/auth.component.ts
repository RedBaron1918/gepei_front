import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  WritableSignal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './auth.component.css',
  template: `
    <div class="auth-container">
      <div class="form-container">
        <h2>Register</h2>
        <form (ngSubmit)="authService.register(registerForm)">
          <label>
            Name:
            <input type="text" [(ngModel)]="registerForm.name" name="name" />
          </label>
          <label>
            Email:
            <input type="email" [(ngModel)]="registerForm.email" name="email" />
          </label>
          <label>
            Password:
            <input
              type="password"
              [(ngModel)]="registerForm.password"
              name="password"
            />
          </label>
          <button type="submit">Register</button>
        </form>
      </div>

      <div class="form-container">
        <h2>Login</h2>
        <form (ngSubmit)="authService.login(loginForm)">
          <label>
            Email:
            <input type="email" [(ngModel)]="loginForm.email" name="email" />
          </label>
          <label>
            Password:
            <input
              type="password"
              [(ngModel)]="loginForm.password"
              name="password"
            />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  `,
})
export class AuthComponent {
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  registerForm = { name: '', email: '', password: '' };
  loginForm = { email: '', password: '' };

  // ngOnInit() {
  //   if (storedUser) {
  //     this.user.set(JSON.parse(storedUser));
  //   }
  // }
}
