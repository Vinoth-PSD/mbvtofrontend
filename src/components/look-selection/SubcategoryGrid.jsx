const SubcategoryCard = ({ subcategory, onClick }) => (
  <button
    onClick={() => onClick(subcategory)}
    className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <h4 className="font-medium p-3 bg-gray-50 border-b">
      {subcategory.name}
    </h4>
    <div className="p-4">
      <p className="text-gray-600">{subcategory.looks.length} looks available</p>
    </div>
  </button>
);

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