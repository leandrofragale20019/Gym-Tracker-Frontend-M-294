import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { MemberService } from './member.service';
import { Member } from '../dataaccess/member';

describe('MemberService', () => {
  let service: MemberService;
  let httpMock: HttpTestingController;

  const mockMember: Member = { id: 1, firstName: 'Anna', lastName: 'Müller', email: 'anna@test.ch', joinDate: '2024-01-01' };
  const mockList: Member[] = [
    mockMember,
    { id: 2, firstName: 'Max', lastName: 'Meier', email: 'max@test.ch' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MemberService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MemberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() sollte alle Mitglieder laden', async () => {
    const result = firstValueFrom(service.getAll());
    const req = httpMock.expectOne('/api/members');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
    expect(await result).toEqual(mockList);
  });

  it('getById() sollte ein Mitglied per ID laden', async () => {
    const result = firstValueFrom(service.getById(1));
    const req = httpMock.expectOne('/api/members/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockMember);
    expect(await result).toEqual(mockMember);
  });

  it('create() sollte ein neues Mitglied anlegen', async () => {
    const newMember = { firstName: 'Lisa', lastName: 'Schmidt', email: 'lisa@test.ch' };
    const created = { ...newMember, id: 3 };
    const result = firstValueFrom(service.create(newMember));
    const req = httpMock.expectOne('/api/members');
    expect(req.request.method).toBe('POST');
    req.flush(created);
    expect(await result).toEqual(created);
  });

  it('update() sollte ein Mitglied aktualisieren', async () => {
    const updated = { ...mockMember, email: 'anna.new@test.ch' };
    const result = firstValueFrom(service.update(1, updated));
    const req = httpMock.expectOne('/api/members/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
    expect(await result).toEqual(updated);
  });

  it('delete() sollte ein Mitglied löschen', async () => {
    const result = firstValueFrom(service.delete(1));
    const req = httpMock.expectOne('/api/members/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Member deleted' });
    expect((await result).message).toBeDefined();
  });

  it('getById() sollte bei 404 einen Fehler werfen', async () => {
    const result = firstValueFrom(service.getById(999));
    const req = httpMock.expectOne('/api/members/999');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    await expect(result).rejects.toThrow();
  });
});
