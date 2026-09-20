import { assets } from "../assets/assets";

type HotelCardProps = {
    hotel: {
        img: string;
        name: string;
        address: string;
        reviews: string;
        location: string;
        amenities: string[];
        rate: string;
        price: number;
    };
};


const HotelCard = ({ hotel }: HotelCardProps) => {

    return (
        <div 
            className="
            overflow-hidden rounded-2xl bg-white shadow-md 
            transition-all duration-300 hover:-translate-y-2 
            hover:shadow-xl
            "
        >

            <img 
                src={hotel.img} 
                alt={hotel.name} 
                className="w-full h-[220px] object-cover"
            />


            <div className="space-y-3 p-5">

                {/* Hotel Name + Rating */}
                <div className="flex justify-between items-start">

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {hotel.name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {hotel.reviews}
                        </p>
                    </div>


                    <div className="flex items-center gap-1">

                        <img 
                            src={assets.starIconFilled} 
                            alt="star"
                            className="w-5"
                        />

                        <span className="font-medium">
                            {hotel.rate}
                        </span>

                    </div>

                </div>



                {/* Address */}
                <div className="flex items-center gap-2 text-gray-500">

                    <img 
                        src={assets.locationIcon} 
                        alt="location" 
                        className="w-4"
                    />

                    <span className="text-sm">
                        {hotel.address}
                    </span>

                </div>



                {/* Location */}
                <p className="text-gray-600 text-sm">
                    {hotel.location}
                </p>



                {/* Amenities */}
                <div className="flex flex-wrap gap-2">

                    {hotel.amenities.map((item, index) => (

                        <span 
                            key={index}
                            className="
                            bg-gray-100 text-gray-600 
                            text-xs px-3 py-1 
                            rounded-full
                            "
                        >
                            {item}
                        </span>

                    ))}

                </div>



                {/* Price + Button */}
                <div className="flex items-center justify-between pt-3">

                    <h3 className="text-lg font-bold text-gray-800">

                        ${hotel.price}

                        <span className="text-sm font-normal text-gray-500">
                            {" "} / night
                        </span>

                    </h3>


                    <button 
                        className="
                        rounded-2xl bg-gray-800 
                        px-4 py-2 text-sm 
                        font-medium text-white 
                        transition hover:bg-gray-700 
                        cursor-pointer
                        "
                    >
                        View Details
                    </button>

                </div>


            </div>

        </div>
    );
};


export default HotelCard;