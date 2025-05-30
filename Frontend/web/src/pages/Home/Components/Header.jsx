import React from 'react';
import { IoIosNotificationsOutline } from "react-icons/io";

function Header() {
  return (
    <header className="bg-white text-black p-4 flex justify-between items-center shadow">
      <div className="flex items-center">
        {/* Replace with actual logo image */}
        <img src="/path/to/anecacao-logo.png" alt="Anecacao Logo" className="h-8" />
        
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative">
            <IoIosNotificationsOutline className='w-6 h-6'/>
        </div>
        <div className="flex items-center">
          {/* Replace with image user */}
          <img src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" alt="User" className="h-8 w-10 rounded-full" />
          <span className="ml-2 text-sm">Jose Jose</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
