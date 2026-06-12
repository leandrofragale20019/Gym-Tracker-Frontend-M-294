import { Component, inject, signal, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { WorkoutPlanService } from '../../service/workout-plan.service';
import { ExerciseService } from '../../service/exercise.service';
import { MemberService } from '../../service/member.service';
import { TrainerService } from '../../service/trainer.service';
import { AppAuthService } from '../../service/app.auth.service';
import { ROLES } from '../../app.roles';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private workoutPlanService = inject(WorkoutPlanService);
  private exerciseService = inject(ExerciseService);
  private memberService = inject(MemberService);
  private trainerService = inject(TrainerService);
  private authService = inject(AppAuthService);
  private cdr = inject(ChangeDetectorRef);

  myPlanCount = 0;
  exerciseCount = 0;
  muscleGroupCount = 0;
  memberCount = 0;
  trainerCount = signal(0);
  isAdmin = false;

  get userName(): string {
    return this.authService.getIdentityClaims()?.['preferred_username'] ?? 'User';
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole(ROLES.UPDATE);

    this.workoutPlanService.getMy().subscribe({
      next: plans => { this.myPlanCount = plans.length; this.cdr.markForCheck(); },
      error: () => { this.myPlanCount = 0; this.cdr.markForCheck(); },
    });

    this.exerciseService.getAll().subscribe({
      next: exercises => {
        this.exerciseCount = exercises.length;
        this.muscleGroupCount = new Set(exercises.map(e => e.muscleGroup)).size;
        this.cdr.markForCheck();
      },
    });

    this.trainerService.getAll().subscribe({
      next: t => { this.trainerCount.set(t.length); this.cdr.markForCheck(); },
    });

    if (this.isAdmin) {
      this.memberService.getAll().subscribe({
        next: members => { this.memberCount = members.length; this.cdr.markForCheck(); },
        error: () => { this.memberCount = 0; this.cdr.markForCheck(); },
      });
    }
  }
}
