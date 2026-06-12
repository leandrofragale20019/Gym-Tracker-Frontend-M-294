import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { WorkoutPlanService } from './workout-plan.service';
import { WorkoutPlan } from '../dataaccess/workout-plan';

describe('WorkoutPlanService', () => {
  let service: WorkoutPlanService;
  let httpMock: HttpTestingController;

  const mockPlan: WorkoutPlan = {
    id: 1,
    title: 'Plan A',
    memberId: 1,
    memberName: 'Anna Müller',
    exercises: [
      { exerciseId: 1, exerciseName: 'Squat', sets: 3, repetitions: 10 }
    ]
  };
  const mockList: WorkoutPlan[] = [mockPlan];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WorkoutPlanService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(WorkoutPlanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() sollte alle Trainingspläne laden', async () => {
    const result = firstValueFrom(service.getAll());
    const req = httpMock.expectOne('/api/workout-plans');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
    expect(await result).toEqual(mockList);
  });

  it('getMy() sollte eigene Pläne laden', async () => {
    const result = firstValueFrom(service.getMy());
    const req = httpMock.expectOne('/api/workout-plans/my');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
    expect(await result).toEqual(mockList);
  });

  it('getById() sollte einen Plan per ID laden', async () => {
    const result = firstValueFrom(service.getById(1));
    const req = httpMock.expectOne('/api/workout-plans/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPlan);
    expect(await result).toEqual(mockPlan);
  });

  it('create() sollte einen neuen Plan anlegen', async () => {
    const newPlan = { title: 'Plan B', memberId: 2, exercises: [] };
    const created = { ...newPlan, id: 2 };
    const result = firstValueFrom(service.create(newPlan));
    const req = httpMock.expectOne('/api/workout-plans');
    expect(req.request.method).toBe('POST');
    req.flush(created);
    expect(await result).toEqual(created);
  });

  it('update() sollte einen Plan aktualisieren', async () => {
    const updated = { ...mockPlan, title: 'Plan A (aktualisiert)' };
    const result = firstValueFrom(service.update(1, updated));
    const req = httpMock.expectOne('/api/workout-plans/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
    expect(await result).toEqual(updated);
  });

  it('delete() sollte einen Plan löschen', async () => {
    const result = firstValueFrom(service.delete(1));
    const req = httpMock.expectOne('/api/workout-plans/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Plan deleted' });
    expect((await result).message).toBeDefined();
  });
});
