import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
export const Recipes = () => {
  const [foodName, setFoodName] = useState("");
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
  const fetchRecipe = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error");
      const recipeData = await response.json();
      if (!recipeData.meals) {
        throw new Error("No meal found");
      }
      return recipeData;
    } catch (error) {
      console.error(error);
    }
  };
  const fetchRandom = async () => {
    const random = "https://www.themealdb.com/api/json/v1/1/random.php";
    const response = await fetch(random);
    const data = await response.json();
    return data;
  };
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recipe"],
    queryFn: fetchRecipe,
    enabled: false,
  });
  const { data: random } = useQuery({
    queryKey: ["random"],
    queryFn: fetchRandom,
  });
  return (
    <div>
      {isLoading && <h1>Loading...</h1>}
      {isError && <h1>Could not find recipe</h1>}
      {!isError && random?.meals.map((random) => <h1>{random.strMeal} </h1>)}
      {!isError && ( data?.meals.map((recipe) => <h1>{recipe.strMeal} </h1>))}
      <input
        type="text"
        onChange={(e) => {
          setFoodName(e.target.value);
        }}
      />
      <button
        onClick={() => {
          refetch();
        }}
      >
        Search{" "}
      </button>
    </div>
  );
};
