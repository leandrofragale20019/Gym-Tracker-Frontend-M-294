import { Component, inject, signal, computed, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutPlanService } from '../../service/workout-plan.service';
import { ExerciseService } from '../../service/exercise.service';
import { MemberService } from '../../service/member.service';
import { WorkoutPlan, WorkoutPlanExercise } from '../../dataaccess/workout-plan';
import { Exercise } from '../../dataaccess/exercise';
import { Member } from '../../dataaccess/member';

@Component({
  selector: 'app-workout-plan-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './workout-plan-detail.component.html',
  styleUrl: './workout-plan-detail.component.scss',
})
export class WorkoutPlanDetailComponent implements OnInit {
  private workoutPlanService = inject(WorkoutPlanService);
  private exerciseService = inject(ExerciseService);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  plan: WorkoutPlan = { title: '', memberId: 0, exercises: [] };
  availableExercises: Exercise[] = [];
  members: Member[] = [];
  isEditMode = false;
  errorMessage = '';
  errors = signal<Record<string, string>>({});
  hasErrors = computed(() => Object.keys(this.errors()).length > 0);

  ngOnInit(): void {
    this.exerciseService.getAll().subscribe({
      next: ex => { this.availableExercises = ex; this.cdr.markForCheck(); }
    });
    this.memberService.getAll().subscribe({
      next: m => { this.members = m; this.cdr.markForCheck(); }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.workoutPlanService.getById(+id).subscribe({
        next: plan => { this.plan = plan; this.cdr.markForCheck(); },
        error: () => { this.errorMessage = 'Trainingsplan nicht gefunden.'; this.cdr.markForCheck(); },
      });
    }
  }

  validate(): boolean {
    const e: Record<string, string> = {};
    const trim = (v: string) => v?.trim() ?? '';

    if (trim(this.plan.title).length < 2) e['title'] = 'Titel: min. 2 Zeichen erforderlich';
    else if (trim(this.plan.title).length > 100) e['title'] = 'Titel: max. 100 Zeichen';

    if (this.plan.exercises.length === 0) e['exercises'] = 'Mindestens 1 Übung muss hinzugefügt sein';

    this.errors.set(e);
    this.cdr.markForCheck();
    return Object.keys(e).length === 0;
  }

  addExercise(): void {
    this.plan.exercises = [...this.plan.exercises, { exerciseId: 0, sets: 3, repetitions: 10 }];
    this.cdr.markForCheck();
  }

  removeExercise(index: number): void {
    this.plan.exercises = this.plan.exercises.filter((_, i) => i !== index);
    this.cdr.markForCheck();
  }

  updateExerciseField(index: number, field: keyof WorkoutPlanExercise, value: any): void {
    const updated = [...this.plan.exercises];
    updated[index] = { ...updated[index], [field]: field === 'exerciseId' || field === 'sets' || field === 'repetitions' ? +value : value };
    this.plan.exercises = updated;
  }

  save(): void {
    if (!this.validate()) return;
    if (this.isEditMode && this.plan.id) {
      this.workoutPlanService.update(this.plan.id, this.plan).subscribe({
        next: () => this.router.navigate(['/workout-plans']),
        error: () => { this.errorMessage = 'Fehler beim Speichern.'; this.cdr.markForCheck(); },
      });
    } else {
      this.workoutPlanService.create(this.plan).subscribe({
        next: () => this.router.navigate(['/workout-plans']),
        error: () => { this.errorMessage = 'Fehler beim Erstellen.'; this.cdr.markForCheck(); },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/workout-plans']);
  }
}
