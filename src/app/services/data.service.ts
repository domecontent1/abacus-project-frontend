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
  private apiUrl = 'http://127.0.0.1:8000/api/practice';

  constructor(private http: HttpClient) { }

  getQuestions(count: number, digits: number, rows: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?questions=${count}&digits=${digits}&rows=${rows}`);
  }
}
