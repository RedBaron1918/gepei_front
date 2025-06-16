import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MealService } from '../../services/meal.service';
import { CategoryService,  } from '../../services/category.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category';

@Component({
  selector: 'app-meal-form',
  templateUrl: 'meal-form.component.html',
  styleUrl: 'meal-form.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class MealFormComponent implements OnInit {
  mealForm: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private mealService: MealService,
    private categoryService: CategoryService
  ) {
    this.mealForm = this.fb.group({
      strMeal: ['', Validators.required],
      strCategory: ['', Validators.required],
      strArea: [''],
      strInstructions: [''],
      strMealThumb: [''],
      strTags: [''],
      strYoutube: [''],
      strSource: [''],
      ingredients: this.fb.array([]),
      measures: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.addIngredient(); 
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        console.log(data);
        this.categories = data
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  get ingredients(): FormArray {
    return this.mealForm.get('ingredients') as FormArray;
  }

  get measures(): FormArray {
    return this.mealForm.get('measures') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.fb.control('', Validators.required));
    this.measures.push(this.fb.control('', Validators.required));
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
    this.measures.removeAt(index);
  }

  getMeasureControl(index: number): FormControl {
    return this.measures.at(index) as FormControl;
  }

  submit(): void {
    if (this.mealForm.valid) {
      this.mealService.createMeal(this.mealForm.value).subscribe({
        next: (response) => console.log('Meal created:', response),
        error: (err) => console.error('Error creating meal:', err),
      });
    }
  }
}
