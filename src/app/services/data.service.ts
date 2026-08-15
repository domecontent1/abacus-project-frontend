// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://abacus-project-backend.onrender.com/api/practice';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) { }

  getQuestions(questions: number, digits: number, rows: number, level: string): Observable<any> {
    const url = `${this.apiUrl}?questions=${questions}&digits=${digits}&rows=${rows}&level=${level}`;
    return this.http.get(url);
  }

  // getGlobalStats(): Observable<any> {
  //   return this.http.get('https://abacus-project-backend.onrender.com/api/stats');
  // }
}
