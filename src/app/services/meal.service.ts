import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Meal, Meals } from '../models/meal';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  http: HttpClient = inject(HttpClient);
  url: string = 'https://www.themealdb.com/api/json/v1/1';
  private searchResultsSubject = new BehaviorSubject<Meal[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  mealListByCategory(category: string): Observable<Meals> {
    console.log(`this is category String : ${category}`);
    return this.http.get<Meals>(`${this.url}/filter.php?c=${category}`);
  }
  getMealDetails(id: string): Observable<Meals> {
    return this.http.get<Meals>(`${this.url}/lookup.php?i=${id}`);
  }
  searchMeals(query: string): Observable<Meal[]> {
    return this.http
      .get<{ meals: Meal[] }>(`${this.url}/search.php?s=${query}`)
      .pipe(
        map((response) => {
          console.log('Raw API response:', response);
          return response.meals || [];
        })
      );
  }
}
