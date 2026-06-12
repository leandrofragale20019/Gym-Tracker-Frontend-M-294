import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { ExerciseService } from './exercise.service';
import { Exercise } from '../dataaccess/exercise';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let httpMock: HttpTestingController;

  const mockExercise: Exercise = { id: 1, name: 'Squat', muscleGroup: 'Beine', description: 'Grundübung' };
  const mockList: Exercise[] = [
    mockExercise,
    { id: 2, name: 'Bench Press', muscleGroup: 'Brust', description: 'Brustübung' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExerciseService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ExerciseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() sollte alle Übungen laden', async () => {
    const result = firstValueFrom(service.getAll());
    const req = httpMock.expectOne('/api/exercises');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
    expect(await result).toEqual(mockList);
  });

  it('getById() sollte eine Übung per ID laden', async () => {
    const result = firstValueFrom(service.getById(1));
    const req = httpMock.expectOne('/api/exercises/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockExercise);
    expect(await result).toEqual(mockExercise);
  });

  it('create() sollte eine neue Übung anlegen', async () => {
    const newExercise = { name: 'Lunge', muscleGroup: 'Beine', description: 'Ausfallschritt' };
    const created = { ...newExercise, id: 3 };
    const result = firstValueFrom(service.create(newExercise));
    const req = httpMock.expectOne('/api/exercises');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newExercise);
    req.flush(created);
    expect(await result).toEqual(created);
  });

  it('update() sollte eine Übung aktualisieren', async () => {
    const updated = { ...mockExercise, name: 'Squat (tief)' };
    const result = firstValueFrom(service.update(1, updated));
    const req = httpMock.expectOne('/api/exercises/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
    expect(await result).toEqual(updated);
  });

  it('delete() sollte eine Übung löschen', async () => {
    const result = firstValueFrom(service.delete(1));
    const req = httpMock.expectOne('/api/exercises/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Exercise deleted' });
    expect((await result).message).toBeDefined();
  });

  it('getAll() sollte bei 500-Fehler einen Fehler werfen', async () => {
    const result = firstValueFrom(service.getAll());
    const req = httpMock.expectOne('/api/exercises');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    await expect(result).rejects.toThrow();
  });
});
