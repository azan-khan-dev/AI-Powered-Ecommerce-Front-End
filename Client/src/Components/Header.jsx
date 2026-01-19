import { Link, useLocation } from "react-router-dom";
import { CiHeart, CiUser, CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser, FaRegStar } from "react-icons/fa6";
import { FiShoppingBag } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { SlLogout } from "react-icons/sl";
import { useSelector } from "react-redux";
import { selectOrderCount, selectCancelledCount } from "../Features/Orders/OrdersSlice";
import { useState, useEffect, useRef } from "react";
import { useSearchProductsQuery } from "../redux/apis/homeApis";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/apis/authApis";
import { userNotExist } from "../redux/slices/authSlice";
import { clearCart } from "../Features/cart/cartSlice";
import { clearWishlist } from "../Features/Wishlist/WishlistSlice";
import { clearOrders } from "../Features/Orders/OrdersSlice";


function Header() {
  const location = useLocation();
  const isUserNavigated = location.key !== "default";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const wishlistCount = useSelector((state) => state.wishlist.count || 0);
  const orderCount = useSelector(selectOrderCount);
  const cancelledCount = useSelector(selectCancelledCount);
  const siteSettings = useSelector((state) => state.settings.siteSettings);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileSearchRef = useRef(null);
  const { data: searchResults, isLoading: isSearching } = useSearchProductsQuery(
    { q: searchQuery },
    { skip: !searchQuery.trim() }
  );

  const user = useSelector((state) => state.auth.user);

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`relative px-3 py-1 rounded transition-all duration-300
        ${isUserNavigated && location.pathname === path
          ? "bg-red-500 text-white"
          : "hover:text-red-500"
        }
        after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
        after:bg-red-500 after:w-0 hover:after:w-full
        after:transition-all after:duration-300`}
    >
      {label}
    </Link>
  );

  // Search input handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle Enter key press for search
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      // Close any open dropdowns and clear search state
      setSearchQuery("");
      setShowMobileSearch(false);
    }
  };

  const handleLogout = () => {
    logoutApi().then(() => {
      dispatch(userNotExist());
      dispatch(clearCart());
      dispatch(clearWishlist());
      dispatch(clearOrders());
    });
    navigate("/");
  };

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setShowMobileSearch(false);
      }
    };

    if (showMobileSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileSearch]);

  return (
    <header className="sticky top-0 z-50 shadow-sm border-b bg-white">
      {/* Top Banner */}


      {/* Main Header */}
      <div className="max-w-7xl mx-auto py-6 px-4 flex items-center justify-between bg-white">
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-bold">
          {siteSettings?.siteName}        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex gap-10 text-sm font-quicksand font-semibold">
          {navLink("/", "Home")}
          {navLink("/contact", "Contact")}
          {navLink("/about", "About")}
          {navLink("/signup", "Sign Up")}
        </nav>

        {/* Right: Search + Icons */}
        <div className="flex items-center gap-4 relative">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden hover:text-red-500 transition text-2xl"
          >
            <CiSearch />
          </button>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div ref={mobileSearchRef} className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50 p-4">
              <div className="relative bg-gray-100 rounded-md px-4 py-2 transition-all duration-300 hover:ring-2 hover:ring-red-500 focus-within:ring-2 focus-within:ring-red-600">
                <input
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search products..."
                  className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
                  autoFocus
                />
                <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-xl cursor-pointer" />

                {/* Mobile Suggestions */}
                {searchQuery && searchResults && searchResults.data && searchResults.data.length > 0 && (
                  <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
                    {searchResults.data.slice(0, 5).map((item) => (
                      <Link
                        key={item._id}
                        to={`/product/${item._id}`}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setQuery("");
                          setSearchQuery("");
                          setShowMobileSearch(false);
                        }}
                      >
                        <img
                          src={item.images[0]?.url}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                          <p className="text-sm text-gray-600">${item.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search Desktop */}
          <div className="hidden md:flex relative bg-gray-100 rounded-md px-4 py-2 w-[300px]
  transition-all duration-300
  hover:ring-2 hover:ring-red-500
  focus-within:ring-2 focus-within:ring-red-600">

            <input
              type="text"
              value={query}
              onChange={handleSearch}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
            />
            <CiSearch className="text-black text-2xl cursor-pointer ml-2" />

            {/* Suggestions */}
            {searchQuery && searchResults && searchResults.data && searchResults.data.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
                {searchResults.data.slice(0, 5).map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setQuery("");
                      setSearchQuery("");
                    }}
                  >
                    <img
                      src={item.images[0]?.url}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {user && (
            <>
              {/* Wishlist & Cart */}
              <Link to="/wishlist" className="relative hover:text-red-500 transition text-3xl">
                <CiHeart />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative hover:text-red-500 transition text-3xl">
                <IoCartOutline />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative group hidden md:block">
                <button className="hover:text-red-500 transition text-3xl focus:outline-none">
                  <CiUser />
                </button>

                <div className="opacity-0 invisible group-hover:visible group-hover:opacity-100 
    absolute right-0 mt-2 w-48 bg-black/55 backdrop-blur-md rounded-md transition-all duration-300 z-50">

                  {/* Admin only */}
                  {user?.role === "admin" ? (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-white text-sm hover:bg-red-500 hover:rounded-md transition"
                    >
                      <FaRegUser className="text-lg" /> Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      {/* Normal users only */}
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-white text-sm hover:bg-red-500 hover:rounded-md transition"
                      >
                        <CiUser className="text-lg" /> My profile
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center justify-between gap-2 px-4 py-2 text-white text-sm hover:bg-red-500 hover:rounded-md transition"
                      >
                        <div className="flex items-center gap-2">
                          <FiShoppingBag className="text-lg" />
                          <span>My orders</span>
                        </div>
                        {orderCount > 0 && (
                          <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {orderCount}
                          </span>
                        )}
                      </Link>

                      <Link
                        to="/cancellations"
                        className="flex items-center justify-between gap-2 px-4 py-2 text-white text-sm hover:bg-red-500 hover:rounded-md transition"
                      >
                        <div className="flex items-center gap-2">
                          <MdOutlineCancel className="text-lg" />
                          <span>My cancellations</span>
                        </div>
                        {cancelledCount > 0 && (
                          <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {cancelledCount}
                          </span>
                        )}
                      </Link>
                    </>
                  )}

                  {/* Logout for all */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-white text-sm hover:bg-red-500 hover:rounded-md transition"
                  >
                    <SlLogout className="text-lg" /> Logout
                  </button>
                </div>
              </div>


            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
