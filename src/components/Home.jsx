import { useEffect, useState } from "react";
import SearchResult from "./SearchResult";

export default function Home() {
  const [source, setSource] = useState("melolo");
  const [query, setQuery] = useState("");

  const [latestList, setLatestList] = useState([]);
  const [result, setResult] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  /* =======================
     SEARCH
  ======================= */
  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setIsSearching(true);

    try {
      const urlMap = {
        melolo: `https://api.sansekai.my.id/api/melolo/search?query=${query}&limit=10`,
        dramabox: `https://api.sansekai.my.id/api/dramabox/search?query=${query}`,
        flickreels: `https://api.sansekai.my.id/api/flickreels/search?query=${query}`,
      };

      const res = await fetch(urlMap[source]);
      const json = await res.json();

      let data = [];

      if (source === "melolo") {
        data = json?.data?.search_data || [];
      } else {
        data = json?.data || json || [];
      }

      setResult(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="min-w-screen min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Series Search</h1>

        {/* SOURCE PICKER */}
        <div className="flex gap-2 mb-3">
          {["melolo", "dramabox", "flickreels"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setSource(s);
                setResult([]);
                setQuery("");
                setIsSearching(false);
              }}
              className={`px-4 py-2 rounded border ${
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
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value) setIsSearching(false);
            }}
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

        {/* TITLE */}
        <h2 className="text-lg font-semibold mb-2">
          {isSearching ? "Hasil Pencarian" : ""}
        </h2>

        {/* RESULT */}
        <SearchResult source={source} data={result} />
      </div>
    </div>
  );
}
