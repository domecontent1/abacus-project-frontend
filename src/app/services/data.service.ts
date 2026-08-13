import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  problem: number[];
  answer: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Replace 'http://127.0.0.1:8000' with your Render URL
  private apiUrl = 'https://abacus-project-backend.onrender.com/api/practice';

  constructor(private http: HttpClient) { }

  getQuestions(count: number, digits: number, rows: number): Observable<any> {
    const finalUrl = `${this.apiUrl}?questions=${count}&digits=${digits}&rows=${rows}`;
    return this.http.get(finalUrl);
  }
}
