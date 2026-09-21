import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  deleteHotel,
  getMyHotels,
  updateHotel,
  type Hotel,
} from "../api/hotelApi";
import { useAuth } from "../context/AuthContext";

const MyHotels = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    location: "",
    price: "",
    rate: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const loadHotels = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError("");

        const data = await getMyHotels();
        setHotels(data);
      } catch (error) {
        console.error("Error loading hotels:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your hotels."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, [user]);

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
              Please log in to manage your hotels.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
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
              Only hotel owners can manage hotels.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Back to Home
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const openEditModal = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setUpdateError("");
    setUpdateSuccess("");

    setEditForm({
      name: hotel.name || "",
      address: hotel.address || "",
      location: hotel.location || "",
      price: String(hotel.price || ""),
      rate: hotel.rate || "",
      image: hotel.image || "",
      description: hotel.description || "",
    });
  };

  const closeEditModal = () => {
    if (updateLoading) {
      return;
    }

    setEditingHotel(null);
    setUpdateError("");
    setUpdateSuccess("");
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setUpdateError("");
    setUpdateSuccess("");
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingHotel) {
      return;
    }

    setUpdateError("");
    setUpdateSuccess("");

    const name = editForm.name.trim();
    const address = editForm.address.trim();
    const location = editForm.location.trim();
    const image = editForm.image.trim();
    const description = editForm.description.trim();
    const price = Number(editForm.price);
    const rate = editForm.rate.trim();

    if (!name) {
      setUpdateError("Hotel name is required.");
      return;
    }

    if (!address) {
      setUpdateError("Hotel address is required.");
      return;
    }

    if (!location) {
      setUpdateError("Hotel location is required.");
      return;
    }

    if (
      !editForm.price ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setUpdateError("Please enter a valid price greater than 0.");
      return;
    }

    if (rate) {
      const rateNumber = Number(rate);

      if (
        !Number.isFinite(rateNumber) ||
        rateNumber < 0 ||
        rateNumber > 5
      ) {
        setUpdateError("Rating must be between 0 and 5.");
        return;
      }
    }

    setUpdateLoading(true);

    try {
      const updatedHotel = await updateHotel(
        editingHotel.id,
        {
          name,
          address,
          location,
          price,
          rate: rate || undefined,
          image: image || undefined,
          description: description || undefined,
        }
      );

      setHotels((previous) =>
        previous.map((hotel) =>
          hotel.id === updatedHotel.id
            ? updatedHotel
            : hotel
        )
      );

      setUpdateSuccess("Hotel updated successfully.");

      setTimeout(() => {
        setEditingHotel(null);
        setUpdateSuccess("");
      }, 800);
    } catch (error) {
      console.error("Error updating hotel:", error);

      setUpdateError(
        error instanceof Error
          ? error.message
          : "Unable to update hotel."
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) {
      return;
    }

    setDeleteLoading(true);
    setError("");

    try {
      await deleteHotel(deleteId);

      setHotels((previous) =>
        previous.filter((hotel) => hotel.id !== deleteId)
      );

      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting hotel:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete hotel."
      );

      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 px-5 pb-12 pt-25">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate("/hotel-dashboard")}
                className="mb-4 text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>

              <h1 className="text-3xl font-bold text-gray-900">
                My Hotels
              </h1>

              <p className="mt-2 text-gray-600">
                Manage the hotels you have listed on the platform.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/add-hotel")}
              className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              + Add Hotel
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center rounded-2xl bg-white shadow-sm">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
                <p className="mt-4 text-sm text-gray-600">
                  Loading your hotels...
                </p>
              </div>
            </div>
          ) : hotels.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                🏨
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                You have no hotels yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-600">
                Add your first hotel to start listing your property
                for guests.
              </p>

              <button
                type="button"
                onClick={() => navigate("/add-hotel")}
                className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Add Your First Hotel
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <div className="relative h-56 bg-gray-200">
                    {hotel.image ? (
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {hotel.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {hotel.location}
                        </p>
                      </div>

                      {hotel.rate && (
                        <div className="flex shrink-0 items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700">
                          <span>★</span>
                          <span>{hotel.rate}</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-lg font-semibold text-gray-900">
                      ${Number(hotel.price).toLocaleString()}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}
                        / night
                      </span>
                    </p>

                    {hotel.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                        {hotel.description}
                      </p>
                    )}

                    <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={() => openEditModal(hotel)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteId(hotel.id)}
                        className="flex-1 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              Delete Hotel?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Are you sure you want to delete this hotel? This
              action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Delete Hotel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingHotel && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-5 py-8">
          <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Hotel
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your hotel information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={updateLoading}
                className="text-2xl leading-none text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="space-y-5 p-6"
            >
              {updateError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {updateError}
                </div>
              )}

              {updateSuccess && (
                <div
                  role="status"
                  className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  {updateSuccess}
                </div>
              )}

              <div>
                <label
                  htmlFor="edit-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Hotel Name
                </label>

                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  value={editForm.name}
                  onChange={handleEditChange}
                  disabled={updateLoading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-address"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>

                  <input
                    id="edit-address"
                    name="address"
                    type="text"
                    value={editForm.address}
                    onChange={handleEditChange}
                    disabled={updateLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-location"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>

                  <input
                    id="edit-location"
                    name="location"
                    type="text"
                    value={editForm.location}
                    onChange={handleEditChange}
                    disabled={updateLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-price"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Price per Night
                  </label>

                  <input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={editForm.price}
                    onChange={handleEditChange}
                    disabled={updateLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-rate"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Rating
                  </label>

                  <input
                    id="edit-rate"
                    name="rate"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={editForm.rate}
                    onChange={handleEditChange}
                    disabled={updateLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-image"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Main Image URL
                </label>

                <input
                  id="edit-image"
                  name="image"
                  type="url"
                  value={editForm.image}
                  onChange={handleEditChange}
                  disabled={updateLoading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="edit-description"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={5}
                  disabled={updateLoading}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updateLoading}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateLoading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHotels;