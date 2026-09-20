import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import HotelListCard from "../components/HotelListCard";
import Footer from "../components/Footer";

import { getHotels } from "../api/hotelApi";

interface Amenity {
  name: string;
}

interface Hotel {
  id: number;
  name: string;
  address: string;
  location: string;
  reviews: string;
  price: number;
  rate: string;
  image: string;
  img: string;
  amenities: Amenity[];
}

const Hotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAmenities, setSelectedAmenities] =
    useState<string[]>([]);

  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotels();

        const formattedHotels: Hotel[] = data.map(
          (hotel: any) => ({
            ...hotel,

            img: hotel.image,

            amenities: (hotel.amenities || []).map(
              (item: string) => ({
                name: item,
              })
            ),
          })
        );

        setHotels(formattedHotels);
        setFilteredHotels(formattedHotels);
      } catch (error) {
        console.error("Error loading hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    let result = [...hotels];

    // Amenity filter
    if (selectedAmenities.length > 0) {
      result = result.filter((hotel) =>
        selectedAmenities.every((selected) =>
          hotel.amenities.some(
            (amenity) => amenity.name === selected
          )
        )
      );
    }

    // Price filter
    if (priceRange === "low") {
      result = result.filter(
        (hotel) =>
          hotel.price >= 100 &&
          hotel.price <= 300
      );
    }

    if (priceRange === "medium") {
      result = result.filter(
        (hotel) =>
          hotel.price > 300 &&
          hotel.price <= 500
      );
    }

    if (priceRange === "high") {
      result = result.filter(
        (hotel) => hotel.price > 500
      );
    }

    // Sorting
    if (sortBy === "low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortBy === "high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    setFilteredHotels(result);
  }, [
    selectedAmenities,
    priceRange,
    sortBy,
    hotels,
  ]);

  const handleAmenityChange = (
    amenity: string
  ) => {
    if (
      selectedAmenities.includes(amenity)
    ) {
      setSelectedAmenities(
        selectedAmenities.filter(
          (item) => item !== amenity
        )
      );
    } else {
      setSelectedAmenities([
        ...selectedAmenities,
        amenity,
      ]);
    }
  };

  const clearFilters = () => {
    setSelectedAmenities([]);
    setPriceRange("");
    setSortBy("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {loading ? (
        // Loading state
        <main
          className="
            flex
            min-h-[calc(100vh-180px)]
            items-center
            justify-center
            bg-white
            px-5
            pt-24
          "
        >
          <div className="flex flex-col items-center justify-center">
            <div
              className="
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-gray-200
                border-t-gray-800
              "
            />

            <p
              className="
                mt-5
                text-lg
                font-medium
                text-gray-600
              "
            >
              Loading hotels...
            </p>
          </div>
        </main>
      ) : (
        // Hotels page
        <main
          className="
            min-h-screen
            bg-gray-100
            px-10
            py-32
            lg:px-20
          "
        >
          <div className="mb-10">
            <h1
              className="
                text-3xl
                font-bold
                text-gray-800
                lg:text-4xl
              "
            >
              Hotel Rooms
            </h1>

            <p className="mt-3 text-gray-600">
              Discover amazing hotels around
              the world and choose your perfect
              stay.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-8
              lg:grid-cols-[1fr_350px]
            "
          >
            {/* HOTEL LIST */}

            <div className="space-y-5">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <HotelListCard
                    key={hotel.id}
                    hotel={hotel}
                  />
                ))
              ) : (
                <p
                  className="
                    rounded-xl
                    bg-white
                    p-8
                    text-center
                  "
                >
                  No hotels found.
                </p>
              )}
            </div>

            {/* FILTER SIDEBAR */}

            <div
              className="
                h-fit
                rounded-2xl
                bg-white
                p-6
                shadow-md
              "
            >
              <div
                className="
                  mb-6
                  flex
                  items-center
                  justify-between
                "
              >
                <h2 className="text-xl font-bold">
                  Filters
                </h2>

                <button
                  onClick={clearFilters}
                  className="
                    text-sm
                    text-blue-600
                    hover:text-blue-800
                  "
                >
                  Clear
                </button>
              </div>

              {/* AMENITIES */}

              <div className="mb-7">
                <h3
                  className="
                    mb-4
                    font-semibold
                  "
                >
                  Amenities
                </h3>

                {[
                  "Free Wifi",
                  "Free Breakfast",
                  "Room Service",
                ].map((item) => (
                  <label
                    key={item}
                    className="
                      mb-3
                      flex
                      cursor-pointer
                      gap-3
                    "
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(
                        item
                      )}
                      onChange={() =>
                        handleAmenityChange(item)
                      }
                    />

                    {item}
                  </label>
                ))}
              </div>

              {/* PRICE */}

              <div className="mb-7">
                <h3 className="mb-4 font-semibold">
                  Price
                </h3>

                {[
                  {
                    label: "$100 - $300",
                    value: "low",
                  },
                  {
                    label: "$300 - $500",
                    value: "medium",
                  },
                  {
                    label: "$500+",
                    value: "high",
                  },
                ].map((item) => (
                  <label
                    key={item.value}
                    className="
                      mb-3
                      flex
                      cursor-pointer
                      gap-3
                    "
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={
                        priceRange ===
                        item.value
                      }
                      onChange={() =>
                        setPriceRange(
                          item.value
                        )
                      }
                    />

                    {item.label}
                  </label>
                ))}
              </div>

              {/* SORT */}

              <div>
                <h3
                  className="
                    mb-4
                    font-semibold
                  "
                >
                  Sort By
                </h3>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    p-3
                  "
                >
                  <option value="">
                    Select
                  </option>

                  <option value="low">
                    Price Low to High
                  </option>

                  <option value="high">
                    Price High to Low
                  </option>
                </select>
              </div>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default Hotels;