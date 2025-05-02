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
import { Categories, Category } from '../../models/category';
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
  categoryService: CategoryService = inject(CategoryService);
  mealService: MealService = inject(MealService);

  loading: WritableSignal<boolean> = signal(false);
  categories: WritableSignal<Category[]> = signal([]);
  categoryString: WritableSignal<string> = signal('');
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
    this.loading.set(true);
    this.mealsLoading.set(true);

    this.categoryService.categoryList().subscribe({
      next: (data) => {
        this.categories.set(data.categories);
        this.categoryString.set(data.categories[0].strCategory);
        this.loading.set(false);

        this.fetchMealsByCategory(this.categoryString());
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.loading.set(false);
      },
    });
  }

  fetchMealsByCategory(category: string): void {
    this.mealsLoading.set(true);
    this.categoryString.set(category);
    this.mealService.mealListByCategory(category).subscribe({
      next: (data) => {
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
