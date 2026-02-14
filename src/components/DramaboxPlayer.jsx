import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

export default function DramaboxPlayer() {
  const { bookId } = useParams();

  const videoRef = useRef(null);

  const EPISODE_API = `https://api.sansekai.my.id/api/dramabox/allepisode?bookId=${bookId}`;
  const DETAIL_API = `https://api.sansekai.my.id/api/dramabox/detail?bookId=${bookId}`;

  const [episodes, setEpisodes] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [subtitleSrc, setSubtitleSrc] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [seriesTitle, setSeriesTitle] = useState("");
  const [detail, setDetail] = useState("");

  // =======================
  // FETCH DATA
  // =======================
  useEffect(() => {
    if (!bookId) return;

    fetch(DETAIL_API)
      .then((res) => res.json())
      .then((json) => {
        setSeriesTitle(json.bookName);
        setDetail(json.introduction);
      })
      .catch(console.error);

    fetch(EPISODE_API)
      .then((res) => res.json())
      .then((json) => setEpisodes(json || []))
      .catch(console.error);
  }, [bookId]);

  // =======================
  // PICK BEST VIDEO
  // =======================
  const getBestVideo = (ep) => {
    for (const cdn of ep.cdnList || []) {
      const list = cdn.videoPathList || [];
      return (
        list.find((v) => v.quality === 720 && !v.isVipEquity)?.videoPath ||
        list.find((v) => v.quality === 540)?.videoPath ||
        list.find((v) => v.quality === 360)?.videoPath
      );
    }
    return null;
  };

  // =======================
  // SRT -> VTT
  // =======================
  const srtToVtt = (srt) => {
    return (
      "WEBVTT\n\n" +
      srt
        .replace(/\r+/g, "")
        .replace(/(\d+)\n(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g,
          "$1\n$2.$3 --> $4.$5"
        )
    );
  };

  const loadSubtitle = async (ep) => {
    const sub = ep.subLanguageVoList?.find(
      (s) => s.captionLanguage === "in" && s.url
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

  // =======================
  // PLAY EPISODE
  // =======================
  const playEpisode = async (ep) => {
    const videoUrl = getBestVideo(ep);
    if (!videoUrl) return;

    setActiveEpisode(ep.chapterId);
    setCurrentVideo(videoUrl);
    await loadSubtitle(ep);
  };

  const handleEnded = () => {
    const idx = episodes.findIndex((e) => e.chapterId === activeEpisode);
    if (idx !== -1 && idx < episodes.length - 1) {
      playEpisode(episodes[idx + 1]);
    }
  };

  // =======================
  // RENDER
  // =======================
  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Navbar />
      <div className="w-full flex flex-col md:flex-row gap-4 px-4 py-4">

        {/* VIDEO PLAYER */}
        <div className="w-full md:flex-1 bg-black rounded-lg overflow-hidden">
          <div className="relative w-full h-[60vh] aspect-[9/16] bg-black">
            {currentVideo ? (
              <video
                ref={videoRef}
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
              <div className="text-gray-400 flex items-center justify-center h-full">
                Pilih episode
              </div>
            )}
          </div>
        </div>

        {/* EPISODE LIST */}
        <aside className="w-full md:w-80 bg-white rounded-lg p-4 overflow-y-auto max-h-[70vh]">
          <h3 className="font-semibold mb-3">
            Episode <span className="text-sm text-gray-400">(1/{episodes.length})</span>
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {episodes.map((ep, i) => (
              <button
                key={ep.chapterId}
                onClick={() => playEpisode(ep)}
                className={`px-4 py-2 rounded text-sm border
                  ${
                    activeEpisode === ep.chapterId
                      ? "bg-pink-600 text-white border-pink-600"
                      : "bg-white hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* INFO */}
      <div className="px-4 pb-10">
        <h1 className="text-xl font-semibold mb-2">{seriesTitle}</h1>
        <p className="text-sm text-gray-600 max-w-xl">{detail}</p>
      </div>
    </div>
  );
}
