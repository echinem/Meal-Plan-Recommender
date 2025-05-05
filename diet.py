from flask import Flask, jsonify, abort
from flask_cors import CORS
import pandas as pd
import os
import random
from collections import OrderedDict

app = Flask(__name__)
CORS(app)

# Meal distribution ratios
meal_distribution = OrderedDict([
    ('breakfast', 0.25),
    ('lunch', 0.35),
    ('dinner', 0.30)
])

# Load datasets
datasets = {
    'low_carb': pd.read_csv('low_carb_diet.csv'),
    'low_sodium': pd.read_csv('low_sodium_diet.csv'),
    'balanced': pd.read_csv('balanced_diet.csv')
}

def generate_meal_plan(df, total_calories):
    meal_plan = {}
    for meal, portion in meal_distribution.items():
        target_cal = total_calories * portion
        selected_items = []
        total_meal_cal = 0
        df_shuffled = df.sample(frac=1).reset_index(drop=True)  # Shuffle the dataframe

        for _, row in df_shuffled.iterrows():
            cal = row['Calories (kcal)']
            if cal <= 0: 
                continue
            qty = target_cal / cal
            qty = min(qty, 2.5)  # Limit quantity to a maximum of 2.5
            selected_items.append({
                'food': str(row['Dish']).strip(),
                'quantity (multiplier)': round(qty, 2),
                'calories': round(cal * qty, 2)
            })
            total_meal_cal += cal * qty
            if total_meal_cal >= target_cal * 0.95:  # Stop if we reach close to the target calories
                break
        meal_plan[meal] = selected_items
    return meal_plan

# Read data on startup
meal_data = {}

@app.route('/meal_plan/<diet_type>/<int:total_calories>', methods=['GET'])
def get_meal_plan(diet_type, total_calories):
    if diet_type not in datasets:
        abort(404, description="Diet type not found")
    
    df = datasets[diet_type]
    meal_plan = generate_meal_plan(df, total_calories)
    return jsonify(meal_plan)

if __name__ == '__main__':
    app.run(debug=True)
