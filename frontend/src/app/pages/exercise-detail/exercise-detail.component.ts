import { Component, inject, signal, computed, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../service/exercise.service';
import { Exercise } from '../../dataaccess/exercise';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './exercise-detail.component.html',
  styleUrl: './exercise-detail.component.scss',
})
export class ExerciseDetailComponent implements OnInit {
  private exerciseService = inject(ExerciseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  exercise: Exercise = { name: '', description: '', muscleGroup: '' };
  isEditMode = false;
  errorMessage = '';
  errors = signal<Record<string, string>>({});
  hasErrors = computed(() => Object.keys(this.errors()).length > 0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.exerciseService.getById(+id).subscribe({
        next: ex => { this.exercise = ex; this.cdr.markForCheck(); },
        error: () => { this.errorMessage = 'Übung nicht gefunden.'; this.cdr.markForCheck(); },
      });
    }
  }

  validate(): boolean {
    const e: Record<string, string> = {};
    const trim = (v: string) => v?.trim() ?? '';

    if (trim(this.exercise.name).length < 2) e['name'] = 'Name: min. 2 Zeichen erforderlich';
    else if (trim(this.exercise.name).length > 100) e['name'] = 'Name: max. 100 Zeichen';

    if (trim(this.exercise.muscleGroup).length < 2) e['muscleGroup'] = 'Muskelgruppe: min. 2 Zeichen erforderlich';
    else if (trim(this.exercise.muscleGroup).length > 50) e['muscleGroup'] = 'Muskelgruppe: max. 50 Zeichen';

    if (this.exercise.description && this.exercise.description.length > 500)
      e['description'] = 'Beschreibung: max. 500 Zeichen';

    this.errors.set(e);
    this.cdr.markForCheck();
    return Object.keys(e).length === 0;
  }

  save(): void {
    if (!this.validate()) return;
    if (this.isEditMode && this.exercise.id) {
      this.exerciseService.update(this.exercise.id, this.exercise).subscribe({
        next: () => this.router.navigate(['/exercises']),
        error: () => { this.errorMessage = 'Fehler beim Speichern.'; this.cdr.markForCheck(); },
      });
    } else {
      this.exerciseService.create(this.exercise).subscribe({
        next: () => this.router.navigate(['/exercises']),
        error: () => { this.errorMessage = 'Fehler beim Erstellen.'; this.cdr.markForCheck(); },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/exercises']);
  }
}
