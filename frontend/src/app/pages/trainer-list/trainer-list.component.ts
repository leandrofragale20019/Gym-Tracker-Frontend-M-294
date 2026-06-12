import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TrainerService } from '../../service/trainer.service';
import { Trainer } from '../../dataaccess/trainer';
import { AppAuthService } from '../../service/app.auth.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ROLES } from '../../app.roles';

@Component({
  selector: 'app-trainer-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './trainer-list.component.html',
  styleUrl: './trainer-list.component.scss',
})
export class TrainerListComponent implements OnInit {
  private trainerService = inject(TrainerService);
  private authService = inject(AppAuthService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  trainers = signal<Trainer[]>([]);
  searchTerm = signal('');
  errorMessage = signal('');
  showForm = signal(false);
  isEditMode = signal(false);
  isAdmin = signal(false);
  formData = signal<Trainer>({ firstName: '', lastName: '', specialization: '' });
  errors = signal<Record<string, string>>({});
  hasErrors = computed(() => Object.keys(this.errors()).length > 0);

  filteredTrainers = computed(() => {
    const search = this.searchTerm().toLowerCase();
    return !search
      ? this.trainers()
      : this.trainers().filter(t =>
          `${t.firstName} ${t.lastName} ${t.specialization}`.toLowerCase().includes(search)
        );
  });

  ngOnInit(): void {
    this.isAdmin.set(this.authService.hasRole(ROLES.UPDATE));
    this.load();
  }

  load(): void {
    this.trainerService.getAll().subscribe({
      next: t => { this.trainers.set(t); this.cdr.markForCheck(); },
      error: () => { this.errorMessage.set('Fehler beim Laden der Trainer.'); this.cdr.markForCheck(); },
    });
  }

  openCreate(): void {
    this.formData.set({ firstName: '', lastName: '', specialization: '' });
    this.isEditMode.set(false);
    this.errors.set({});
    this.showForm.set(true);
  }

  openEdit(trainer: Trainer): void {
    this.formData.set({ ...trainer });
    this.isEditMode.set(true);
    this.errors.set({});
    this.showForm.set(true);
  }

  cancel(): void {
    this.showForm.set(false);
    this.errorMessage.set('');
    this.errors.set({});
  }

  validate(): boolean {
    const e: Record<string, string> = {};
    const d = this.formData();
    const trim = (v: string) => v?.trim() ?? '';

    if (trim(d.firstName).length < 2) e['firstName'] = 'Vorname: min. 2 Zeichen erforderlich';
    else if (trim(d.firstName).length > 50) e['firstName'] = 'Vorname: max. 50 Zeichen';

    if (trim(d.lastName).length < 2) e['lastName'] = 'Nachname: min. 2 Zeichen erforderlich';
    else if (trim(d.lastName).length > 50) e['lastName'] = 'Nachname: max. 50 Zeichen';

    if (trim(d.specialization).length < 2) e['specialization'] = 'Spezialisierung: min. 2 Zeichen erforderlich';
    else if (trim(d.specialization).length > 100) e['specialization'] = 'Spezialisierung: max. 100 Zeichen';

    this.errors.set(e);
    return Object.keys(e).length === 0;
  }

  save(): void {
    if (!this.validate()) return;
    const data = this.formData();
    if (this.isEditMode() && data.id) {
      this.trainerService.update(data.id, data).subscribe({
        next: () => { this.showForm.set(false); this.load(); },
        error: () => { this.errorMessage.set('Fehler beim Speichern.'); this.cdr.markForCheck(); },
      });
    } else {
      this.trainerService.create(data).subscribe({
        next: () => { this.showForm.set(false); this.load(); },
        error: () => { this.errorMessage.set('Fehler beim Erstellen.'); this.cdr.markForCheck(); },
      });
    }
  }

  delete(trainer: Trainer): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'dialogs.title_delete', message: `${trainer.firstName} ${trainer.lastName}` }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.trainerService.delete(trainer.id!).subscribe({
          next: () => this.load(),
          error: () => { this.errorMessage.set('Fehler beim Löschen.'); this.cdr.markForCheck(); },
        });
      }
    });
  }

  updateField(field: keyof Trainer, value: string): void {
    this.formData.update(d => ({ ...d, [field]: value }));
  }
}
