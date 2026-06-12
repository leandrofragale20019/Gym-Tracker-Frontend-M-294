import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from '../dataaccess/exercise';

const BASE = 'http://localhost:8081/api/exercises';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private http = inject(HttpClient);

  getAll(): Observable<Exercise[]> {
    console.log('ExerciseService: GET', BASE);
    return this.http.get<Exercise[]>(BASE);
  }

  getById(id: number): Observable<Exercise> {
    console.log('ExerciseService: GET', `${BASE}/${id}`);
    return this.http.get<Exercise>(`${BASE}/${id}`);
  }

  create(exercise: Omit<Exercise, 'id'>): Observable<Exercise> {
    console.log('ExerciseService: POST', BASE, exercise);
    return this.http.post<Exercise>(BASE, exercise);
  }

  update(id: number, exercise: Exercise): Observable<Exercise> {
    console.log('ExerciseService: PUT', `${BASE}/${id}`, exercise);
    return this.http.put<Exercise>(`${BASE}/${id}`, exercise);
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('ExerciseService: DELETE', `${BASE}/${id}`);
    return this.http.delete<{ message: string }>(`${BASE}/${id}`);
  }
}
