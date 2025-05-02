import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categories, Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private ApiUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';
  private http: HttpClient = inject(HttpClient);

  categoryList(): Observable<Categories> {
    return this.http.get<Categories>(this.ApiUrl);
  }
}
