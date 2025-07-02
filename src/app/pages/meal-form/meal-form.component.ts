import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MealService } from '../../services/meal.service';
import { CategoryService, } from '../../services/category.service';
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
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Error modal properties
  showErrorModal = false;
  errorMessage = '';
  errorDetails: any = {};

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
      tags: [''],
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

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        alert('Please select a valid image file (JPEG, PNG, JPG, GIF)');
        this.selectedFile = null;
        this.imagePreview = null;
        return;
      }

      if (this.selectedFile.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        this.selectedFile = null;
        this.imagePreview = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  submit(): void {
    if (this.mealForm.valid) {
      const formData = new FormData();

      Object.keys(this.mealForm.value).forEach(key => {
        if (key === 'ingredients' || key === 'measures') {
          const arrayValue = this.mealForm.value[key];
          arrayValue.forEach((item: string, index: number) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (key !== 'strMealThumb') {
          formData.append(key, this.mealForm.value[key] || '');
        }
      });

      if (this.selectedFile) {
        formData.append('strMealThumb', this.selectedFile);
      }

      this.mealService.createMeal(formData).subscribe({
        next: (response) => {
          console.log('Meal created:', response);
          this.mealForm.reset();
          this.removeImage();
          alert('Meal created successfully!');
        },
        error: (err) => {
          console.error('Error creating meal:', err);
          this.showError(err);
        }
      });
    } else {
      this.mealForm.markAllAsTouched();
    }
  }

  showError(error: any): void {
    this.errorMessage = error.error?.message || 'An error occurred while creating the meal';
    this.errorDetails = error.error?.errors || {};
    this.showErrorModal = true;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
    this.errorDetails = {};
  }

  getErrorMessages(): string[] {
    const messages: string[] = [];
    for (const field in this.errorDetails) {
      if (this.errorDetails[field] && Array.isArray(this.errorDetails[field])) {
        this.errorDetails[field].forEach((msg: string) => {
          messages.push(`${field}: ${msg}`);
        });
      }
    }
    return messages;
  }
}