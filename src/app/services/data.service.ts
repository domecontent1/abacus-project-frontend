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

  getQuestions(count: number, digits: number, rows: number, level: string): Observable<any> {
    // Ensure 'digits' is exactly what the backend expects
    const url = `${this.apiUrl}?questions=${count}&digits=${digits}&rows=${rows}&level=${level}`;
    return this.http.get(url);
  }
}
