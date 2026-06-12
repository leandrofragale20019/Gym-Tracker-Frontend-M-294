import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AppAuthService } from '../../service/app.auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class AppLoginComponent {
  private authService = inject(AppAuthService);

  login(): void {
    this.authService.login();
  }
}
