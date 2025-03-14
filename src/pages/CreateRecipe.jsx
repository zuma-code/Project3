import React, { useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function CreateRecipe()  {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get the logged-in user
console.log(user);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    cuisine: "",
    dishType: "",    
    level:"",
    duration: "",
    servings: "",
    ingredients: "",
    instructions: "",
  });

  // Define enum options from the schema
  const dishTypeOptions =  ["Vegetarian", "Vegan", "Meat", "Fish", "Seafood", "Dessert", "Other"];
  const levelOptions = ["Easy Peasy", "Amateur Chef", "UltraPro Chef"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("You must be logged in to create a recipe.");
      return;
    }

    const token = localStorage.getItem("token"); // Get token for authentication
   
    const requestBody = {
      ...formData,
      ingredients: formData.ingredients.split("\n"),
      instructions: formData.instructions.split("\n").map((step) => step.trim()),
     author: user._id, // Include the user ID in the request
    };
    
    console.log("Sending data:", requestBody);
    
    fetch("http://localhost:5005/api/recipes", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token for authentication
      
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            console.error("Error response:", text);
            throw new Error("Server responded with an error");
          });
        }
        return response.json();
      })
      .then(data => {
        console.log("Success:", data);
        navigate("/");
      })
      .catch(error => {
        console.error("Error creating recipe:", error.message);
        // Show an error message to the user
      });
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Create a New Recipe</h1>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-6">
        <input type="text" name="title" placeholder="Title" className="input input-bordered w-full mb-3" onChange={handleChange} required />
        <input type="text" name="image" placeholder="Image URL" className="input input-bordered w-full mb-3" onChange={handleChange} required/>
        <input type="text" name="cuisine" placeholder="Cuisine" className="input input-bordered w-full mb-3" onChange={handleChange} required />
        
        {/* Dish Type Dropdown (enum) */}
        <select 
          name="dishType" 
          className="select select-bordered w-full mb-3" 
          onChange={handleChange} 
          value={formData.dishType}
          required
        >
          <option value="" disabled>Select Dish Type</option>
          {dishTypeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        
        {/* Level Dropdown (enum) */}
        <select 
          name="level" 
          className="select select-bordered w-full mb-3" 
          onChange={handleChange} 
          value={formData.level}
          required
        >
          <option value="" disabled>Select Difficulty Level</option>
          {levelOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        
        <input type="number" name="duration" placeholder="Duration (min)" className="input input-bordered w-full mb-3" onChange={handleChange} required />
        <input type="number" name="servings" placeholder="Servings" className="input input-bordered w-full mb-3" onChange={handleChange} required />
        <textarea name="ingredients" placeholder="List the ingredients in columns." className="textarea textarea-bordered w-full mb-3" onChange={handleChange} required />
        <textarea name="instructions" placeholder="Provide the cooking steps in sequential order (1, 2, 3, etc.)." className="textarea textarea-bordered w-full mb-3" onChange={handleChange} required />
        <button type="submit" className="btn btn-primary w-full">Create Recipe</button>
      </form>
    </div>
  );
};

export default CreateRecipe;