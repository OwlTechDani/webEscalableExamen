import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PersonsService } from './persons.service';

describe('PersonsService', () => {
  let service: PersonsService;
  let http: HttpTestingController;
  const data = { name: 'Ana', username: 'ana', email: 'ana@example.com', image: '' };
  const person = { ...data, _id: '507f1f77bcf86cd799439011' };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PersonsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envía searchTerm como query param y conserva los ObjectId de MongoDB', () => {
    service.getPersons('Ana +').subscribe(people => expect(people[0]._id).toBe(person._id));
    const request = http.expectOne(req => req.url === '/api/persons' && req.params.get('searchTerm') === 'Ana +');
    expect(request.request.method).toBe('GET');
    request.flush([person]);
  });

  it('consulta, crea, actualiza y elimina usando el contrato de la API', () => {
    service.getPerson(person._id).subscribe(result => expect(result).toEqual(person));
    http.expectOne(`/api/persons/${person._id}`).flush(person);
    service.createPerson(data).subscribe(result => expect(result.data._id).toBe(person._id));
    const create = http.expectOne('/api/persons');
    expect(create.request.method).toBe('POST');
    expect(create.request.body).toEqual(data);
    create.flush({ ok: true, message: 'Creada', data: person }, { status: 201, statusText: 'Created' });
    service.updatePerson(person._id, data).subscribe();
    const update = http.expectOne(`/api/persons/${person._id}`);
    expect(update.request.method).toBe('PUT');
    update.flush({ ok: true, data: person });
    service.deletePerson(person._id).subscribe();
    const remove = http.expectOne(`/api/persons/${person._id}`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush({ ok: true });
  });
});
