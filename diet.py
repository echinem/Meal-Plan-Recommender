from flask import Flask, jsonify, abort, request
from flask_cors import CORS
import pandas as pd
import os
import random
import hashlib
from collections import OrderedDict

app = Flask(__name__)
CORS(app)

# Meal distribution ratios
meal_distribution = OrderedDict([
    ('breakfast', 0.25),
    ('lunch', 0.30),
    ('dinner', 0.35)
])

# Load datasets
datasets = {
    'low_carb': pd.read_csv('low_carb_diet.csv'),
    'low_sodium': pd.read_csv('low_sodium_diet.csv'),
    'balanced': pd.read_csv('balanced_diet.csv')
}

# Non-vegetarian keywords
non_vegetarian_keywords = [
    "chicken", "beef", "pork", "fish", "lamb", "duck", "turkey", "ham", "sausages", "shrimp", "meat", "eggveg"
]

# Function to filter out non-vegetarian foods
def filter_vegetarian(df):
    return df[~df['food_name'].str.lower().str.contains('|'.join(non_vegetarian_keywords))]

def knapsack(meals, total_calories):
    total_calories = int(total_calories)

    n = len(meals)
    dp = [0] * (total_calories + 1)
    item_included = [-1] * (total_calories + 1)

    for i in range(n):
        calories = int(meals[i]['calories'])  # Use energy_kcal for indexing
        for j in range(total_calories, calories - 1, -1):
            if dp[j - calories] + calories > dp[j]:
                dp[j] = dp[j - calories] + calories
                item_included[j] = i

    selected_meals = []
    remaining_calories = total_calories
    used_indices = set()

    while remaining_calories > 0 and item_included[remaining_calories] != -1:
        i = item_included[remaining_calories]
        if i in used_indices:  # avoid infinite loop in case of same item repeatedly added
            break
        used_indices.add(i)
        selected_meals.append({
            'food_code': meals[i]['food_code'],
            'food_name': meals[i]['food_name'],
            'quantity (multiplier)': round(meals[i]['quantity (multiplier)'], 2) if 'quantity (multiplier)' in meals[i] else 1,
            'calories': round(meals[i]['calories'], 2)
        })
        remaining_calories -= int(meals[i]['calories'])

    return selected_meals

@app.route('/meal_plan/<diet_type>/<int:total_calories>', methods=['GET'])
def generate_meal_plan(diet_type, total_calories):
    if diet_type not in datasets:
        abort(404, description="Diet type not found")
    
    # Check if vegetarian flag is passed in query parameters
    is_vegetarian = request.args.get('vegetarian', 'false').lower() == 'true'

    # Load the corresponding diet dataset
    df = datasets[diet_type]

    # If vegetarian is requested, filter the meals
    if is_vegetarian:
        df = filter_vegetarian(df)

    # Meal plan generation
    meal_plan = {}
    for meal, portion in meal_distribution.items():
        target_cal = total_calories * portion
        meal_items = []
        seed_str = f"{diet_type}-{total_calories}"
        seed = int(hashlib.sha256(seed_str.encode()).hexdigest(), 16) % (10 ** 8)
        df_shuffled = df.sample(frac=1, random_state=seed).reset_index(drop=True)

        for _, row in df_shuffled.iterrows():
            cal = row['energy_kcal']
            if cal <= 0:
                continue
            qty = min(target_cal / cal, 2.5)  # Limit quantity to a maximum of 2.5
            meal_items.append({
                'food_code': row['food_code'],
                'food_name': row['food_name'],
                'calories': cal,
                'quantity (multiplier)': qty
            })

        selected_items = knapsack(meal_items, target_cal)
        meal_plan[meal] = selected_items

    return jsonify(meal_plan)

if __name__ == '__main__':
    app.run(debug=True)
