import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: string[] = [];

  getRecipes(): string[] {
    return this.recipes;
  }

  addRecipe(recipe: string): void {
    this.recipes.push(recipe);
  }
}