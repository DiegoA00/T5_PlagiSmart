import { IoIosNotificationsOutline } from "react-icons/io";

function Header() {
  return (
    <header className="bg-white text-black flex justify-between items-center w-full px-10 py-2">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl font-bold text-[#003595]">PLAGISMART</h1>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <IoIosNotificationsOutline className='w-6 h-6' />
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