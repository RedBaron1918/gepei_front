import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MaterialButtonComponent } from '../material-button/material-button.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { AuthService } from '../../services/auth.service';
interface User {
  id: number;
  name: string;
  email: string;
  token: string;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MaterialButtonComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  isMenuOpen = signal(false);
  isMobile = signal(false);
  private dialog = inject(MatDialog);
  authService: AuthService = inject(AuthService);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.authService.user.set(JSON.parse(storedUser));
      }

      this.isMobile.set(window.innerWidth <= 768);

      window.addEventListener('resize', () => {
        this.isMobile.set(window.innerWidth <= 768);
        if (!this.isMobile()) {
          this.isMenuOpen.set(false);
        }
      });
    }
  }

  toggleMenu() {
    this.isMenuOpen.update((value) => !value);
  }

  handleClick(event: MouseEvent) {}

  openDialog() {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', () => {
        this.isMobile.set(window.innerWidth <= 768);
        if (!this.isMobile()) {
          this.isMenuOpen.set(false);
        }
      });
    }
  }
}
