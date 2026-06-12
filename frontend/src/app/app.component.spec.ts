import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {AuthConfig, OAuthModule} from 'angular-oauth2-oidc';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {provideTranslateService} from '@ngx-translate/core';
import { authConfig } from './app.config';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
        AppRoutingModule,
        MatMomentDateModule,
        AppComponent],
    providers: [
        { provide: AuthConfig, useValue: authConfig },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideTranslateService({
      fallbackLang: 'en',
      lang: 'en'
    }),
    ],
    teardown: {destroyAfterEach: true}
}).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
