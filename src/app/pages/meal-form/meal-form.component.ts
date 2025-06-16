import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MealService } from '../../services/meal.service';

@Component({
  selector: 'app-meal-form',
  templateUrl: 'meal-form.component.html',
  standalone: true
})
export class MealFormComponent {
  mealForm: FormGroup;

  constructor(private fb: FormBuilder, private mealService: MealService) {
    this.mealForm = this.fb.group({
      strMeal: ['', Validators.required],
      strArea: [''],
      strInstructions: [''],
      strMealThumb: [''],
      strTags: [''],
      strYoutube: [''],
      ingredients: this.fb.array([]),
      measures: this.fb.array([]),
      strSource: ['']
    });
  }

  submit() {
    if (this.mealForm.valid) {
      this.mealService.createMeal(this.mealForm.value).subscribe({
        next: (response) => {
          console.log('Meal created:', response);
        },
        error: (err) => {
          console.error('Error creating meal:', err);
        }
      });
    }
  }
}
