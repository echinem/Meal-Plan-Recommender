
import MealPlan from "../components/MealPlan";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <header className="py-4 px-4 mb-4">
        <h1 className="text-3xl font-bold text-center text-blue-800 dark:text-blue-300">MyMealPlanner</h1>
      </header>
      <MealPlan />
    </div>
  );
};

export default Index;
