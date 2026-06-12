import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WorkoutPlanService } from '../../service/workout-plan.service';
import { WorkoutPlan } from '../../dataaccess/workout-plan';
import { AppAuthService } from '../../service/app.auth.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ROLES } from '../../app.roles';

@Component({
  selector: 'app-workout-plan-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './workout-plan-list.component.html',
  styleUrl: './workout-plan-list.component.scss',
})
export class WorkoutPlanListComponent implements OnInit {
  private workoutPlanService = inject(WorkoutPlanService);
  private authService = inject(AppAuthService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  plans = signal<WorkoutPlan[]>([]);
  errorMessage = signal('');
  selectedPlanId = signal<number | null>(null);
  isAdmin = signal(false);

  selectedPlan = computed(() =>
    this.plans().find(p => p.id === this.selectedPlanId())
  );

  ngOnInit(): void {
    this.isAdmin.set(this.authService.hasRole(ROLES.UPDATE));
    this.load();
  }

  load(): void {
    const req$ = this.isAdmin()
      ? this.workoutPlanService.getAll()
      : this.workoutPlanService.getMy();

    req$.subscribe({
      next: plans => { this.plans.set(plans); this.cdr.markForCheck(); },
      error: () => { this.errorMessage.set('Fehler beim Laden der Trainingspläne.'); this.cdr.markForCheck(); },
    });
  }

  select(id: number): void {
    this.selectedPlanId.update(cur => cur === id ? null : id);
  }

  delete(plan: WorkoutPlan): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'dialogs.title_delete', message: plan.title }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.workoutPlanService.delete(plan.id!).subscribe({
          next: () => {
            if (this.selectedPlanId() === plan.id) this.selectedPlanId.set(null);
            this.load();
          },
          error: () => { this.errorMessage.set('Fehler beim Löschen.'); this.cdr.markForCheck(); },
        });
      }
    });
  }
}
