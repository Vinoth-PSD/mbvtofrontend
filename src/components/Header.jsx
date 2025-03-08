const Header = () => {
  return (
    <header className="bg-mindfulWhite shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[75px]">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <img 
              src="https://gray-desert-0c1e9470f.4.azurestaticapps.net/assets/mindfulBeautyLogo-CwlZGCiT.png"
              alt="Mindful Beauty" 
              className="h-12 w-auto"
            />
          </div>

          {/* Centered title */}
          <div className="flex-1 text-center">
            <h1 className="text-[24px] font-semibold text-mindfulBlack">Bridal Look Generator</h1>
          </div>

          {/* Mobile menu button - pushed to the right */}
          <div className="flex-shrink-0 md:hidden">
            <button className="hamburger p-2">
              <input type="checkbox" />
              <svg viewBox="0 0 32 32">
                <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                <path className="line" d="M7 16 27 16"></path>
              </svg>
            </button>
          </div>

          {/* Empty div for desktop to maintain spacing */}
          <div className="hidden md:block flex-shrink-0 w-12"></div>
        </div>
      </div>
    </header>
  );
};

export default Header; 