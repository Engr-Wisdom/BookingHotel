import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 px-8 py-16 text-white sm:px-16 lg:px-24">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

        {/* Logo section */}
        <div className="space-y-5">
          <img src={assets.logo} alt="logo" className="w-40" />

          <p className="leading-7 text-gray-400">
            Discover the world's most extraordinary places to stay,
            from boutique hotels to luxury villas and private islands.
          </p>

          <div className="flex gap-4">
            <img
              src={assets.instagramIcon}
              alt="Instagram"
              className="w-6 cursor-pointer transition hover:scale-110"
            />

            <img
              src={assets.twitterIcon}
              alt="Twitter"
              className="w-6 cursor-pointer transition hover:scale-110"
            />

            <img
              src={assets.facebookIcon}
              alt="Facebook"
              className="w-6 cursor-pointer transition hover:scale-110"
            />

            <img
              src={assets.linkendinIcon}
              alt="LinkedIn"
              className="w-6 cursor-pointer transition hover:scale-110"
            />
          </div>
        </div>

        {/* Company section */}
        <div>
          <h2 className="mb-5 text-lg font-semibold">COMPANY</h2>

          <ul className="space-y-3 text-gray-400">
            <li className="cursor-pointer hover:text-white">About</li>
            <li className="cursor-pointer hover:text-white">Career</li>
            <li className="cursor-pointer hover:text-white">Press</li>
            <li className="cursor-pointer hover:text-white">Blog</li>
            <li className="cursor-pointer hover:text-white">Partners</li>
          </ul>
        </div>

        {/* Support section */}
        <div>
          <h2 className="mb-5 text-lg font-semibold">SUPPORT</h2>

          <ul className="space-y-3 text-gray-400">
            <li className="cursor-pointer hover:text-white">
              Help Center
            </li>

            <li className="cursor-pointer hover:text-white">
              Safety Information
            </li>

            <li className="cursor-pointer hover:text-white">
              Cancellation Options
            </li>

            <li className="cursor-pointer hover:text-white">
              Contact Us
            </li>

            <li className="cursor-pointer hover:text-white">
              Accessibility
            </li>
          </ul>
        </div>

        {/* Newsletter section */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold">STAY UPDATED</h2>

          <p className="leading-7 text-gray-400">
            Subscribe to our newsletter for travel inspiration and
            special offers.
          </p>

          <div className="flex overflow-hidden rounded-2xl bg-gray-800">
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-transparent px-5 py-3 outline-none"
            />

            <button className="bg-blue-500 px-5 transition hover:bg-blue-600">
              <img
                src={assets.arrowIcon}
                alt="arrow"
                className="w-5"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
        <p>© 2026 QuickStay. All rights reserved.</p>
        
        <ul className="flex items-center gap-5">
            <li>Privacy</li>
            <li>Terms</li>
            <li>Sitemap</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;