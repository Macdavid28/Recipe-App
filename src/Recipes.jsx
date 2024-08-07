import { useState } from "react";
import sunIcon from "./assets/icons8-sun-96.png";
import moonIcon from "./assets/icons8-moon-96.png";
import blackSearchIcon from "./assets/icons8-search-black.svg";
import whiteSearchIcon from "./assets/icons8-search-white.svg";
import heartIcon from "./assets/icons8-heart-50.png";
import deleteIcon from "./assets/icons8-delete.svg";
import { useQuery } from "@tanstack/react-query";

export const Recipes = () => {
  const [foodName, setFoodName] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [searched, setSearched] = useState(false);
  const [instructionsShown, setInstructionsShown] = useState({});
  const [ingredientsShown, setIngredientsShown] = useState({});
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [showFavorites, setShowFavorites] = useState(false);

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;

  // Fetch Random Recipe Function
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

  // food search function
  const handleSearch = () => {
    if (foodName.trim() !== "") {
      refetch();
      setFoodName("");
      setSearched(true);
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
  const toggleInstruction = (id) => {
    setInstructionsShown((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setIngredientsShown((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  // Function Toggle Show Ingredients
  const toggleIngredients = (id) => {
    setIngredientsShown((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setInstructionsShown((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  // Function to handle favorite button click
  const handleFavorite = (meal) => {
    const updatedFavorites = favorites.find((fav) => fav.idMeal === meal.idMeal)
      ? favorites.filter((fav) => fav.idMeal !== meal.idMeal)
      : [...favorites, meal];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Function to toggle favorites list display
  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <div
      className={`${
        isDark
          ? "dark:bg-black my-[1%] mx-[30%] w-[500px] rounded-md text-white"
          : "bg-primary my-[1%] mx-[30%] w-[500px] rounded-md"
      }`}
    >
      {/* Header Section */}
      <div
        className={`${
          isDark
            ? "flex items-center justify-between border-b w-full p-4 border-white"
            : "flex items-center justify-between border-b border-black w-full p-4"
        }`}
      >
        <h1 className="font-cookie text-[40px]">Recipe App</h1>
        {isDark ? (
          <img
            src={sunIcon}
            className="h-8 cursor-pointer"
            alt="sun icon"
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
          <h1 className="font-cookie text-xl font-bold mb-4">Loading</h1>
          <div className="w-8 h-8 border-4 border-dotted rounded-full animate-spin border-black"></div>
        </div>
      )}

      {/* Search Section */}
      <span className="flex gap-4 items-center justify-center">
        <input
          type="text"
          value={foodName}
          onChange={(e) => {
            setFoodName(e.target.value);
          }}
          className={`${
            isDark
              ? "p-1 bg-transparent border border-white my-4 rounded-[3rem] placeholder:font-cookie placeholder:text-white placeholder:p-4 text-[20px] outline-none"
              : "p-1 bg-transparent shadow-sm shadow-black my-4 rounded-[3rem] placeholder:font-cookie placeholder:p-4 text-[20px] outline-none"
          }`}
          placeholder="Search Recipe"
          required
        />
        <button
          className={`${
            isDark
              ? "p-2 border border-white rounded-full"
              : "p-2 shadow-sm shadow-black rounded-full"
          }`}
          onClick={handleSearch}
        >
          {isDark ? (
            <img src={whiteSearchIcon} className="h-6" alt="search icon" />
          ) : (
            <img src={blackSearchIcon} className="h-6" alt="search icon" />
          )}
        </button>
      </span>

      {/* Random Meal Section */}
      {!isError &&
        !searched &&
        random?.meals.map((random) => (
          <div className="" key={random.idMeal}>
            <h1 className="font-cookie text-[30px] text-center">
              {random.strMeal}
            </h1>
            <div className="relative flex justify-center">
              <img
                src={random.strMealThumb}
                alt="Dish Pic"
                className="h-[250px] rounded-md"
              />
              <img
                src={heartIcon}
                alt="heart icon"
                className={`absolute top-2 right-32 h-8 p-1 rounded-full cursor-pointer ${
                  favorites.find((fav) => fav.idMeal === random.idMeal)
                    ? "bg-gray-400"
                    : "bg-gray-100"
                }`}
                onClick={() => handleFavorite(random)}
              />
            </div>
            <p className="font-cookie text-[25px] text-center py-1">
              {random.strTags}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className={`${
                  isDark
                    ? "bg-white text-black p-3 my-4 rounded-md font-cookie text-[30px]"
                    : "text-white bg-black p-3 my-4 rounded-md font-cookie text-[30px]"
                }`}
                onClick={() => toggleIngredients(random.idMeal)}
              >
                Ingredients
              </button>
              <button
                className={`${
                  isDark
                    ? "bg-white text-black p-3 my-4 rounded-md font-cookie text-[30px]"
                    : "text-white bg-black p-3 my-4 rounded-md font-cookie text-[30px]"
                }`}
                onClick={() => toggleInstruction(random.idMeal)}
              >
                Instructions
              </button>
            </div>
            {/* Cooking Instructions */}
            {instructionsShown[random.idMeal] && (
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
            {ingredientsShown[random.idMeal] && (
              <div>
                <h2 className="font-cookie text-center font-bold text-[30px] p-4">
                  Cooking Ingredients
                </h2>
                <ul className="grid grid-cols-3 gap-2 font-cookie text-[20px] ml-10">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(
                    (num) =>
                      random[`strIngredient${num}`] && (
                        <span key={num}>
                          <li className="p-1">
                            {random[`strIngredient${num}`]}
                          </li>
                          <li className="p-1">{random[`strMeasure${num}`]}</li>
                        </span>
                      )
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}

      {/* Searched Meals */}
      {!isError &&
        searched &&
        data?.meals.map((recipe) => (
          <div className="" key={recipe.idMeal}>
            <h1 className="font-cookie text-[30px] text-center">
              {recipe.strMeal}
            </h1>
            <div className="relative flex justify-center">
              <img
                src={recipe.strMealThumb}
                alt="Dish Pic"
                className="h-[250px] rounded-md"
              />
              <img
                src={heartIcon}
                alt="heart icon"
                className={`absolute top-2 right-32 h-8 p-1 bg-gray-100 rounded-full cursor-pointer ${
                  favorites.find((fav) => fav.idMeal === recipe.idMeal)
                    ? "bg-gray-300"
                    : "bg-gray-100"
                }`}
                onClick={() => handleFavorite(recipe)}
              />
            </div>
            <p className="font-cookie text-[25px] text-center py-1">
              {recipe.strTags}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className={`${
                  isDark
                    ? "bg-white text-black p-3 my-4 rounded-md font-cookie text-[30px]"
                    : "text-white bg-black p-3 my-4 rounded-md font-cookie text-[30px]"
                }`}
                onClick={() => toggleIngredients(recipe.idMeal)}
              >
                Ingredients
              </button>
              <button
                className={`${
                  isDark
                    ? "bg-white text-black p-3 my-4 rounded-md font-cookie text-[30px]"
                    : "text-white bg-black p-3 my-4 rounded-md font-cookie text-[30px]"
                }`}
                onClick={() => toggleInstruction(recipe.idMeal)}
              >
                Instructions
              </button>
            </div>
            {/* Cooking Instructions */}
            {instructionsShown[recipe.idMeal] && (
              <div>
                <h2 className="font-cookie text-center font-bold text-[30px] p-4">
                  Cooking Instructions
                </h2>
                <p className="font-cookie text-[25px] px-8 pb-4">
                  {recipe.strInstructions}
                </p>
              </div>
            )}
            {/* Cooking Ingredients */}
            {ingredientsShown[recipe.idMeal] && (
              <div>
                <h2 className="font-cookie text-center font-bold text-[30px] p-4">
                  Cooking Ingredients
                </h2>
                <ul className="grid grid-cols-3 gap-2 font-cookie text-[20px] ml-10">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(
                    (num) =>
                      recipe[`strIngredient${num}`] && (
                        <span key={num}>
                          <li className="p-1">
                            {recipe[`strIngredient${num}`]}
                          </li>
                          <li className="p-1">{recipe[`strMeasure${num}`]}</li>
                        </span>
                      )
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      {/* Toggle Favorites Button */}
      <div className="flex justify-center">
        <button
          className={`${
            isDark
              ? "bg-white text-black px-8 mb-4 rounded-md font-cookie text-[30px]"
              : "bg-black text-white px-[100px] mb-4 rounded-md font-cookie text-[30px]"
          }`}
          onClick={toggleShowFavorites}
        >
          Favorites
        </button>
      </div>

      {/* Favorites List */}
      {showFavorites && (
        <div>
          <h2 className="font-cookie text-center font-bold text-[30px] p-4">
            Favorites
          </h2>
          {favorites.length === 0 ? (
            <p className="font-cookie text-[25px] text-center">
              No favorites yet.
            </p>
          ) : (
            favorites.map((favorite) => (
              <div className="" key={favorite.idMeal}>
                <h1 className="font-cookie text-[30px] text-center">
                  {favorite.strMeal}
                </h1>
                <div className="relative flex justify-center">
                  <img
                    src={favorite.strMealThumb}
                    alt="Dish Pic"
                    className="h-[250px] rounded-md"
                  />
                  {showFavorites ? (
                    <img
                      src={deleteIcon}
                      alt="delete icon"
                      className="absolute top-2 right-32 h-8 p-1 bg-gray-100 rounded-full cursor-pointer b"
                      onClick={() => handleFavorite(favorite)}
                    />
                  ) : (
                    <img
                      src={heartIcon}
                      alt="heart icon"
                      className="absolute top-2 right-32 h-8 p-1 bg-gray-100 rounded-full cursor-pointer b"
                      onClick={() => handleFavorite(favorite)}
                    />
                  )}
                </div>
                <p className="font-cookie text-[25px] text-center py-1">
                  {favorite.strTags}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    className={`${
                      isDark
                        ? "bg-white text-black p-3 my-4 rounded-md font-cookie text-[30px]"
                        : "text-white bg-black p-3 my-4 rounded-md font-cookie text-[30px]"
                    }`}
                    onClick={() => toggleIngredients(favorite.idMeal)}
                  >
                    Ingredients
                  </button>
                  <button
                    className={`${
                      isDark
                        ? "bg-white text-black p-3 my-4 rounded-md font-cookie text-[30px]"
                        : "text-white bg-black p-3 my-4 rounded-md font-cookie text-[30px]"
                    }`}
                    onClick={() => toggleInstruction(favorite.idMeal)}
                  >
                    Instructions
                  </button>
                </div>
                {/* Cooking Instructions */}
                {instructionsShown[favorite.idMeal] && (
                  <div>
                    <h2 className="font-cookie text-center font-bold text-[30px] p-4">
                      Cooking Instructions
                    </h2>
                    <p className="font-cookie text-[25px] px-8 pb-4">
                      {favorite.strInstructions}
                    </p>
                  </div>
                )}
                {/* Cooking Ingredients */}
                {ingredientsShown[favorite.idMeal] && (
                  <div>
                    <h2 className="font-cookie text-center font-bold text-[30px] p-4">
                      Cooking Ingredients
                    </h2>
                    <ul className="grid grid-cols-3 gap-2 font-cookie text-[20px] ml-10">
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(
                        (num) =>
                          favorite[`strIngredient${num}`] && (
                            <span key={num}>
                              <li className="p-1">
                                {favorite[`strIngredient${num}`]}
                              </li>
                              <li className="p-1">
                                {favorite[`strMeasure${num}`]}
                              </li>
                            </span>
                          )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
