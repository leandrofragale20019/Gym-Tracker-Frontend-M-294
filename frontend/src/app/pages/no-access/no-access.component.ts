import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppLoginComponent } from '../../components/app-login/app-login.component';

@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLoginComponent]
})
export class NoAccessComponent {
  oauthService = inject(OAuthService);
}
