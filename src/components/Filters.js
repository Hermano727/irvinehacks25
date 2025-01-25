import React, { useState } from "react";
import "../styles/filters.css";

export default function MultiFilters() {
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Complete list of items
  const items = [
    { name: "Food Banks", category: "Food" },
    { name: "Shelters", category: "Shelter" },
    { name: "Hospitals", category: "Health" },
    // Add more items as needed
  ];

  // List of filter categories
  const filters = ["Food", "Shelter", "Health"];

  const handleFilterButtonClick = (selectedCategory) => {
    if (selectedFilters.includes(selectedCategory)) {
      // Remove the category from selected filters
      const updatedFilters = selectedFilters.filter(
        (category) => category !== selectedCategory
      );
      setSelectedFilters(updatedFilters);
    } else {
      // Add the category to selected filters
      setSelectedFilters([...selectedFilters, selectedCategory]);
    }
  };

  // Filter items based on selected categories
  const filteredItems =
    selectedFilters.length === 0
      ? items
      : items.filter((item) => selectedFilters.includes(item.category));

  return (
    <div>
      <div className="buttons-container">
        {filters.map((category, idx) => (
          <button
            onClick={() => handleFilterButtonClick(category)}
            className={`button ${
              selectedFilters.includes(category) ? "active" : ""
            }`}
            key={`filters-${idx}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="items-container">
        {filteredItems.map((item, idx) => (
          <div key={`item-${idx}`} className="item">
            <p>{item.name}</p>
            <p className="category">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
