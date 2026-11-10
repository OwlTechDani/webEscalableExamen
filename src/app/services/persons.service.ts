import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Person, PersonData } from '../interfaces/person.interface';

interface PersonResponse {
  ok: boolean;
  message: string;
  data: Person;
}

@Injectable({ providedIn: 'root' })
export class PersonsService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/persons';

  getPersons(searchTerm = '') {
    return this.http.get<Person[]>(this.url, { params: { searchTerm } });
  }

  getPerson(id: string) {
    return this.http.get<Person>(`${this.url}/${encodeURIComponent(id)}`);
  }

  createPerson(data: PersonData) {
    return this.http.post<PersonResponse>(this.url, data);
  }

  updatePerson(id: string, data: PersonData) {
    return this.http.put<PersonResponse>(`${this.url}/${encodeURIComponent(id)}`, data);
  }

  deletePerson(id: string) {
    return this.http.delete<{ ok: boolean; message: string }>(`${this.url}/${encodeURIComponent(id)}`);
  }
}
