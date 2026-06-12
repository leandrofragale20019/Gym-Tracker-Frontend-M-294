import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trainer } from '../dataaccess/trainer';

const BASE = 'http://localhost:8081/api/trainers';

@Injectable({ providedIn: 'root' })
export class TrainerService {
  private http = inject(HttpClient);

  getAll(): Observable<Trainer[]> {
    console.log('TrainerService: GET', BASE);
    return this.http.get<Trainer[]>(BASE);
  }

  getById(id: number): Observable<Trainer> {
    console.log('TrainerService: GET', `${BASE}/${id}`);
    return this.http.get<Trainer>(`${BASE}/${id}`);
  }

  create(trainer: Omit<Trainer, 'id'>): Observable<Trainer> {
    console.log('TrainerService: POST', BASE, trainer);
    return this.http.post<Trainer>(BASE, trainer);
  }

  update(id: number, trainer: Trainer): Observable<Trainer> {
    console.log('TrainerService: PUT', `${BASE}/${id}`, trainer);
    return this.http.put<Trainer>(`${BASE}/${id}`, trainer);
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('TrainerService: DELETE', `${BASE}/${id}`);
    return this.http.delete<{ message: string }>(`${BASE}/${id}`);
  }
}
