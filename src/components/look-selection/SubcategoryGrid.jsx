const SubcategoryCard = ({ subcategory, onClick }) => {
  // Format the subcategory name to be more readable
  const formatSubcategoryName = (name) => {
    // Convert camelCase to spaces and handle special cases
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  // Check if this subcategory has subcategories or looks
  const hasSubcategories = subcategory.subcategories && subcategory.subcategories.length > 0;
  const hasLooks = subcategory.looks && subcategory.looks.length > 0;

  return (
    <button
      onClick={() => onClick(subcategory)}
      className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <h4 className="font-medium p-3 bg-gray-50 border-b">
        {formatSubcategoryName(subcategory.name)}
      </h4>
      <div className="p-4">
        <p className="text-gray-600">
          {hasSubcategories 
            ? `${subcategory.subcategories.length} subcategories` 
            : hasLooks 
              ? `${subcategory.looks.length} looks available`
              : 'No content available'
          }
        </p>
      </div>
    </button>
  );
};

const SubcategoryGrid = ({ subcategories, onSubcategorySelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {subcategories.map((subcat) => (
      <SubcategoryCard 
        key={subcat.id} 
        subcategory={subcat} 
        onClick={onSubcategorySelect}
      />
    ))}
  </div>
);

export default SubcategoryGrid; 