import heroImage from "../assets/heroImage.png"

const Hero = () => {
    return (
        <div className="w-full h-screen relative z-0">
            <img src={heroImage} alt="heroImage" className="w-full h-full"/>

            <div className="absolute bottom-20 left-20 text-white">
                <button className="bg-[#49B9FF80] w-55 p-2 px-4 text-sm rounded-full cursor-pointer">
                    The ultimate Hotel Experience
                </button>

                <div className="w-125 border-solid">
                    <h1 className="text-2xl sm:text-5xl font-bold mt-5">Discover Your Perfect Getaway Destination</h1>
                    <p className="text-sm mt-5">
                        Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. 
                        Start your journey today.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Hero