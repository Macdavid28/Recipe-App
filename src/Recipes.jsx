import {useState} from "react"
import { useQuery } from "@tanstack/react-query";
export const Recipes = () => {
  const fetchRecipe = async () => {
    const random = "https://www.themealdb.com/api/json/v1/1/random.php";
    const response = await fetch(random);
    const data = await response.json();
    return data;
  };
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recipe"],
    queryFn: fetchRecipe,
  });
  return (
    <div>
      {isLoading && <h1>Loading...</h1>}
      {isError && <h1>Could not find recipe</h1>}
      {data?.meals.map((recipe) => (
        <h1>{recipe.strMeal} </h1>
      ))}
      <input type="text"  />
      <button onClick={refetch}>Goo </button>
    </div>
  );
};
