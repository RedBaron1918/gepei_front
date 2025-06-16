import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Meal, Meals } from '../models/meal';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  http: HttpClient = inject(HttpClient);
  url: string = 'http://127.0.0.1:8000/api';

  private searchResultsSubject = new BehaviorSubject<Meal[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  mealListByCategory(): Observable<Meals> {
    return this.http.get<Meals>(`${this.url}/meals`);
  }

  getMealDetails(id: string): Observable<Meal> {
    return this.http.get<Meal>(`${this.url}/meals/${id}`);
  }

  createMeal(meal: Meal): Observable<any> {
    return this.http.post(`${this.url}/meals`, meal);
  }

  searchMeals(query: string): Observable<Meal[]> {
    return this.http
      .get<{ meals: Meal[] }>(`${this.url}/meals/search?q=${query}`)
      .pipe(map((res) => res.meals || []));
  }}
