import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createHotel } from "../api/hotelApi";
import { useAuth } from "../context/AuthContext";

interface FormErrors {
  name?: string;
  address?: string;
  location?: string;
  price?: string;
  rate?: string;
  images?: string;
  description?: string;
}

const AddHotel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    location: "",
    price: "",
    rate: "",
    images: ["", "", "", ""],
    description: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-5 py-16">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Login Required
            </h1>

            <p className="mt-3 text-gray-600">
              Please log in to add a hotel.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 cursor-pointer rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Go to Login
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (user.role !== "hotel_owner") {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-5 py-16">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Access Denied
            </h1>

            <p className="mt-3 text-gray-600">
              Only hotel owners can add hotels.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 cursor-pointer rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Back to Home
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setError("");
    setSuccess("");
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData((previous) => {
      const images = [...previous.images];
      images[index] = value;

      return {
        ...previous,
        images,
      };
    });

    setFormErrors((previous) => ({
      ...previous,
      images: undefined,
    }));

    setError("");
    setSuccess("");
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    const name = formData.name.trim();
    const address = formData.address.trim();
    const location = formData.location.trim();
    const price = Number(formData.price);
    const rate = formData.rate.trim();

    if (!name) {
      errors.name = "Hotel name is required.";
    }

    if (!address) {
      errors.address = "Hotel address is required.";
    }

    if (!location) {
      errors.location = "Hotel location is required.";
    }

    if (!formData.price || !Number.isFinite(price) || price <= 0) {
      errors.price = "Please enter a valid price greater than 0.";
    }

    if (rate) {
      const rateNumber = Number(rate);

      if (
        !Number.isFinite(rateNumber) ||
        rateNumber < 0 ||
        rateNumber > 5
      ) {
        errors.rate = "Rating must be between 0 and 5.";
      }
    }

    const images = formData.images.map((image) => image.trim());

    if (images.some((image) => !image)) {
      errors.images = "Please provide all 4 hotel image URLs.";
    } else if (
      images.some((image) => {
        try {
          new URL(image);
          return false;
        } catch {
          return true;
        }
      })
    ) {
      errors.images = "Please provide valid image URLs.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    const name = formData.name.trim();
    const address = formData.address.trim();
    const location = formData.location.trim();
    const description = formData.description.trim();
    const price = Number(formData.price);
    const rate = formData.rate.trim();

    const images = formData.images.map((image) => image.trim());

    setLoading(true);

    try {
      await createHotel({
        name,
        address,
        location,
        price,
        rate: rate || undefined,
        image: images[0],
        images,
        description: description || undefined,
      });

      setSuccess("Hotel added successfully.");

      setFormData({
        name: "",
        address: "",
        location: "",
        price: "",
        rate: "",
        images: ["", "", "", ""],
        description: "",
      });

      setFormErrors({});

      setTimeout(() => {
        navigate("/my-hotels");
      }, 1000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while adding the hotel."
      );
    } finally {
      setLoading(false);
    }
  };

  const imageLabels = [
    "Main Image",
    "Additional Image 1",
    "Additional Image 2",
    "Additional Image 3",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pt-10">
      <Navbar />

      <main className="flex-1 px-5 pb-12 pt-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate("/hotel-dashboard")}
              className="mb-4 cursor-pointer text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold text-gray-900">
              Add Hotel
            </h1>

            <p className="mt-2 text-gray-600">
              Add your hotel and make it available for guests to
              discover and book.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Hotel Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter hotel name"
                  disabled={loading}
                  className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-1 disabled:bg-gray-100 ${
                    formErrors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  }`}
                />

                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>

                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter hotel address"
                    disabled={loading}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-1 disabled:bg-gray-100 ${
                      formErrors.address
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    }`}
                  />

                  {formErrors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Lagos, Nigeria"
                    disabled={loading}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-1 disabled:bg-gray-100 ${
                      formErrors.location
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    }`}
                  />

                  {formErrors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Price per Night
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 150"
                    disabled={loading}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-1 disabled:bg-gray-100 ${
                      formErrors.price
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    }`}
                  />

                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="rate"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Rating
                  </label>

                  <input
                    id="rate"
                    name="rate"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rate}
                    onChange={handleChange}
                    placeholder="e.g. 4.5"
                    disabled={loading}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-1 disabled:bg-gray-100 ${
                      formErrors.rate
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    }`}
                  />

                  {formErrors.rate ? (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.rate}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Enter a rating from 0 to 5.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <h2 className="text-sm font-medium text-gray-700">
                    Hotel Images
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Add exactly 4 images. The first image will be used as
                    the main hotel image.
                  </p>
                </div>

                <div className="space-y-4">
                  {formData.images.map((image, index) => (
                    <div key={index}>
                      <label
                        htmlFor={`image-${index}`}
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        {imageLabels[index]}
                      </label>

                      <input
                        id={`image-${index}`}
                        type="url"
                        value={image}
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                        placeholder="https://example.com/hotel-image.jpg"
                        disabled={loading}
                        className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-1 disabled:bg-gray-100 ${
                          formErrors.images
                            ? "border-red-300 focus:border-gray-900 focus:ring-gray-900"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {formErrors.images && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.images}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your hotel, rooms, services, and other features..."
                  rows={6}
                  disabled={loading}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/my-hotels")}
                  disabled={loading}
                  className="cursor-pointer rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Adding Hotel..." : "Add Hotel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddHotel;