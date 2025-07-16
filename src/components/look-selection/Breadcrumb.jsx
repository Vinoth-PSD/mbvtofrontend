const Breadcrumb = ({ selectedCategory, selectedSubcategory, selectedSubSubcategory, onCategoryClick, onSubcategoryClick, onSubSubcategoryClick }) => {
  // Format names to be more readable
  const formatName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      <button 
        onClick={() => onCategoryClick(null)}
        className={`text-main hover:underline ${!selectedCategory && 'font-bold'}`}
      >
        Categories
      </button>
      {selectedCategory && (
        <>
          <span className="text-gray-400">/</span>
          <button 
            onClick={() => onSubcategoryClick(null)}
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
            onClick={() => onSubSubcategoryClick(null)}
            className={`text-main hover:underline ${!selectedSubSubcategory && 'font-bold'}`}
          >
            {formatName(selectedSubcategory.name)}
          </button>
        </>
      )}
      {selectedSubSubcategory && (
        <>
          <span className="text-gray-400">/</span>
          <span className="font-bold">{formatName(selectedSubSubcategory.name)}</span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb; 