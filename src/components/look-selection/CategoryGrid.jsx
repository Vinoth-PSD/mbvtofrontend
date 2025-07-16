const CategoryCard = ({ category, onClick }) => {
  // Format the category name to be more readable
  const formatCategoryName = (name) => {
    // Convert camelCase to spaces (e.g., "ByRegion" -> "By Region")
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <button
      onClick={() => onClick(category)}
      className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <h3 className="text-xl font-semibold p-4 bg-main text-white">
        {formatCategoryName(category.name)}
      </h3>
      <div className="p-4 text-left">
        <p className="text-gray-600">
          {category.subcategories ? 
            `${category.subcategories.length} subcategories` : 
            'Click to view images'}
        </p>
      </div>
    </button>
  );
};

const CategoryGrid = ({ categories, onCategorySelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {categories.map((category) => (
      <CategoryCard 
        key={category.id} 
        category={category} 
        onClick={onCategorySelect}
      />
    ))}
  </div>
);

export default CategoryGrid; 