import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DramaboxPlayer(props) {
  const { bookId } = useParams(); // ✅ DI DALAM COMPONENT

  const EPISODE_API = `https://api.sansekai.my.id/api/dramabox/allepisode?bookId=${bookId}`;
  const DETAIL_API = `https://api.sansekai.my.id/api/dramabox/detail?bookId=${bookId}`;

  const [episodes, setEpisodes] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [seriesTitle, setSeriesTitle] = useState("");
  const [detail, setDetail] = useState("");

  // useEffect(() => {
  //   if (!bookId) return;

  //   fetch(EPISODE_API)
  //     .then((res) => res.json())
  //     .then((json) => setEpisodes(json || []))
  //     .catch(console.error);
  // }, [bookId]);
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

  const playEpisode = (ep) => {
    const url = getBestVideo(ep);
    if (!url) return;

    setActiveEpisode(ep.chapterId);
    setCurrentVideo(url);
  };

  const handleEnded = () => {
    const idx = episodes.findIndex((e) => e.chapterId === activeEpisode);
    if (idx !== -1 && idx < episodes.length - 1) {
      playEpisode(episodes[idx + 1]);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <div className="w-full flex flex-col md:flex-row gap-4 px-4 md:px-6 py-4">
        {/* VIDEO PLAYER */}
        <div className="w-full md:flex-1 bg-black flex justify-center items-center rounded-lg overflow-hidden order-1">
          <div className="relative w-full h-[60vh] md:h-[70vh] aspect-[9/16] bg-black">
            {currentVideo ? (
              <video
                src={currentVideo}
                controls
                autoPlay
                onEnded={handleEnded}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 flex items-center justify-center h-full">
                Pilih episode
              </div>
            )}
          </div>
        </div>

        {/* EPISODE LIST */}
        <aside className="w-full md:w-80 bg-white rounded-lg p-4 overflow-y-auto max-h-[300px] md:max-h-[70vh] order-2">
          {/* <h3 className="font-semibold mb-3">Episode</h3> */}
          <h3 className="font-semibold mb-3">
            Episode{" "}
            <span className="text-sm text-gray-400">(1/{episodes.length})</span>
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {episodes.map((ep, i) => (
              <button
                key={ep.chapterId}
                onClick={() => playEpisode(ep)}
                disabled={ep.chargeChapter}
                className={`
                px-4 py-2 rounded text-sm border
                ${
                  ep.chargeChapter
                    ? "bg-gray-200 text-gray-400"
                    : activeEpisode === ep.chapterId
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
