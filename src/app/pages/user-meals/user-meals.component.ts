import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meal } from '../../models/meal';
import { MealService } from '../../services/meal.service';

@Component({
  selector: 'app-user-meals',
  templateUrl: './user-meals.component.html',
  styleUrl: './user-meals.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class UserMealsComponent implements OnInit {
  meals: Meal[] = [];
  loading = false;
  showDeleteModal = false;
  mealToDelete: Meal | null = null;

  constructor(private mealService: MealService) { }

  ngOnInit(): void {
    this.loadUserMeals();
  }

  loadUserMeals(): void {
    this.loading = true;
    this.mealService.getUserMeals().subscribe({
      next: (response) => {
        this.meals = response.meals;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load user meals', err);
        this.loading = false;
      }
    });
  }

  confirmDelete(meal: Meal): void {
    this.mealToDelete = meal;
    this.showDeleteModal = true;
  }

  deleteMeal(): void {
    if (this.mealToDelete) {
      this.mealService.deleteMeal(this.mealToDelete.id).subscribe({
        next: () => {
          this.meals = this.meals.filter(m => m.id !== this.mealToDelete!.id);
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Failed to delete meal', err);
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.mealToDelete = null;
  }
}