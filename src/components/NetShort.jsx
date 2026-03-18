import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

export default function NetShort() {
  const { id } = useParams();

  const API = `https://api.sansekai.my.id/api/netshort/allepisode?shortPlayId=${id}`;

  const [episodes, setEpisodes] = useState([]);
  const [seriesTitle, setSeriesTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [subtitleSrc, setSubtitleSrc] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(API)
      .then((res) => res.json())
      .then((json) => {
        setSeriesTitle(json?.shortPlayName || "");
        setDetail(json?.shotIntroduce || "");
        setEpisodes(json?.shortPlayEpisodeInfos || []);
      })
      .catch(console.error);
  }, [id]);

  // =======================
  // SRT -> VTT
  // =======================
  const srtToVtt = (srt) => {
    return (
      "WEBVTT\n\n" +
      srt
        .replace(/\r+/g, "")
        .replace(
          /(\d+)\n(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g,
          "$1\n$2.$3 --> $4.$5",
        )
    );
  };

  const loadSubtitle = async (ep) => {
    const sub = ep.subtitleList?.find(
      (s) => s.subtitleLanguage === "id_ID" && s.url,
    );
    if (!sub) {
      setSubtitleSrc(null);
      return;
    }

    const res = await fetch(sub.url);
    const srtText = await res.text();
    const vttText = srtToVtt(srtText);

    const blob = new Blob([vttText], { type: "text/vtt" });
    const url = URL.createObjectURL(blob);
    setSubtitleSrc(url);
  };

  const playEpisode = async (ep) => {
    setActiveEpisode(ep.episodeId);
    setCurrentVideo(ep?.playVoucher || null);
    await loadSubtitle(ep);
  };

  const handleEnded = () => {
    const idx = episodes.findIndex((e) => e.id === activeEpisode);
    if (idx !== -1 && episodes[idx + 1]) {
      playEpisode(episodes[idx + 1]);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Navbar />
      <div className="w-full flex flex-col md:flex-row gap-4 px-4 md:px-6 py-4">
        {/* VIDEO */}
        <div className="w-full md:flex-1 bg-black flex justify-center items-center rounded-lg overflow-hidden order-1">
          <div className="relative w-full h-[60vh] md:h-[70vh] aspect-[9/16] bg-black">
            {currentVideo ? (
              <video
                src={currentVideo}
                controls
                autoPlay
                onEnded={handleEnded}
                className="w-full h-full object-contain"
              >
                {subtitleSrc && (
                  <track
                    kind="subtitles"
                    src={subtitleSrc}
                    srcLang="id"
                    label="Indonesia"
                    default
                  />
                )}
              </video>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Pilih episode
              </div>
            )}
          </div>
        </div>

        {/* EPISODE LIST */}
        <aside className="w-full md:w-80 bg-white rounded-lg p-4 overflow-y-auto max-h-[300px] md:max-h-[70vh] order-2">
          <h3 className="font-semibold mb-3">
            Episode{" "}
            <span className="text-sm text-gray-400">(1/{episodes.length})</span>
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {episodes.map((ep, i) => (
              <button
                key={ep.episodeId}
                onClick={() => playEpisode(ep)}
                className={`
                  text-xs py-2 rounded border
                  ${
                    activeEpisode === ep.episodeId
                      ? "bg-pink-600 text-white border-pink-600"
                      : "bg-white hover:bg-gray-100"
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* INFO */}
      <div className="w-full px-4 pb-10">
        <h1 className="text-xl font-semibold mb-2">{seriesTitle}</h1>

        <p className="w-full text-sm text-gray-600 leading-relaxed sm:w-[50%]">
          {detail}
        </p>
      </div>
    </div>
  );
}
