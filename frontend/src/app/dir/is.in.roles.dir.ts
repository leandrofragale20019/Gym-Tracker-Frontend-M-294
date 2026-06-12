import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppAuthService } from '../service/app.auth.service';

@Directive({
  selector: '[appIsInRoles]',
  standalone: true
})
export class IsInRolesDirective implements OnInit, OnDestroy {
  @Input() appIsInRoles?: string[];

  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private authService = inject(AppAuthService);
  private stop$ = new Subject<void>();
  private isVisible = false;

  ngOnInit() {
    this.authService.getRoles().pipe(takeUntil(this.stop$)).subscribe(roles => {
      const hasAll = (this.appIsInRoles ?? []).every(r => roles.includes(r));
      if (hasAll && !this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else if (!hasAll) {
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
