const Breadcrumb = ({ selectedCategory, selectedSubcategory, selectedSubSubcategory, onCategoryClick, onSubcategoryClick, onSubSubcategoryClick }) => {
  // Format names to be more readable
  const formatName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  // Handle category click - clear all selections
  const handleCategoryClick = () => {
    onCategoryClick(null);
    onSubcategoryClick(null);
    onSubSubcategoryClick(null);
  };

  // Handle subcategory click - clear subcategory and subsubcategory
  const handleSubcategoryClick = () => {
    onSubcategoryClick(null);
    onSubSubcategoryClick(null);
  };

  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      <button 
        onClick={handleCategoryClick}
        className={`text-main hover:underline ${!selectedCategory && 'font-bold'}`}
      >
        Categories
      </button>
      {selectedCategory && (
        <>
          <span className="text-gray-400">/</span>
          <button 
            onClick={handleCategoryClick}
            className={`text-main hover:underline ${!selectedSubcategory && 'font-bold'}`}
          >
            {formatName(selectedCategory.name)}
          </button>
        </>
      )}
      {selectedSubcategory && (
        <>
          <span className="text-gray-400">/</span>
          <button 
            onClick={handleSubcategoryClick}
            className={`text-main hover:underline ${!selectedSubSubcategory && 'font-bold'}`}
          >
            {formatName(selectedSubcategory.name)}
          </button>
        </>
      )}
      {selectedSubSubcategory && (
        <>
          <span className="text-gray-400">/</span>
          <button 
            onClick={() => onSubSubcategoryClick(null)}
            className="text-main hover:underline font-bold"
          >
            {formatName(selectedSubSubcategory.name)}
          </button>
        </>
      )}
    </div>
  );
};

export default Breadcrumb; 