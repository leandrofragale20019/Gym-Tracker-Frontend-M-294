import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentDetailComponent } from './department-detail.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { provideTranslateService } from '@ngx-translate/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { EmployeeDetailComponent } from '../employee-detail/employee-detail.component';
import { AppRoutingModule } from '../../../app/app-routing.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DepartmentDetailComponent', () => {
  let component: DepartmentDetailComponent;
  let fixture: ComponentFixture<DepartmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DepartmentDetailComponent,
        MatSnackBarModule,
        MatSelectModule,
        AppRoutingModule,
        EmployeeDetailComponent,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideTranslateService({
          fallbackLang: 'en',
          lang: 'en'
        }),
      ],
      teardown: { destroyAfterEach: true },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
