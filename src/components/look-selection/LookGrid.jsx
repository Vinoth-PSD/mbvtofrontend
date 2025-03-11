const LookCard = ({ look, onClick }) => (
  <button
    onClick={() => onClick(look)}
    className="relative group overflow-hidden rounded-lg shadow hover:shadow-lg transition-all duration-300"
  >
    <div className="aspect-square">
      <img
        src={look.image}
        alt="Look preview"
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
    </div>
  </button>
);

const LookGrid = ({ subcategory, onBack, onLookSelect }) => (
  <div className="border rounded-lg overflow-hidden shadow-lg">
    <h4 className="font-medium p-4 bg-main text-white flex justify-between items-center">
      <span>{subcategory.name}</span>
      <button 
        onClick={onBack}
        className="text-sm bg-white text-main px-3 py-1 rounded hover:bg-gray-100"
      >
        Back
      </button>
    </h4>
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subcategory.looks.map((look) => (
          <LookCard 
            key={look.id} 
            look={look} 
            onClick={onLookSelect}
          />
        ))}
      </div>
    </div>
  </div>
);

export default LookGrid; 