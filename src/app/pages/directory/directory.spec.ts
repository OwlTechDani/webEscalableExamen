import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Directory } from './directory';

describe('Directory', () => {
  let fixture: ComponentFixture<Directory>;
  let http: HttpTestingController;
  const person = { _id: '507f1f77bcf86cd799439011', name: 'Ana', username: 'ana', email: 'ana@example.com', image: '' };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Directory], providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Directory);
    fixture.detectChanges();
    http.expectOne('/api/persons?searchTerm=').flush([person]);
  });

  afterEach(() => http.verify());

  it('conserva el formulario al fallar un guardado y permite reintentar', () => {
    const page = fixture.componentInstance;
    page.edit(person);
    page.save();
    http.expectOne(`/api/persons/${person._id}`).flush({ message: 'Error al actualizar' }, { status: 500, statusText: 'Error' });
    expect(page.saving()).toBe(false);
    expect(page.editingId()).toBe(person._id);
    expect(page.form.controls.name.value).toBe('Ana');
    expect(page.error()).toBe('Error al actualizar');
    page.save();
    http.expectOne(`/api/persons/${person._id}`).flush({ ok: true, message: 'Actualizada', data: person });
    http.expectOne('/api/persons?searchTerm=').flush([person]);
    expect(page.editingId()).toBe(null);
    expect(page.message()).toBe('Actualizada');
  });

  it('cancela búsquedas anteriores para no mostrar respuestas fuera de orden', () => {
    const page = fixture.componentInstance;
    page.search.setValue('Ana');
    page.load();
    const first = http.expectOne('/api/persons?searchTerm=Ana');
    page.search.setValue('Carlos');
    page.load();
    expect(first.cancelled).toBe(true);
    const last = http.expectOne('/api/persons?searchTerm=Carlos');
    expect(page.loading()).toBe(true);
    last.flush([]);
    expect(page.loading()).toBe(false);
    expect(page.persons()).toEqual([]);
  });

  it('elimina mediante la API y recarga los datos persistidos', () => {
    const page = fixture.componentInstance;
    page.remove(person);
    const request = http.expectOne(`/api/persons/${person._id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ ok: true, message: 'Eliminada' });
    http.expectOne('/api/persons?searchTerm=').flush([]);
    expect(page.persons()).toEqual([]);
    expect(page.saving()).toBe(false);
  });
});
