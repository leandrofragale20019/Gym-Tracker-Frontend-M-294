import { Injectable, inject } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppAuthService {
  private oauthService = inject(OAuthService);
  private authConfig = inject(AuthConfig);

  private usernameSubject = new BehaviorSubject<string>('');
  public readonly usernameObservable: Observable<string> = this.usernameSubject.asObservable();
  private useraliasSubject = new BehaviorSubject<string>('');
  public readonly useraliasObservable: Observable<string> = this.useraliasSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  
  initAuth(): Promise<void> {
    this.oauthService.configure(this.authConfig);
    this.loadUserFromStorage();
    return this.oauthService.loadDiscoveryDocument()
      .then(() => {})
      .catch(err => console.error('[AuthService] Discovery failed:', err));
  }

  // Liest Token aus sessionStorage und initialisiert User Subjects
  loadUserFromStorage(): void {
    const token = this.getToken();
    if (!token) return;
    const decoded = this.decodeJwt(token);
    if (!decoded) return;
    if (decoded.preferred_username) {
      this.useraliasSubject.next(decoded.preferred_username);
    }
    if (decoded.given_name && decoded.family_name) {
      this.usernameSubject.next(`${decoded.given_name} ${decoded.family_name}`);
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  hasValidToken(): boolean {
    const token = sessionStorage.getItem('access_token');
    if (!token) return false;
    const expiresAt = sessionStorage.getItem('expires_at');
    if (!expiresAt) return false;
    return Date.now() < Number(expiresAt);
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.decodeJwt(token);
    const roles: string[] = decoded?.resource_access?.['gym-tracker-backend']?.roles ?? [];
    return roles.includes(role) || roles.includes(role.replace('ROLE_', ''));
  }

  getRoles(): Observable<string[]> {
    const token = this.getToken();
    if (!token) return of([]);
    const decoded = this.decodeJwt(token);
    const roles: string[] = decoded?.resource_access?.['gym-tracker-backend']?.roles ?? [];
    return new Observable(obs => { obs.next(roles); obs.complete(); });
  }

  getIdentityClaims(): Record<string, any> {
    const token = this.getToken();
    if (!token) return {};
    return this.decodeJwt(token) ?? {};
  }

  login(): void {
    this.oauthService.initLoginFlow();
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('expires_at');
    this.useraliasSubject.next('');
    this.usernameSubject.next('');
    this.oauthService.logOut();
  }

  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}
