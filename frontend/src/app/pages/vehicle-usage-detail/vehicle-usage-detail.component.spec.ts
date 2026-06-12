import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleUsageDetailComponent } from './vehicle-usage-detail.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from '../../../app/app-routing.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';

describe('VehicleUsageDetailComponent', () => {
  let component: VehicleUsageDetailComponent;
  let fixture: ComponentFixture<VehicleUsageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        MatSelectModule,
        MatMomentDateModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        AppRoutingModule,
        VehicleUsageDetailComponent,
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
    fixture = TestBed.createComponent(VehicleUsageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
