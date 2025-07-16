const SubSubcategoryCard = ({ subSubcategory, onClick }) => {
  // Format the sub-subcategory name to be more readable
  const formatSubSubcategoryName = (name) => {
    // Convert camelCase to spaces and handle special cases
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  // Safety check for looks array
  const looksCount = subSubcategory.looks ? subSubcategory.looks.length : 0;

  return (
    <button
      onClick={() => onClick(subSubcategory)}
      className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <h4 className="font-medium p-3 bg-gray-50 border-b">
        {formatSubSubcategoryName(subSubcategory.name)}
      </h4>
      <div className="p-4">
        <p className="text-gray-600">Click to view images</p>
      </div>
    </button>
  );
};

const SubSubcategoryGrid = ({ subSubcategories, onSubSubcategorySelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {subSubcategories.map((subSubcat) => (
      <SubSubcategoryCard 
        key={subSubcat.id} 
        subSubcategory={subSubcat} 
        onClick={onSubSubcategorySelect}
      />
    ))}
  </div>
);

export default SubSubcategoryGrid; 