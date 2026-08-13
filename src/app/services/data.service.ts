import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://abacus-project-backend.onrender.com/api/practice';

  constructor(private http: HttpClient) { }

  getQuestions(count: number, digits: number, rows: number): Observable<any> {
    const finalUrl = `${this.apiUrl}?questions=${count}&digits=${digits}&rows=${rows}`;
    return this.http.get(finalUrl);
  }
}
