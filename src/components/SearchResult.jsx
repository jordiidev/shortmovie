import { useNavigate } from "react-router-dom";

export default function SearchResult({ source, data }) {
const navigate = useNavigate();

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        Silakan cari judul
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((item, idx) => {
        if (source === "melolo") {
          const book = item.books?.[0];
          if (!book) return null;

          return (
            <div
              key={book.book_id}
              onClick={() => navigate(`/melolo/${book.book_id}`)}
              className="bg-white rounded shadow cursor-pointer hover:shadow-lg"
            >
              <img
                src={book.thumb_url}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2">
                  {book.book_name}
                </h3>
              </div>
            </div>
          );
        }

        if (source === "flickreels") {
          return (
            <div
              key={item.playlet_id}
              onClick={() => navigate(`/flickreels/${item.playlet_id}`)}
              className="bg-white rounded shadow cursor-pointer hover:shadow-lg"
            >
              <img
                src={item.cover}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </div>
          );
        }

        if (source === "netshort") {
           return (
            <div
              key={item.shortPlayId}
              onClick={() => navigate(`/netshort/${item.shortPlayId}`)}
              className="bg-white rounded shadow cursor-pointer hover:shadow-lg"
            >
              <img
                src={item.shortPlayCover}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2">
                  {item.shortPlayName}
                </h3>
              </div>
            </div>
          );
        }

        // DRAMABOX
        return (
          <div
            key={item.bookId}
            onClick={() => navigate(`/dramabox/${item.bookId}`)}
            className="bg-white rounded shadow cursor-pointer hover:shadow-lg"
          >
            <img
              src={item.cover}
              className="w-full h-48 object-cover rounded-t"
            />
            <div className="p-3">
              <h3 className="text-sm font-semibold line-clamp-2">
                {item.bookName}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
