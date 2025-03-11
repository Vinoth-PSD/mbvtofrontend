const CategoryCard = ({ category, onClick }) => (
  <button
    onClick={() => onClick(category)}
    className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <h3 className="text-xl font-semibold p-4 bg-main text-white">
      {category.name}
    </h3>
    <div className="p-4 text-left">
      <p className="text-gray-600">
        {category.subcategories ? 
          `${category.subcategories.length} subcategories` : 
          `${category.looks.length} looks`}
      </p>
    </div>
  </button>
);

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