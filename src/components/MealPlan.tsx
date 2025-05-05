import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Check, X, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  const fetchMealPlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulating API call with a timeout - replace this with your actual API call
      setTimeout(() => {
        // Example meal plan data - replace with your actual data fetching
        const mockData = {
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

        setMealPlan(mockData);
        setLoading(false);
        toast({
          title: "Meal plan generated!",
          description: "Your daily meal plan has been created successfully.",
        });
      }, 1500);
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
                    <SelectItem value="high_protein">High Protein</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
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
            </div>
            
            <div className="flex flex-col justify-end space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Dietary Restrictions</label>
                <div className="flex flex-wrap gap-2">
                  {["Gluten-free", "Dairy-free", "Nut-free", "Vegan"].map((restriction) => (
                    <Button 
                      key={restriction} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <span className="w-4 h-4 rounded-full border flex items-center justify-center">
                        {Math.random() > 0.5 ? <Check className="w-3 h-3" /> : null}
                      </span>
                      {restriction}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={fetchMealPlan} 
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? "Generating Plan..." : "Generate Meal Plan"}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
              <X className="w-5 h-5 mr-2 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          {mealPlan && (
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
