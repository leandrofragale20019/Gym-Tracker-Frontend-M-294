import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkoutPlan } from '../dataaccess/workout-plan';

const BASE = 'http://localhost:8081/api/workout-plans';

@Injectable({ providedIn: 'root' })
export class WorkoutPlanService {
  private http = inject(HttpClient);

  getAll(): Observable<WorkoutPlan[]> {
    console.log('WorkoutPlanService: GET', BASE);
    return this.http.get<WorkoutPlan[]>(BASE);
  }

  getMy(): Observable<WorkoutPlan[]> {
    console.log('WorkoutPlanService: GET', `${BASE}/my`);
    return this.http.get<WorkoutPlan[]>(`${BASE}/my`);
  }

  getById(id: number): Observable<WorkoutPlan> {
    console.log('WorkoutPlanService: GET', `${BASE}/${id}`);
    return this.http.get<WorkoutPlan>(`${BASE}/${id}`);
  }

  create(plan: Omit<WorkoutPlan, 'id'>): Observable<WorkoutPlan> {
    console.log('WorkoutPlanService: POST', BASE, plan);
    return this.http.post<WorkoutPlan>(BASE, plan);
  }

  update(id: number, plan: WorkoutPlan): Observable<WorkoutPlan> {
    console.log('WorkoutPlanService: PUT', `${BASE}/${id}`, plan);
    return this.http.put<WorkoutPlan>(`${BASE}/${id}`, plan);
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('WorkoutPlanService: DELETE', `${BASE}/${id}`);
    return this.http.delete<{ message: string }>(`${BASE}/${id}`);
  }
}
