import { useState } from "react";
import sunIcon from "./assets/icons8-sun-96.png";
import moonIcon from "./assets/icons8-moon-96.png";
import searchIcon from "./assets/icons8-search.svg";
import { useQuery } from "@tanstack/react-query";
export const Recipes = () => {
  const [foodName, setFoodName] = useState("");
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
  //Fetch Random  Recipe Function
  const fetchRandom = async () => {
    const random = "https://www.themealdb.com/api/json/v1/1/random.php";
    const response = await fetch(random);
    const data = await response.json();
    return data;
  };
  // Search Recipe Function
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
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recipe"],
    queryFn: fetchRecipe,
    enabled: false,
  });
  const { data: random } = useQuery({
    queryKey: ["random"],
    queryFn: fetchRandom,
  });
  const [isDark, setIsDark] = useState(false);
  const lightToggle = () => {
    setIsDark(!isDark);
  };
  const darkToggle = () => {
    setIsDark(true);
    console.log(isDark);
  };
  return (
    <div
      className={`${
        isDark
          ? "dark:bg-black  my-[15%]  mx-[30%] w-[500px] rounded-md text-white"
          : "bg-primary my-[15%]  mx-[30%] w-[500px] rounded-md"
      }`}
    >
      {/* Header Section */}
      <div
        className={`${
          isDark
            ? "flex  items-center justify-between border-b w-full p-4 border-white"
            : "flex  items-center justify-between border-b border-black w-full p-4"
        }`}
      >
        <h1 className="font-cookie text-[40px]">Recipe App </h1>
        {isDark ? (
          <img
            src={sunIcon}
            className="h-8"
            alt="moon icon"
            onClick={lightToggle}
          />
        ) : (
          <img
            src={moonIcon}
            className="h-8"
            alt="moon icon"
            onClick={darkToggle}
          />
        )}
      </div>
      {/* Conditional Message */}
      {isError && (
        <h1 className="font-cookie text-[35px] text-center">
          Could not find recipe
        </h1>
      )}
      {isLoading && (
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold mb-4">Loading...</h1>
          <div className="w-8 h-8 border-4 border-dotted rounded-full animate-spin border-black"></div>
        </div>
      )}
      {/* Search Section */}
      <span className="flex gap-4 items-center justify-center">
        <input
          type="text"
          onChange={(e) => {
            setFoodName(e.target.value);
          }}
          className={`${
            isDark
              ? "p-2 bg-transparent  shadow-sm shadow-white my-4 rounded-[3rem] placeholder:font-cookie text-[20px] outline-none"
              : "p-2 bg-transparent  shadow-sm shadow-black my-4 rounded-[3rem] placeholder:font-cookie text-[20px] outline-none"
          }`}
          placeholder="Search Recipe"
        />
        <button
          className={`${
            isDark
              ? "p-3 shadow-sm shadow-white rounded-full"
              : "p-3 shadow-sm shadow-black rounded-full"
          }`}
          onClick={() => {
            refetch();
          }}
        >
          <img src={searchIcon} className="h-6 " alt="" />
        </button>
      </span>
      {!isError &&
        !foodName &&
        random?.meals.map((random) => (
          <div className="" key={random.idMeal}>
            <h1 className="font-cookie text-[40px] text-center">
              {random.strMeal}{" "}
            </h1>
            <div className="flex justify-center ">
              <img
                src={random.strMealThumb}
                className="h-[300px] rounded-md "
                alt="Dish Pic"
              />
            </div>
            <div className="flex gap-4 justify-center ">
              <button className="text-white bg-black p-4  my-2 rounded-md font-cookie text-[30px]">
                Ingredients
              </button>
              <button className="text-white bg-black p-4  my-2 rounded-md font-cookie text-[30px]">
                Instructions
              </button>
            </div>
          </div>
        ))}
      {!isError &&
        data?.meals.map((recipe) => (
          <div className="">
            <h1>{recipe.strMeal} </h1>
            <img src={recipe.strMealThumb} alt="" className="h-[300px] " />
            <div className="recipe-buttons">
              <button className="bg-black text-white"> Ingredients</button>
              <button>Instructions</button>
            </div>
          </div>
        ))}
    </div>
  );
};
