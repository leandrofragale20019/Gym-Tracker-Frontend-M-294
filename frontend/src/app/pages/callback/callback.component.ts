import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-callback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">
      <p>Login wird verarbeitet&hellip;</p>
    </div>
  `,
})
export class CallbackComponent implements OnInit {
  ngOnInit(): void {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (token) {
      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('expires_at', String(Date.now() + Number(expiresIn) * 1000));
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }
}
