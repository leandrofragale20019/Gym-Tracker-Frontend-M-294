import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { AppHeaderComponent } from './app-header.component';
import { AppAuthService } from '../../service/app.auth.service';

const makeAuthMock = () => ({
  useraliasObservable: new Subject<string>(),
  hasValidToken: vi.fn(() => false),
  hasRole: vi.fn(() => false),
  logout: vi.fn(),
  getIdentityClaims: vi.fn(() => ({})),
});

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
      providers: [
        { provide: AppAuthService, useValue: makeAuthMock() },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isLoggedIn ist false wenn kein Token vorhanden', () => {
    expect(component.isLoggedIn()).toBe(false);
  });

  it('logout() ruft authService.logout() auf', () => {
    const authSpy = TestBed.inject(AppAuthService) as any;
    component.logout();
    expect(authSpy.logout).toHaveBeenCalledOnce();
  });
});
