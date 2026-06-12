import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../dataaccess/member';

const BASE = 'http://localhost:8081/api/members';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private http = inject(HttpClient);

  getAll(): Observable<Member[]> {
    console.log('MemberService: GET', BASE);
    return this.http.get<Member[]>(BASE);
  }

  getById(id: number): Observable<Member> {
    console.log('MemberService: GET', `${BASE}/${id}`);
    return this.http.get<Member>(`${BASE}/${id}`);
  }

  create(member: Omit<Member, 'id'>): Observable<Member> {
    console.log('MemberService: POST', BASE, member);
    return this.http.post<Member>(BASE, member);
  }

  update(id: number, member: Member): Observable<Member> {
    console.log('MemberService: PUT', `${BASE}/${id}`, member);
    return this.http.put<Member>(`${BASE}/${id}`, member);
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('MemberService: DELETE', `${BASE}/${id}`);
    return this.http.delete<{ message: string }>(`${BASE}/${id}`);
  }
}
