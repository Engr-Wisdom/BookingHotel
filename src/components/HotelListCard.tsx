import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

interface HotelCardProps {
  hotel: {
    id: number;

    img: string;

    name: string;

    address: string;

    reviews: string;

    location: string;

    amenities: {
      name: string;
    }[];

    rate: string;

    price: number;
  };
}

const HotelListCard = ({ hotel }: HotelCardProps) => {
  const navigate = useNavigate();

  const getAmenityIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "free wifi":
        return assets.freeWifiIcon;

      case "free breakfast":
        return assets.freeBreakfastIcon;

      case "room service":
        return assets.roomServiceIcon;

      default:
        return assets.homeIcon;
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row gap-5 rounded-2xl bg-white p-5 shadow-md hover:shadow-xl transition">
      <img
        src={hotel.img}
        alt={hotel.name}
        className="w-full sm:w-[280px] h-[220px] rounded-xl object-cover"/>

      <div
        className="flex-1 flex flex-col justify-between">
        <div>
          <div
            className="flex justify-between">
            <div>
              <h2
                className="text-2xl font-bold">
                {hotel.name}
              </h2>

              <p
                className="text-sm text-gray-500">
                {hotel.reviews}
              </p>
            </div>

            <div>⭐ {hotel.rate}</div>
          </div>

          <p
            className="mt-3 text-gray-500">
            📍 {hotel.address}
          </p>

          <p className="text-gray-600">{hotel.location}</p>

          <div
            className="mt-4 flex flex-wrap gap-3">
            {hotel.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-fullbg-gray-100 px-3 py-2 text-sm">
                <img src={getAmenityIcon(item.name)} className="w-4" />

                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-6 flex justify-between items-center">
          <h3
            className="text-2xl font-bold">
            ${hotel.price}
            <span
              className="text-sm text-gray-500">
              / night
            </span>
          </h3>

          <button
            onClick={() => navigate(`/hotel/${hotel.id}`)}
            className="rounded-full bg-gray-800 px-5 py-2 text-white * hover:bg-gray-700 cursor-pointer">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelListCard;
