import { useState,useEffect } from "react"
export const Recipe =() =>{
    const random ="https://www.themealdb.com/api/json/v1/1/random.php"
    const [foodName,setFoodName] = useState()
    
    useEffect(()=>{
fetch(random).then((res)=>{
    return res.json()
}).then(data => setFoodName(data))
    },[])
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
    const fetchApi  =async() =>{
        const result = await fetch(url);
        const data = await result.json()
        setFoodName(data)
        console.log(data)
        return data
     }
    return(<div>
<input onChange={(e)=>{setFoodName(e.target.value)}} />
    
    <button onClick={fetchApi} >Search </button>
    {foodName && (foodName.meals.map((meal)=>(
        <div>
            <h1>{meal.strMeal} </h1>
        
    
        </div>
        
    )))}
    </div>)
}