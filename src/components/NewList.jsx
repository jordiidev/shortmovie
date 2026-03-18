import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewList() {
  const navigate = useNavigate();

  const [melolo, setMelolo] = useState([]);
  const [dramabox, setDramabox] = useState([]);
  const [flickreels, setFlickreels] = useState([]);
  const [netshort, setNetshort] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [mRes, dRes, fRes, nRes] = await Promise.all([
          fetch("https://api.sansekai.my.id/api/melolo/latest"),
          fetch("https://api.sansekai.my.id/api/dramabox/latest"),
          fetch("https://api.sansekai.my.id/api/flickreels/latest"),
          fetch('https://api.sansekai.my.id/api/netshort/theaters'),
        ]);

        const mJson = await mRes.json();
        const dJson = await dRes.json();
        const fJson = await fRes.json();
        const nJson = await nRes.json();

        // =========================
        // MEL0LO → mJson.books
        // =========================
        setMelolo(mJson?.books || []);

        // =========================
        // DRAMABOX → langsung array
        // =========================
        setDramabox(Array.isArray(dJson) ? dJson : []);

        // =========================
        // FLICKREELS → data[0].list
        // =========================
        const flickList =
          fJson?.data?.[0]?.list || [];

        setFlickreels(flickList);

        setNetshort(nJson[0]?.contentInfos || [])
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);


  if (loading) return <p>Loading latest...</p>;

  return (
    <div className="space-y-10 mt-10">
      {/* ================= NETSHORT ================= */}
      <Section
        title="Netshort Terbaru"
        data={netshort}
        renderItem={(item) => (
          <Card
            key={item.shortPlayId}
            image={item.shortPlayCover}
            title={item.shortPlayName}
            desc=""
            onClick={() => navigate(`/netshort/${item.shortPlayId}`)}
          />
        )}
      />
      
      {/* ================= MEL0LO ================= */}
      <Section
        title="Melolo Terbaru"
        data={melolo}
        renderItem={(item) => (
          <Card
            key={item.book_id}
            image={item.thumb_url}
            title={item.book_name}
            desc={item.abstract}
            onClick={() => navigate(`/melolo/${item.book_id}`)}
          />
        )}
      />

      {/* ================= DRAMABOX ================= */}
      <Section
        title="Dramabox Terbaru"
        data={dramabox}
        renderItem={(item) => (
          <Card
            key={item.bookId}
            image={item.coverWap}
            title={item.bookName}
            desc={item.introduction}
            onClick={() => navigate(`/dramabox/${item.bookId}`)}
          />
        )}
      />

      {/* ================= FLICKREELS ================= */}
      <Section
        title="FlickReels Terbaru"
        data={flickreels}
        renderItem={(item) => (
          <Card
            key={item.playlet_id}
            image={item.cover}
            title={item.title}
            desc=""
            onClick={() => navigate(`/flickreels/${item.playlet_id}`)}
          />
        )}
      />
    </div>
  );
}

/* =========================
   SECTION WRAPPER
========================= */
function Section({ title, data, renderItem }) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{title}</h2>

      {/* MIRIP SEARCHRESULT */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item) => renderItem(item))}
      </div>
    </div>
  );
}

/* =========================
   CARD (MIRIP SEARCHRESULT)
========================= */
function Card({ image, title, desc, onClick }) {
     const fixImage = (url) => {
  if (!url) return "";

  let fixed = url;

  if (fixed.endsWith(".heic")) {
    fixed = fixed.replace(".heic", ".jpeg");
  }

  return fixed;
    };
  return (
    <div
      onClick={onClick}
      className="bg-white rounded shadow cursor-pointer hover:shadow-lg transition"
    >
      <img
        src={fixImage(image)}
        alt={title}
        className="w-full h-48 object-cover rounded-t"
      />

      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2">
          {title}
        </h3>

        {desc && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}