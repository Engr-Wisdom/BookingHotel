import heroImage from "../assets/heroImage.png";

const Hero = () => {
  return (
    <div className="relative z-0 h-screen w-full overflow-hidden">
      <img
        src={heroImage}
        alt="heroImage"
        className="h-full w-full object-cover"
      />

      <div className="absolute bottom-12 left-5 right-5 text-white sm:bottom-16 sm:left-10 sm:right-10 lg:bottom-20 lg:left-20 lg:right-auto">
        <button className="w-auto rounded-full bg-[#49B9FF80] px-4 py-2 text-xs font-medium sm:text-sm">
          The ultimate Hotel Experience
        </button>

        <div className="mt-4 max-w-full sm:max-w-xl lg:max-w-2xl">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Discover Your Perfect Getaway Destination
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 sm:text-base">
            Unparalleled luxury and comfort await at the world's most
            exclusive hotels and resorts. Start your journey today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;