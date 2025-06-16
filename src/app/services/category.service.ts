import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categories, Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://127.0.0.1:8000/categories';
  private http: HttpClient = inject(HttpClient);

 getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('http://127.0.0.1:8000/api/categories');
  }
}
