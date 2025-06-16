// search-dialog.component.ts
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Meal } from '../../models/meal';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MealService } from '../../services/meal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, MatDialogModule],
  styleUrl: './search-dialog.component.css',
  templateUrl: './search-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDialogComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchQuery = '';
  results: Meal[] = [];
  loading = false;
  debug = true;

  private mealService = inject(MealService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    });
  }

  search() {
    if (!this.searchQuery.trim()) return;

    this.loading = true;
    this.cdr.markForCheck();

    this.mealService.searchMeals(this.searchQuery).subscribe({
      next: (meals) => {
        console.log('Received meals:', meals);
        this.results = meals;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Search error:', error);
        this.loading = false;
        this.results = [];
        this.cdr.detectChanges();
      },
    });
  }

  selectMeal(meal: Meal) {
    console.log('Selected meal:', meal);
    this.dialogRef.close();
    void this.router.navigate(['/meal', meal.id]);
  }

  close() {
    this.dialogRef.close();
  }

  trackByMeal(index: number, meal: Meal): number {
    return meal.id;
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/placeholder-meal.png';
  }
}
