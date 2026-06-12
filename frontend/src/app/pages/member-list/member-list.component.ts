import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MemberService } from '../../service/member.service';
import { Member } from '../../dataaccess/member';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
})
export class MemberListComponent implements OnInit {
  private memberService = inject(MemberService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  members = signal<Member[]>([]);
  errorMessage = signal('');
  showForm = signal(false);
  isEditMode = signal(false);
  formData = signal<Member>({ firstName: '', lastName: '', email: '' });
  errors = signal<Record<string, string>>({});
  hasErrors = computed(() => Object.keys(this.errors()).length > 0);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.memberService.getAll().subscribe({
      next: m => { this.members.set(m); this.cdr.markForCheck(); },
      error: () => { this.errorMessage.set('Fehler beim Laden der Mitglieder.'); this.cdr.markForCheck(); },
    });
  }

  openCreate(): void {
    this.formData.set({ firstName: '', lastName: '', email: '' });
    this.isEditMode.set(false);
    this.errors.set({});
    this.showForm.set(true);
  }

  openEdit(member: Member): void {
    this.formData.set({ ...member });
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

    if (!d.email) e['email'] = 'Email ist Pflichtfeld';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e['email'] = 'Ungültiges Email-Format';

    this.errors.set(e);
    return Object.keys(e).length === 0;
  }

  save(): void {
    if (!this.validate()) return;
    const data = this.formData();
    if (this.isEditMode() && data.id) {
      this.memberService.update(data.id, data).subscribe({
        next: () => { this.showForm.set(false); this.load(); },
        error: () => { this.errorMessage.set('Fehler beim Speichern.'); this.cdr.markForCheck(); },
      });
    } else {
      this.memberService.create(data).subscribe({
        next: () => { this.showForm.set(false); this.load(); },
        error: () => { this.errorMessage.set('Fehler beim Erstellen.'); this.cdr.markForCheck(); },
      });
    }
  }

  delete(member: Member): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'dialogs.title_delete', message: `${member.firstName} ${member.lastName}` }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.memberService.delete(member.id!).subscribe({
          next: () => this.load(),
          error: () => { this.errorMessage.set('Fehler beim Löschen.'); this.cdr.markForCheck(); },
        });
      }
    });
  }

  updateField(field: keyof Member, value: string): void {
    this.formData.update(d => ({ ...d, [field]: value }));
  }
}
