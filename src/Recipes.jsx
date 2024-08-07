import { useState } from "react";
import sunIcon from "./assets/icons8-sun-96.png";
import moonIcon from "./assets/icons8-moon-96.png";
import searchIcon from "./assets/icons8-search.svg";
import heartIcon from "./assets/icons8-heart-50.png";
import { useQuery } from "@tanstack/react-query";

export const Recipes = () => {
  const [foodName, setFoodName] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
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
  // Query Function for search recipe
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recipe"],
    queryFn: fetchRecipe,
    enabled: false,
  });
  // Query Function for random recipe
  const { data: random } = useQuery({
    queryKey: ["random"],
    queryFn: fetchRandom,
  });
  const handleSearch = () => {
    if (foodName.trim() !== "") {
      refetch();
      setFoodName("");
    }
  };
  // Function Toggle Light Mode
  const lightToggle = () => {
    setIsDark(!isDark);
  };
  // Function Toggle Dark Mode
  const darkToggle = () => {
    setIsDark(true);
    console.log(isDark);
  };
  // Function Toggle Show Instruction
  const toggleInstruction = () => {
    setShowInstructions(!showInstructions);
  };
  return (
    <div
      className={`${
        isDark
          ? "dark:bg-black  my-[1%]  mx-[30%] w-[500px] rounded-md text-white"
          : "bg-primary my-[1%] mx-[30%] w-[500px] rounded-md"
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
            className="h-8 cursor-pointer"
            alt="moon icon"
            onClick={lightToggle}
          />
        ) : (
          <img
            src={moonIcon}
            className="h-8 cursor-pointer"
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
        <div className="flex justify-center gap-4 items-center">
          <h1 className="text-xl font-bold mb-4">Loading</h1>
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
              ? "p-2 bg-transparent  shadow-sm shadow-white my-4 rounded-[3rem] placeholder:font-cookie placeholder:text-white text-[20px]  outline-none"
              : "p-2 bg-transparent  shadow-sm shadow-black my-4 rounded-[3rem] placeholder:font-cookie text-[20px] outline-none"
          }`}
          placeholder="Search Recipe"
          required
        />
        <button
          className={`${
            isDark
              ? "p-3 shadow-sm shadow-white rounded-full"
              : "p-3 shadow-sm shadow-black rounded-full"
          }`}
          onClick={handleSearch}
        >
          <img src={searchIcon} className="h-6 " alt="" />
        </button>
      </span>
      {/* Random Meals  */}
      {!isError &&
        !foodName &&
        random?.meals.map((random) => (
          <div className="" key={random.idMeal}>
            <h1 className="font-cookie text-[40px] text-center">
              {random.strMeal}
            </h1>
            <div className="relative flex justify-center ">
              <img
                src={random.strMealThumb}
                className="h-[250px] rounded-md "
                alt="Dish Pic"
              />
              <img
                src={heartIcon}
                alt=""
                className="absolute top-2 right-32 h-10 p-1  bg-gray-100 rounded-full cursor-pointer"
              />
            </div>
            <div className="flex gap-4 justify-center ">
              <button
                className={`${
                  isDark
                    ? "bg-white text-black p-3  my-4 rounded-md font-cookie text-[30px]"
                    : "text-white bg-black p-3  my-4 rounded-md font-cookie text-[30px]"
                }`}
              >
                Ingredients
              </button>
              <button
                className={`${
                  isDark
                    ? "bg-white text-black p-3  my-4 rounded-md font-cookie text-[30px]"
                    : "text-white bg-black p-3  my-4 rounded-md font-cookie text-[30px]"
                }`}
                onClick={toggleInstruction}
              >
                Instructions
              </button>
            </div>
            {/* Cooking Instructions */}
            {showInstructions && (
              <div>
                <h2 className="font-cookie text-center font-bold text-[30px] p-4">
                  Cooking Instructions
                </h2>
                <p className="font-cookie text-[25px] px-8 pb-4">
                  {random.strInstructions}
                </p>
              </div>
            )}
            {/* Cooking Ingredients */}

            <h2 className="font-cookie text-center font-bold text-[30px] p-4">
              Cooking Ingredients
            </h2>
            <ul className="grid grid-cols-3 gap-2 font-cookie text-[20px] ml-10">
              <span>
                <li className="p-1 ">{random?.strIngredient1} </li>
                <li className="p-1"> {random?.strMeasure1} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient2} </li>
                <li className="p-1">Qty: {random?.strMeasure2} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient3} </li>
                <li className="p-1"> {random?.strMeasure3} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient4} </li>
                <li className="p-1"> {random?.strMeasure4} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient5} </li>
                <li className="p-1"> {random?.strMeasure5} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient6} </li>
                <li className="p-1"> {random?.strMeasure6} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient7} </li>
                <li className="p-1"> {random?.strMeasure7} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient8} </li>
                <li className="p-1"> {random?.strMeasure8} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient9} </li>
                <li className="p-1"> {random?.strMeasure9} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient10} </li>
                <li className="p-1">{random.strMeasure10} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient11} </li>
                <li className="p-1"> {random?.strMeasure11} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient12} </li>
                <li className="p-1"> {random?.strMeasure12} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient13} </li>
                <li className="p-1"> {random?.strMeasure13} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient14} </li>
                <li className="p-1"> {random?.strMeasure14} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient15} </li>
                <li className="p-1"> {random?.strMeasure15} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient16} </li>
                <li className="p-1"> {random?.strMeasure16} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient17} </li>
                <li className="p-1"> {random?.strMeasure17} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient18} </li>
                <li className="p-1"> {random?.strMeasure18} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient19} </li>
                <li className="p-1"> {random?.strMeasure19} </li>
              </span>
              <span>
                <li className="p-1">{random?.strIngredient20} </li>
                <li className="p-1">{random.strMeasure20} </li>
              </span>
            </ul>
          </div>
        ))}
      {/* Searched Meals */}
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
