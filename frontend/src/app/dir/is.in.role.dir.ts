import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppAuthService } from '../service/app.auth.service';

@Directive({
  selector: '[appIsInRole]',
  standalone: true
})
export class IsInRoleDirective implements OnInit, OnDestroy {
  @Input() appIsInRole = '';

  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private authService = inject(AppAuthService);
  private stop$ = new Subject<void>();
  private isVisible = false;

  ngOnInit() {
    this.authService.getRoles().pipe(takeUntil(this.stop$)).subscribe(roles => {
      const hasRole = roles.includes(this.appIsInRole);
      if (hasRole && !this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else if (!hasRole) {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    });
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.complete();
  }
}
