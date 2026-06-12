import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { TrainerService } from './trainer.service';
import { Trainer } from '../dataaccess/trainer';

describe('TrainerService', () => {
  let service: TrainerService;
  let httpMock: HttpTestingController;

  const mockTrainer: Trainer = { id: 1, firstName: 'Thomas', lastName: 'Kraft', specialization: 'Krafttraining' };
  const mockList: Trainer[] = [
    mockTrainer,
    { id: 2, firstName: 'Sandra', lastName: 'Schnell', specialization: 'Ausdauer' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TrainerService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TrainerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() sollte alle Trainer laden', async () => {
    const result = firstValueFrom(service.getAll());
    const req = httpMock.expectOne('/api/trainers');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
    expect(await result).toEqual(mockList);
  });

  it('getById() sollte einen Trainer per ID laden', async () => {
    const result = firstValueFrom(service.getById(1));
    const req = httpMock.expectOne('/api/trainers/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTrainer);
    expect(await result).toEqual(mockTrainer);
  });

  it('create() sollte einen neuen Trainer anlegen', async () => {
    const newTrainer = { firstName: 'Maria', lastName: 'Flex', specialization: 'Yoga' };
    const created = { ...newTrainer, id: 3 };
    const result = firstValueFrom(service.create(newTrainer));
    const req = httpMock.expectOne('/api/trainers');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTrainer);
    req.flush(created);
    expect(await result).toEqual(created);
  });

  it('update() sollte einen Trainer aktualisieren', async () => {
    const updated = { ...mockTrainer, specialization: 'Functional Training' };
    const result = firstValueFrom(service.update(1, updated));
    const req = httpMock.expectOne('/api/trainers/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
    expect(await result).toEqual(updated);
  });

  it('delete() sollte einen Trainer löschen', async () => {
    const result = firstValueFrom(service.delete(1));
    const req = httpMock.expectOne('/api/trainers/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Trainer deleted' });
    expect((await result).message).toBeDefined();
  });
});
