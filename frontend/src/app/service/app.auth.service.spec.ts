import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AppAuthService } from './app.auth.service';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

const makeJwt = (payload: object): string => {
  const enc = (obj: object) => {
    const json = JSON.stringify(obj);
    return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  return `${enc({ alg: 'RS256' })}.${enc(payload)}.fakesig`;
};

const makeOAuthMock = () => ({
  configure: vi.fn(),
  loadDiscoveryDocument: vi.fn().mockResolvedValue(true),
  initLoginFlow: vi.fn(),
  logOut: vi.fn(),
  events: new Subject(),
});

describe('AppAuthService', () => {
  let service: AppAuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AppAuthService,
        { provide: OAuthService, useValue: makeOAuthMock() },
        { provide: AuthConfig, useValue: { issuer: 'http://localhost:8080/realms/ILV' } },
      ]
    });
    service = TestBed.inject(AppAuthService);
  });

  afterEach(() => sessionStorage.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('hasValidToken() gibt false zurück wenn kein Token vorhanden', () => {
    expect(service.hasValidToken()).toBe(false);
  });

  it('hasValidToken() gibt false zurück wenn Token abgelaufen', () => {
    sessionStorage.setItem('access_token', 'dummy');
    sessionStorage.setItem('expires_at', String(Date.now() - 1000));
    expect(service.hasValidToken()).toBe(false);
  });

  it('hasValidToken() gibt true zurück wenn Token gültig', () => {
    sessionStorage.setItem('access_token', 'dummy');
    sessionStorage.setItem('expires_at', String(Date.now() + 60_000));
    expect(service.hasValidToken()).toBe(true);
  });

  it('hasRole() gibt false zurück wenn kein Token vorhanden', () => {
    expect(service.hasRole('ROLE_READ')).toBe(false);
  });

  it('getRoles() gibt leeres Array zurück ohne Token', async () => {
    const roles = await firstValueFrom(service.getRoles());
    expect(roles).toEqual([]);
  });

  it('hasRole() liest resource_access[gym-tracker-backend].roles', () => {
    const token = makeJwt({
      sub: '42',
      preferred_username: 'leandro',
      resource_access: { 'gym-tracker-backend': { roles: ['ROLE_READ', 'ROLE_UPDATE'] } },
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    sessionStorage.setItem('access_token', token);
    sessionStorage.setItem('expires_at', String(Date.now() + 3_600_000));

    expect(service.hasRole('ROLE_READ')).toBe(true);
    expect(service.hasRole('ROLE_UPDATE')).toBe(true);
    expect(service.hasRole('ROLE_NONEXISTENT')).toBe(false);
  });

  it('getRoles() gibt resource_access Rollen zurück', async () => {
    const token = makeJwt({
      sub: '42',
      preferred_username: 'leandro',
      resource_access: { 'gym-tracker-backend': { roles: ['ROLE_READ'] } },
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    sessionStorage.setItem('access_token', token);

    const roles = await firstValueFrom(service.getRoles());
    expect(roles).toContain('ROLE_READ');
    expect(roles).not.toContain('ROLE_UPDATE');
  });

  it('logout() entfernt Token aus sessionStorage', () => {
    sessionStorage.setItem('access_token', 'dummy');
    sessionStorage.setItem('expires_at', '9999999');
    const oauthMock = TestBed.inject(OAuthService) as any;
    service.logout();
    expect(sessionStorage.getItem('access_token')).toBeNull();
    expect(oauthMock.logOut).toHaveBeenCalledOnce();
  });

  it('login() ruft oauthService.initLoginFlow() auf', () => {
    const oauthMock = TestBed.inject(OAuthService) as any;
    service.login();
    expect(oauthMock.initLoginFlow).toHaveBeenCalledOnce();
  });
});
