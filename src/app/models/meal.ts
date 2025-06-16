export interface Meals {
  meals: Meal[];
}

export interface Meal {
  id: number;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  strTags?: string;
  strYoutube?: string;
  ingredients: string[];
  measures: string[];  
  strSource?: string;
  dateModified?: string;
}
