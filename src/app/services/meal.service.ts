import { HttpClient, HttpHeaders } from '@angular/common/http';
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


  private getAuthHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user.token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  mealListByCategory(): Observable<Meals> {
    return this.http.get<Meals>(`${this.url}/meals`);
  }

  getMealDetails(id: string): Observable<Meal> {
    return this.http.get<Meal>(`${this.url}/meals/${id}`);
  }

  createMeal(meal: FormData | Meal): Observable<any> {
    return this.http.post(`${this.url}/meals`, meal, {
      headers: this.getAuthHeaders()
    });
  }


  searchMeals(query: string): Observable<Meal[]> {
    return this.http
      .get<{ meals: Meal[] }>(`${this.url}/meals/search?q=${query}`)
      .pipe(map((res) => res.meals || []));
  }
  getUserMeals(): Observable<any> {
    return this.http.get(`${this.url}/user/meals`, {
      headers: this.getAuthHeaders()
    });
  }

  updateMeal(id: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.url}/meals/${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteMeal(id: number): Observable<any> {
    return this.http.delete(`${this.url}/meals/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

}
