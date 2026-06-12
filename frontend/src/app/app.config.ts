import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserModule } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthConfig, OAuthStorage, provideOAuthClient } from 'angular-oauth2-oidc';
import { HttpXSRFInterceptor } from './interceptor/http.csrf.interceptor';
import { HttpBearerInterceptor } from './interceptor/http.bearer.interceptor';
import { AppAuthService } from './service/app.auth.service';
import { environment } from '../environments/environment';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorI18nService } from './service/mat.intl.service';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/ILV',
  requireHttps: false,
  redirectUri: 'http://localhost:4200/callback',
  postLogoutRedirectUri: environment.frontendBaseUrl,
  clientId: 'gym-tracker-frontend',
  scope: 'openid profile',
  responseType: 'token',
  showDebugInformation: true,
};

export function storageFactory(): OAuthStorage {
  return sessionStorage;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    importProvidersFrom(
      BrowserModule,
      MatMomentDateModule,
    ),
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorI18nService,
    },
    { provide: AuthConfig, useValue: authConfig },
    { provide: OAuthStorage, useFactory: storageFactory },
    { provide: HTTP_INTERCEPTORS, useClass: HttpBearerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpXSRFInterceptor, multi: true },
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'de_CH',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      }),
    }),
    provideHttpClient(
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AppAuthService) => () => authService.initAuth(),
      deps: [AppAuthService],
      multi: true,
    },
    provideRouter(routes, withComponentInputBinding(), withViewTransitions())
  ]
};
