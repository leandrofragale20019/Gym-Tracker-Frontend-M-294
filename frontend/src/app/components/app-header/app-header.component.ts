import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppAuthService } from '../../service/app.auth.service';
import { ROLES } from '../../app.roles';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive]
})
export class AppHeaderComponent {
  private authService = inject(AppAuthService);

  username = signal('');
  isAdmin = signal(false);
  isLoggedIn = signal(false);

  constructor() {
    this.authService.useraliasObservable.subscribe(alias => {
      this.username.set(alias);
      this.isLoggedIn.set(this.authService.hasValidToken());
      this.isAdmin.set(this.authService.hasRole(ROLES.UPDATE));
    });
  }

  get roleLabel(): string {
    return this.isAdmin() ? 'ADMIN' : 'USER';
  }

  logout(): void {
    this.authService.logout();
  }
}
