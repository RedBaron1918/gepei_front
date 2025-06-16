import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MealService } from '../../services/meal.service';
import { Meal } from '../../models/meal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Ingredient {
  name: string;
  measure: string;
}

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-detail.component.html',
  styleUrl: './meal-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mealService = inject(MealService);
  private sanitizer = inject(DomSanitizer);

  meal: WritableSignal<Meal | null> = signal(null);
  loading: WritableSignal<boolean> = signal(true);
  ingredients: WritableSignal<Ingredient[]> = signal([]);
  youtubeUrl: WritableSignal<SafeResourceUrl | null> = signal(null);

 ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchMealDetails(id);
    }
  }
private fetchMealDetails(id: string): void {
  this.loading.set(true);
  this.mealService.getMealDetails(id).subscribe({
    next: (mealData) => {
      console.log('Meal from backend:', mealData);
      this.meal.set(mealData);
this.extractIngredients(mealData);
      if (mealData.strYoutube) {
        this.setYoutubeUrl(mealData.strYoutube);
      }

      this.loading.set(false);
    },
    error: (error) => {
      console.error('Error fetching meal details:', error);
      this.loading.set(false);
    },
  });
  
}
private extractIngredients(meal: Meal): void {
  const ingredients: Ingredient[] = [];

  for (let i = 0; i < meal.ingredients.length; i++) {
    const name = meal.ingredients[i];
    const measure = meal.measures[i] || '';
    if (name?.trim()) {
      ingredients.push({ name: name.trim(), measure: measure.trim() });
    }
  }

  this.ingredients.set(ingredients);
}


  private setYoutubeUrl(url: string): void {
    const videoId = url.split('v=')[1];
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      this.youtubeUrl.set(
        this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
      );
    }
  }
}
