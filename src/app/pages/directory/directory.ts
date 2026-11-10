import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, of, Subject, switchMap } from 'rxjs';
import { Person } from '../../interfaces/person.interface';
import { PersonsService } from '../../services/persons.service';

@Component({
  selector: 'app-directory',
  imports: [ReactiveFormsModule],
  templateUrl: './directory.html',
})
export class Directory implements OnInit {
  private readonly api = inject(PersonsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searches = new Subject<string>();
  readonly persons = signal<Person[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly editingId = signal<string | null>(null);
  readonly search = new FormControl('', { nonNullable: true });
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    image: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.searches.pipe(
      switchMap(term => {
        this.loading.set(true);
        return this.api.getPersons(term).pipe(
          catchError(error => {
            this.showError(error);
            return of([] as Person[]);
          }),
          finalize(() => this.loading.set(false)),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(persons => this.persons.set(persons));
    this.load();
  }

  load(): void {
    this.error.set('');
    this.searches.next(this.search.value.trim());
  }

  edit(person: Person): void {
    this.editingId.set(person._id);
    this.form.setValue({ name: person.name, email: person.email, username: person.username, image: person.image ?? '' });
    this.message.set('');
  }

  cancel(): void {
    this.editingId.set(null);
    this.form.reset();
  }

  save(): void {
    if (this.saving()) return;
    const values = this.form.getRawValue();
    this.form.setValue({ name: values.name.trim(), username: values.username.trim(), email: values.email.trim(), image: values.image.trim() });
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set('');
    this.message.set('');
    this.saving.set(true);
    const id = this.editingId();
    const request = id ? this.api.updatePerson(id, this.form.getRawValue()) : this.api.createPerson(this.form.getRawValue());
    request.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({
      next: response => {
        this.message.set(response.message);
        this.cancel();
        this.load();
      },
      error: error => this.showError(error),
    });
  }

  remove(person: Person): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    this.message.set('');
    this.api.deletePerson(person._id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.saving.set(false)),
    ).subscribe({
      next: response => {
        if (this.editingId() === person._id) this.cancel();
        this.message.set(response.message);
        this.load();
      },
      error: error => this.showError(error),
    });
  }

  private showError(error: HttpErrorResponse): void {
    this.error.set(error.error?.message ?? 'No se pudo conectar con la API. Verifica que el servidor y MongoDB estén disponibles.');
  }
}
