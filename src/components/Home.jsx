import { useState } from "react";
import SearchResult from "./SearchResult";

export default function Home() {
  const [source, setSource] = useState("melolo");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {

     let url = "";

    switch (source) {
      case "melolo":
        url = `https://api.sansekai.my.id/api/melolo/search?query=${query}&limit=10`;
        break;

      case "dramabox":
        url = `https://api.sansekai.my.id/api/dramabox/search?query=${query}`;
        break;

      case "flickreels":
        url = `https://api.sansekai.my.id/api/flickreels/search?query=${query}`;
        break;

      default:
        return;
    }

    
    const res = await fetch(url);
    const json = await res.json();

      setResult(
      source === "melolo"
        ? json?.data?.search_data || []
        : json?.data || json || []
    );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Series Search</h1>

        {/* SOURCE PICKER */}
        <div className="flex gap-2 mb-3">
          {["melolo", "dramabox", "flickreels"].map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`px-4 py-2 rounded border
                ${
                  source === s
                    ? "bg-sky-700 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="flex gap-2 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Search
          </button>
        </div>

        {loading && <p>Loading...</p>}

        <SearchResult source={source} data={result} />
      </div>
    </div>
  );
}
