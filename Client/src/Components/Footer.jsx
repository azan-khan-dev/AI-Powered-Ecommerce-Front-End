import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";
import { useSelector } from "react-redux";

function Footer() {
  // SAFE selector (no crash)
  const siteSettings = useSelector(
    (state) => state.settings?.siteSettings
  );

  return (
    <footer className="bg-black text-white px-4 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16">

        {/* Exclusive */}
        <div>
          <h3 className="text-lg font-semibold mb-6">
            {siteSettings?.siteName}
          </h3>
          <p className="text-sm mb-4">Subscribe</p>
          <p className="text-sm mb-4">Get 10% off your first order</p>

          <div className="relative w-[180px] mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent border border-white rounded w-50 px-3 py-1.5 text-sm outline-none h-10"
            />
            <button
              className="absolute left-38.5 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-1.5 text-xl rounded h-9  
              cursor-pointer transition duration-300 hover:bg-white hover:text-black hover:shadow-md hover:shadow-white/30"
            >
              <VscSend />
            </button>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Support</h3>
          <p className="text-sm mb-5">
            NCBA&E University FLC Campus <br /> Lahore, Pakistan.
          </p>
          <p className="text-sm mb-5">
            {siteSettings?.contactEmail}
          </p>
          <p className="text-sm mb-5">
            {siteSettings?.contactPhone}
          </p>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Account</h3>
          <ul className="text-sm">
            <li className="mb-4">
              <Link to="/profile" className="relative inline-block group">
                Profile
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/login" className="relative inline-block group">
                Login
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/cart" className="relative inline-block group">
                Cart
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/wishlist" className="relative inline-block group">
                Wishlist
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/products/our-products" className="relative inline-block group">
                Shop
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Link */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Quick Link</h3>
          <ul className="text-sm">
            <li className="mb-4">
              <Link to="/privacy-policy" className="relative inline-block group">
                Privacy Policy
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/terms-of-use" className="relative inline-block group">
                Terms Of Use
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/faq" className="relative inline-block group">
                FAQ
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/contact" className="relative inline-block group">
                Contact
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Download App */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Download App</h3>
          <p className="text-xs text-gray-400 mb-4">
            Save $3 with App New User Only
          </p>

          <div className="flex gap-2 mb-4 flex-wrap sm:flex-nowrap">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://yourwebsite.com"
              alt="QR Code"
              className="w-20 h-20 object-contain"
            />
            <div className="flex flex-col justify-between gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="w-32"
              />
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="w-32"
              />
            </div>
          </div>

          <div className="flex gap-6 mt-2">
            <FaFacebookF className="text-white text-xl hover:text-blue-500 transition" />
            <CiTwitter className="text-white text-xl hover:text-sky-400 transition" />
            <FaInstagram className="text-white text-xl hover:text-pink-500 transition" />
            <FaLinkedinIn className="text-white text-xl hover:text-blue-400 transition" />
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-10 border-t border-gray-800 pt-4">
        © Copyright Rimel 2022. All rights reserved
      </div>
    </footer>
  );
}

export default Footer;
