import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseService } from '../../service/exercise.service';
import { Exercise } from '../../dataaccess/exercise';
import { AppAuthService } from '../../service/app.auth.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ROLES } from '../../app.roles';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormsModule],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.scss',
})
export class ExerciseListComponent implements OnInit {
  private exerciseService = inject(ExerciseService);
  private authService = inject(AppAuthService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  exercises = signal<Exercise[]>([]);
  searchTerm = signal('');
  filterMuscleGroup = signal('');
  errorMessage = signal('');
  isAdmin = signal(false);

  muscleGroups = computed(() =>
    [...new Set(this.exercises().map(e => e.muscleGroup))].sort()
  );

  filteredExercises = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const filter = this.filterMuscleGroup();
    return this.exercises().filter(e => {
      const matchSearch = !search || e.name.toLowerCase().includes(search);
      const matchFilter = !filter || e.muscleGroup === filter;
      return matchSearch && matchFilter;
    });
  });

  ngOnInit(): void {
    this.isAdmin.set(this.authService.hasRole(ROLES.UPDATE));
    this.load();
  }

  load(): void {
    this.exerciseService.getAll().subscribe({
      next: ex => { this.exercises.set(ex); this.cdr.markForCheck(); },
      error: () => { this.errorMessage.set('Fehler beim Laden der Übungen.'); this.cdr.markForCheck(); },
    });
  }

  delete(exercise: Exercise): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'dialogs.title_delete', message: exercise.name }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.exerciseService.delete(exercise.id!).subscribe({
          next: () => this.load(),
          error: () => { this.errorMessage.set('Fehler beim Löschen.'); this.cdr.markForCheck(); },
        });
      }
    });
  }
}
