const Breadcrumb = ({ selectedCategory, selectedSubcategory, onCategoryClick, onSubcategoryClick }) => (
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
          {selectedCategory.name}
        </button>
      </>
    )}
    {selectedSubcategory && (
      <>
        <span className="text-gray-400">/</span>
        <span className="font-bold">{selectedSubcategory.name}</span>
      </>
    )}
  </div>
);

export default Breadcrumb; 