import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
} from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { RouterLink } from '@angular/router';
import { Meal, Meals } from '../../models/meal';
import { MealService } from '../../services/meal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  mealService: MealService = inject(MealService);

  meals: WritableSignal<Meal[]> = signal([]);
  mealsLoading: WritableSignal<boolean> = signal(false);

  generalBreakpoints = {
    1366: { slidesPerView: 6 },
    1365: { slidesPerView: 5 },
    1199: { slidesPerView: 4 },
    992: { slidesPerView: 3 },
    767: { slidesPerView: 2 },
    479: { slidesPerView: 1 },
  };

  ngOnInit(): void {
    this.fetchMealsByCategory();
  }
  getImageUrl(thumb: string | undefined): string {
    if (!thumb) return '';
    return thumb.startsWith('http') ? thumb : 'http://127.0.0.1:8000' + thumb;
  }


  fetchMealsByCategory(): void {
    this.mealsLoading.set(true);
    this.mealService.mealListByCategory().subscribe({
      next: (data) => {
        console.log(data);
        this.meals.set(data.meals);
        this.mealsLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching meals:', error);
        this.mealsLoading.set(false);
      },
    });
  }
}
