import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MealService } from '../../services/meal.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { Meal } from '../../models/meal';

@Component({
  selector: 'app-meal-edit',
  templateUrl: './meal-edit.component.html',
  styleUrl: './meal-edit.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class MealEditComponent implements OnInit {
  mealForm: FormGroup;
  categories: Category[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  mealId: string;
  meal: Meal | null = null;
  loading = false;

  // Error modal properties
  showErrorModal = false;
  errorMessage = '';
  errorDetails: any = {};

  constructor(
    private fb: FormBuilder,
    private mealService: MealService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.mealId = this.route.snapshot.paramMap.get('id') || '';
    this.mealForm = this.fb.group({
      strMeal: ['',],
      strCategory: ['',],
      strArea: [''],
      strInstructions: ['',],
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
    this.loadMeal();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadMeal(): void {
    this.loading = true;
    this.mealService.getMealDetails(this.mealId).subscribe({
      next: (meal) => {
        this.meal = meal;
        this.populateForm(meal);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load meal', err);
        this.loading = false;
        this.router.navigate(['/user/meals']);
      }
    });
  }

  populateForm(meal: Meal): void {
    this.mealForm.patchValue({
      strMeal: meal.strMeal,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
      strInstructions: meal.strInstructions,
      tags: Array.isArray(meal.strTags) ? meal.strTags.join(', ') : meal.strTags,
      strYoutube: meal.strYoutube,
      strSource: meal.strSource,
    });

    // Set image preview if exists
    if (meal.strMealThumb) {
      this.imagePreview = meal.strMealThumb;
    }

    // Populate ingredients and measures
    if (meal.ingredients && meal.measures) {
      const ingredientsArray = this.mealForm.get('ingredients') as FormArray;
      const measuresArray = this.mealForm.get('measures') as FormArray;

      // Clear existing controls
      ingredientsArray.clear();
      measuresArray.clear();

      // Add ingredients and measures
      meal.ingredients.forEach((ingredient, index) => {
        ingredientsArray.push(this.fb.control(ingredient,));
        measuresArray.push(this.fb.control(meal.measures[index] || '',));
      });
    }

    // Add at least one ingredient row if none exist
    if (this.ingredients.length === 0) {
      this.addIngredient();
    }
  }

  get ingredients(): FormArray {
    return this.mealForm.get('ingredients') as FormArray;
  }

  get measures(): FormArray {
    return this.mealForm.get('measures') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.fb.control('',));
    this.measures.push(this.fb.control('',));
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
        return;
      }

      if (this.selectedFile.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        this.selectedFile = null;
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
    this.imagePreview = this.meal?.strMealThumb || null;
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

      // Add _method for Laravel to handle PUT request
      formData.append('_method', 'PUT');

      this.mealService.updateMeal(this.mealId, formData).subscribe({
        next: (response) => {
          console.log('Meal updated:', response);
          alert('Meal updated successfully!');
          this.router.navigate(['/user/meals']);
        },
        error: (err) => {
          console.error('Error updating meal:', err);
          this.showError(err);
        }
      });
    } else {
      this.mealForm.markAllAsTouched();
    }
  }

  showError(error: any): void {
    this.errorMessage = error.error?.message || 'An error occurred while updating the meal';
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