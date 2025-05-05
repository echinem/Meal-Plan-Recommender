
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Check, X, Plus, Trash2, AlertTriangle, Carrot } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Toggle } from "@/components/ui/toggle";

interface MealPlanItem {
  food: string;
  'quantity (multiplier)': number;
  calories: number;
}

interface MealPlan {
  [mealType: string]: MealPlanItem[];
}

const MealPlan = () => {
  const [dietType, setDietType] = useState("balanced");
  const [totalCalories, setTotalCalories] = useState(2000);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // New state for custom meal input
  const [newMealName, setNewMealName] = useState("");
  const [newMealType, setNewMealType] = useState("");
  const [newMealQuantity, setNewMealQuantity] = useState(1);
  const [newMealCalories, setNewMealCalories] = useState(0);
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  
  // Dietary restrictions state
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  
  // Vegetarian toggle state
  const [isVegetarian, setIsVegetarian] = useState(false);
  
  // Allergies state
  const [allergies, setAllergies] = useState({
    gluten: false,
    dairy: false,
    nuts: false,
    shellfish: false,
    eggs: false,
    soy: false
  });

  // Effect for real-time updates
  useEffect(() => {
    if (dietType || totalCalories) {
      fetchMealPlan();
    }
  }, [dietType, totalCalories, dietaryRestrictions, isVegetarian]);

  const fetchMealPlan = async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulating API call with a timeout - replace this with your actual API call
      setTimeout(() => {
        // Modified mock data based on selected options
        let mockData: MealPlan;
        
        if (dietType === "low_carb") {
          mockData = {
            breakfast: [
              { food: "Scrambled eggs with spinach", "quantity (multiplier)": 1, calories: 280 },
              { food: "Avocado", "quantity (multiplier)": 0.5, calories: 120 }
            ],
            lunch: [
              { food: "Grilled chicken salad (no croutons)", "quantity (multiplier)": 1, calories: 350 },
              { food: "Olive oil dressing", "quantity (multiplier)": 1, calories: 80 }
            ],
            dinner: [
              { food: "Baked salmon", "quantity (multiplier)": 1, calories: 380 },
              { food: "Steamed broccoli", "quantity (multiplier)": 1.5, calories: 80 },
              { food: "Cauliflower rice", "quantity (multiplier)": 0.5, calories: 50 }
            ],
            snacks: [
              { food: "Mixed nuts", "quantity (multiplier)": 0.25, calories: 180 },
              { food: "Celery with almond butter", "quantity (multiplier)": 1, calories: 100 }
            ]
          };
        } else if (dietType === "low_sodium") {
          mockData = {
            breakfast: [
              { food: "Overnight oats with fresh berries", "quantity (multiplier)": 1, calories: 310 },
              { food: "Fresh orange", "quantity (multiplier)": 1, calories: 65 }
            ],
            lunch: [
              { food: "Homemade vegetable soup (no salt)", "quantity (multiplier)": 1, calories: 220 },
              { food: "Whole grain bread (no salt)", "quantity (multiplier)": 1, calories: 100 }
            ],
            dinner: [
              { food: "Herb-roasted chicken", "quantity (multiplier)": 1, calories: 280 },
              { food: "Fresh garden salad", "quantity (multiplier)": 1.5, calories: 120 },
              { food: "Sweet potato", "quantity (multiplier)": 0.5, calories: 115 }
            ],
            snacks: [
              { food: "Fresh apple", "quantity (multiplier)": 1, calories: 80 },
              { food: "Unsalted rice cakes", "quantity (multiplier)": 2, calories: 70 }
            ]
          };
        } else { // balanced
          mockData = {
            breakfast: [
              { food: "Oatmeal with berries", "quantity (multiplier)": 1, calories: 350 },
              { food: "Greek yogurt", "quantity (multiplier)": 0.5, calories: 100 }
            ],
            lunch: [
              { food: "Grilled chicken salad", "quantity (multiplier)": 1, calories: 450 },
              { food: "Whole grain bread", "quantity (multiplier)": 1, calories: 120 }
            ],
            dinner: [
              { food: "Baked salmon", "quantity (multiplier)": 1, calories: 380 },
              { food: "Roasted vegetables", "quantity (multiplier)": 1.5, calories: 200 },
              { food: "Quinoa", "quantity (multiplier)": 0.5, calories: 150 }
            ],
            snacks: [
              { food: "Mixed nuts", "quantity (multiplier)": 0.25, calories: 180 },
              { food: "Apple", "quantity (multiplier)": 1, calories: 80 }
            ]
          };
        }
        
        // Filter based on vegetarian preference
        if (isVegetarian) {
          // Remove non-vegetarian items
          Object.keys(mockData).forEach(mealType => {
            mockData[mealType] = mockData[mealType].filter(
              item => !item.food.toLowerCase().includes("chicken") && 
                     !item.food.toLowerCase().includes("salmon") &&
                     !item.food.toLowerCase().includes("beef") &&
                     !item.food.toLowerCase().includes("fish")
            );
          });
          
          // Add vegetarian alternatives if meals are removed
          if (mockData.breakfast.length < 2) {
            mockData.breakfast.push({ food: "Vegetarian breakfast scramble", "quantity (multiplier)": 1, calories: 250 });
          }
          
          if (mockData.lunch.length < 2) {
            mockData.lunch.push({ food: "Hummus and vegetable wrap", "quantity (multiplier)": 1, calories: 320 });
          }
          
          if (mockData.dinner.length < 2) {
            mockData.dinner.push({ food: "Lentil curry with rice", "quantity (multiplier)": 1, calories: 380 });
            mockData.dinner.push({ food: "Steamed vegetables", "quantity (multiplier)": 1, calories: 120 });
          }
        }
        
        // Filter based on allergies and dietary restrictions
        if (allergies.gluten || dietaryRestrictions.includes("Gluten-free")) {
          // Remove gluten-containing items or replace them
          if (mockData.breakfast.some(item => item.food.includes("bread") || item.food.includes("oats"))) {
            mockData.breakfast = mockData.breakfast.filter(item => 
              !item.food.toLowerCase().includes("bread") && !item.food.toLowerCase().includes("oats")
            );
            mockData.breakfast.push({ food: "Gluten-free chia pudding", "quantity (multiplier)": 1, calories: 220 });
          }
          
          if (mockData.lunch.some(item => item.food.includes("bread"))) {
            mockData.lunch = mockData.lunch.filter(item => !item.food.toLowerCase().includes("bread"));
            mockData.lunch.push({ food: "Gluten-free crackers", "quantity (multiplier)": 1, calories: 100 });
          }
        }
        
        if (allergies.dairy || dietaryRestrictions.includes("Dairy-free")) {
          // Remove dairy-containing items or replace them
          if (mockData.breakfast.some(item => item.food.includes("yogurt"))) {
            mockData.breakfast = mockData.breakfast.filter(item => !item.food.toLowerCase().includes("yogurt"));
            mockData.breakfast.push({ food: "Coconut yogurt", "quantity (multiplier)": 0.5, calories: 110 });
          }
        }
        
        if (allergies.nuts || dietaryRestrictions.includes("Nut-free")) {
          // Remove nut-containing items or replace them
          if (mockData.snacks.some(item => item.food.includes("nuts"))) {
            mockData.snacks = mockData.snacks.filter(item => !item.food.toLowerCase().includes("nuts"));
            mockData.snacks.push({ food: "Roasted pumpkin seeds", "quantity (multiplier)": 0.25, calories: 170 });
          }
        }

        if (dietaryRestrictions.includes("Vegan")) {
          // Remove animal products
          Object.keys(mockData).forEach(mealType => {
            mockData[mealType] = mockData[mealType].filter(
              item => !item.food.toLowerCase().includes("chicken") && 
                     !item.food.toLowerCase().includes("salmon") && 
                     !item.food.toLowerCase().includes("yogurt") &&
                     !item.food.toLowerCase().includes("egg")
            );
          });
          
          // Add vegan alternatives
          if (mockData.breakfast.length < 2) {
            mockData.breakfast.push({ food: "Tofu scramble", "quantity (multiplier)": 1, calories: 220 });
          }
          
          if (mockData.lunch.length < 2) {
            mockData.lunch.push({ food: "Lentil soup", "quantity (multiplier)": 1, calories: 250 });
          }
          
          if (mockData.dinner.length < 2) {
            mockData.dinner.push({ food: "Grilled tempeh", "quantity (multiplier)": 1, calories: 290 });
          }
        }
        
        // Scale calories based on totalCalories target
        const currentTotalCalories = Object.values(mockData).reduce((total, mealItems) => {
          return total + mealItems.reduce((mealTotal, item) => mealTotal + item.calories, 0);
        }, 0);
        
        const calorieRatio = totalCalories / currentTotalCalories;
        
        Object.keys(mockData).forEach(mealType => {
          mockData[mealType].forEach(item => {
            item.calories = Math.round(item.calories * calorieRatio);
          });
        });

        setMealPlan(mockData);
        setLoading(false);
        
        toast({
          title: "Meal plan updated",
          description: "Your daily meal plan has been updated with your preferences.",
        });
      }, 1000);
    } catch (err) {
      setError("Failed to fetch meal plan. Please try again.");
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCaloriesChange = (value: number[]) => {
    setTotalCalories(value[0]);
  };

  const getTotalCalories = () => {
    if (!mealPlan) return 0;
    
    return Object.values(mealPlan).reduce((total, mealItems) => {
      return total + mealItems.reduce((mealTotal, item) => mealTotal + item.calories, 0);
    }, 0);
  };
  
  // Function to add a custom meal
  const handleAddMeal = () => {
    if (!mealPlan) {
      toast({
        title: "No meal plan",
        description: "Generate a meal plan first before adding custom meals.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newMealName || !newMealType || newMealCalories <= 0) {
      toast({
        title: "Missing information",
        description: "Please fill all fields to add a custom meal.",
        variant: "destructive",
      });
      return;
    }
    
    // Create updated meal plan with the new meal
    const updatedMealPlan = { ...mealPlan };
    
    // If this is a new meal type not in the plan yet
    if (!updatedMealPlan[newMealType]) {
      updatedMealPlan[newMealType] = [];
    }
    
    // Add the new meal item
    updatedMealPlan[newMealType].push({
      food: newMealName,
      'quantity (multiplier)': newMealQuantity,
      calories: newMealCalories
    });
    
    // Update state
    setMealPlan(updatedMealPlan);
    
    // Reset form
    setNewMealName("");
    setNewMealCalories(0);
    setNewMealQuantity(1);
    setShowAddMealForm(false);
    
    toast({
      title: "Meal added",
      description: `${newMealName} has been added to your meal plan.`,
    });
  };
  
  // Function to remove a meal item
  const handleRemoveMeal = (mealType: string, index: number) => {
    if (!mealPlan) return;
    
    const updatedMealPlan = { ...mealPlan };
    updatedMealPlan[mealType] = [...updatedMealPlan[mealType]];
    const removedItem = updatedMealPlan[mealType][index];
    
    // Remove the item
    updatedMealPlan[mealType].splice(index, 1);
    
    // If this was the last item in this meal type, remove the meal type
    if (updatedMealPlan[mealType].length === 0) {
      delete updatedMealPlan[mealType];
    }
    
    // Update state
    setMealPlan(updatedMealPlan);
    
    toast({
      title: "Meal removed",
      description: `${removedItem.food} has been removed from your meal plan.`,
    });
  };

  // Handle dietary restriction toggle
  const handleRestrictionToggle = (value: string[]) => {
    setDietaryRestrictions(value);
  };
  
  // Handle allergy toggle
  const handleAllergyToggle = (key: keyof typeof allergies) => {
    setAllergies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300">Today's Meal Plan</CardTitle>
          <CardDescription>
            Customize your daily nutrition based on your preferences and goals
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Diet Type</label>
                <Select value={dietType} onValueChange={(value) => setDietType(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select diet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="low_carb">Low Carb</SelectItem>
                    <SelectItem value="low_sodium">Low Sodium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Total Calories: {totalCalories}
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs">1200</span>
                  <Slider
                    value={[totalCalories]}
                    min={1200}
                    max={3500}
                    step={100}
                    onValueChange={handleCaloriesChange}
                    className="flex-grow"
                  />
                  <span className="text-xs">3500</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Meal Type</label>
                <div className="flex items-center gap-3">
                  <Button 
                    variant={isVegetarian ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setIsVegetarian(true)}
                  >
                    <Carrot className="w-4 h-4" />
                    Vegetarian
                  </Button>
                  <Button 
                    variant={!isVegetarian ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsVegetarian(false)}
                  >
                    Non-Vegetarian
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Dietary Restrictions</label>
                <ToggleGroup 
                  type="multiple" 
                  variant="outline"
                  className="flex flex-wrap gap-2"
                  value={dietaryRestrictions}
                  onValueChange={handleRestrictionToggle}
                >
                  <ToggleGroupItem value="Gluten-free" className="text-xs">Gluten-free</ToggleGroupItem>
                  <ToggleGroupItem value="Dairy-free" className="text-xs">Dairy-free</ToggleGroupItem>
                  <ToggleGroupItem value="Nut-free" className="text-xs">Nut-free</ToggleGroupItem>
                  <ToggleGroupItem value="Vegan" className="text-xs">Vegan</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Allergies</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="gluten" 
                      checked={allergies.gluten}
                      onCheckedChange={() => handleAllergyToggle('gluten')}
                    />
                    <label htmlFor="gluten" className="text-sm">Gluten</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dairy" 
                      checked={allergies.dairy}
                      onCheckedChange={() => handleAllergyToggle('dairy')}
                    />
                    <label htmlFor="dairy" className="text-sm">Dairy</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="nuts" 
                      checked={allergies.nuts}
                      onCheckedChange={() => handleAllergyToggle('nuts')}
                    />
                    <label htmlFor="nuts" className="text-sm">Nuts</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="shellfish" 
                      checked={allergies.shellfish}
                      onCheckedChange={() => handleAllergyToggle('shellfish')}
                    />
                    <label htmlFor="shellfish" className="text-sm">Shellfish</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="eggs" 
                      checked={allergies.eggs}
                      onCheckedChange={() => handleAllergyToggle('eggs')}
                    />
                    <label htmlFor="eggs" className="text-sm">Eggs</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="soy" 
                      checked={allergies.soy}
                      onCheckedChange={() => handleAllergyToggle('soy')}
                    />
                    <label htmlFor="soy" className="text-sm">Soy</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {loading && (
            <div className="flex justify-center my-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 mb-2 rounded-full bg-blue-200"></div>
                <div className="text-sm text-muted-foreground">Updating meal plan...</div>
              </div>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive" className="my-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {mealPlan && !loading && (
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Your Daily Meals</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {getTotalCalories()} calories
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setShowAddMealForm(!showAddMealForm)}
                  >
                    <Plus className="w-4 h-4" />
                    {showAddMealForm ? "Cancel" : "Add Meal"}
                  </Button>
                </div>
              </div>
              
              {/* Add meal form */}
              {showAddMealForm && (
                <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border">
                  <h4 className="text-sm font-medium mb-3">Add Custom Meal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm mb-1">Food Name</label>
                      <Input 
                        value={newMealName}
                        onChange={e => setNewMealName(e.target.value)}
                        placeholder="e.g., Greek yogurt with honey"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Meal Type</label>
                      <Select value={newMealType} onValueChange={setNewMealType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          {mealPlan && Object.keys(mealPlan).map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                          <SelectItem value="snacks">snacks</SelectItem>
                          <SelectItem value="breakfast">breakfast</SelectItem>
                          <SelectItem value="lunch">lunch</SelectItem>
                          <SelectItem value="dinner">dinner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Quantity</label>
                      <Input 
                        type="number" 
                        value={newMealQuantity}
                        onChange={e => setNewMealQuantity(Number(e.target.value))}
                        min={0.1}
                        step={0.1}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Calories</label>
                      <Input 
                        type="number" 
                        value={newMealCalories}
                        onChange={e => setNewMealCalories(Number(e.target.value))}
                        min={1}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddMeal}>Add to Meal Plan</Button>
                </div>
              )}
              
              <Tabs defaultValue={Object.keys(mealPlan)[0] || "breakfast"}>
                <TabsList className="grid grid-cols-4 mb-4">
                  {Object.keys(mealPlan).map((meal) => (
                    <TabsTrigger key={meal} value={meal} className="capitalize">
                      {meal}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(mealPlan).map(([meal, items]) => (
                  <TabsContent key={meal} value={meal}>
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-4">
                      {items.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center py-3 border-b last:border-b-0"
                        >
                          <div>
                            <h4 className="font-medium">{item.food}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item['quantity (multiplier)']}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="block font-semibold">{item.calories} cal</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveMeal(meal, index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-gray-50 dark:bg-gray-900/20 flex justify-between">
          <p className="text-xs text-muted-foreground">Last updated: Today</p>
          <Button variant="ghost" size="sm">Export Plan</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MealPlan;
