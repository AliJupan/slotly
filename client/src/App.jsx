import { useCallback, useEffect, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function App() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("30");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [creatingSlot, setCreatingSlot] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/slots`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load available slots.");
      }

      setSlots(data.slots ?? data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Make sure your backend is running."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });

  const handleCreateSlot = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const startsAt = new Date(`${slotDate}T${slotTime}`);

    if (!slotDate || !slotTime || Number.isNaN(startsAt.getTime())) {
      setError("Please select a valid date and start time.");
      return;
    }

    if (startsAt <= new Date()) {
      setError("The slot must be in the future.");
      return;
    }

    setCreatingSlot(true);

    try {
      const response = await fetch(`${API_URL}/api/slots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startsAt: startsAt.toISOString(),
          durationMinutes: Number(slotDuration),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create the slot.");
      }

      setSuccess("Time slot created successfully!");
      setSlotDate("");
      setSlotTime("");
      setSlotDuration("30");

      await loadSlots();
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again."
          : err.message,
      );
    } finally {
      setCreatingSlot(false);
    }
  };

  const handleBooking = async (event) => {
    event.preventDefault();

    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }

    setError("");
    setSuccess("");
    setBooking(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book this slot.");
      }

      setSuccess(
        `Your appointment is booked for ${formatDate(
          selectedSlot.startsAt,
        )} at ${formatTime(selectedSlot.startsAt)}.`,
      );

      setSelectedSlot(null);
      setName("");
      setEmail("");

      await loadSlots();
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again."
          : err.message,
      );
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold tracking-tight">
            Slot<span className="text-indigo-600">ly</span>
          </a>

          <span className="text-sm text-slate-500">
            Simple appointment booking
          </span>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
        {/* Create slot section */}
        <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Manage availability
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Create a time slot
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add an appointment time for people to book.
            </p>
          </div>

          <form
            onSubmit={handleCreateSlot}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <label
                htmlFor="slotDate"
                className="mb-2 block text-sm font-medium"
              >
                Date
              </label>

              <input
                id="slotDate"
                type="date"
                value={slotDate}
                onChange={(event) => setSlotDate(event.target.value)}
                min={new Date().toLocaleDateString("en-CA")}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="slotTime"
                className="mb-2 block text-sm font-medium"
              >
                Start time
              </label>

              <input
                id="slotTime"
                type="time"
                value={slotTime}
                onChange={(event) => setSlotTime(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="slotDuration"
                className="mb-2 block text-sm font-medium"
              >
                Duration
              </label>

              <select
                id="slotDuration"
                value={slotDuration}
                onChange={(event) => setSlotDuration(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
                <option value="240">240 minutes</option>
                <option value="480">480 minutes</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={creatingSlot}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingSlot ? "Creating..." : "Create slot"}
              </button>
            </div>
          </form>
        </section>

        {/* Notifications */}
        {success && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <p className="font-semibold">Success!</p>
            <p className="mt-1">{success}</p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Available slots */}
        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                Find your time
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Available time slots
              </h2>
            </div>

            <button
              type="button"
              onClick={loadSlots}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-100 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh slots"}
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              Loading available slots...
            </div>
          ) : slots.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <h3 className="text-lg font-semibold">No available slots</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create a new slot above, or check again later.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map((slot) => {
                const isBooked = Boolean(slot.booking);
                const isSelected = selectedSlot?.id === slot.id;

                return (
                  <article
                    key={slot.id}
                    className={`rounded-2xl border bg-white p-6 transition ${
                      isSelected
                        ? "border-indigo-500 ring-2 ring-indigo-100"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isBooked
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {isBooked ? "Booked" : "Available"}
                      </span>

                      <span className="text-xs text-slate-400">
                        {slot.durationMinutes} min
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-500">
                      {formatDate(slot.startsAt)}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight">
                      {formatTime(slot.startsAt)}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {slot.durationMinutes}-minute appointment
                    </p>

                    <button
                      type="button"
                      disabled={isBooked}
                      onClick={() => {
                        setSelectedSlot(isSelected ? null : slot);
                        setError("");
                        setSuccess("");
                      }}
                      className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isBooked
                          ? "cursor-not-allowed bg-slate-100 text-slate-400"
                          : isSelected
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {isBooked
                        ? "Already booked"
                        : isSelected
                          ? "Cancel selection"
                          : "Book this slot"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Booking form */}
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">Book your appointment</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Select an available slot above, then provide your contact details.
          </p>

          {selectedSlot ? (
            <>
              <div className="my-6 rounded-xl bg-indigo-50 p-5">
                <p className="text-sm font-medium text-indigo-700">
                  Selected appointment
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {formatDate(selectedSlot.startsAt)}
                </p>

                <p className="mt-1 text-slate-700">
                  {formatTime(selectedSlot.startsAt)}
                  {" · "}
                  {selectedSlot.durationMinutes} minutes
                </p>
              </div>

              <form
                onSubmit={handleBooking}
                className="grid gap-5 sm:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    maxLength={254}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={booking}
                    className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {booking ? "Confirming booking..." : "Confirm booking"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="font-medium text-slate-700">No slot selected</p>

              <p className="mt-2 text-sm text-slate-500">
                Choose an available time slot above to continue.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <a href="/" className="text-lg font-bold text-slate-900">
            Slot<span className="text-indigo-600">ly</span>
          </a>

          <p>
            © {new Date().getFullYear()} Slotly. Simple appointment booking.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
