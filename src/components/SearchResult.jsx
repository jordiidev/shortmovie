import { useNavigate } from "react-router-dom";

export default function SearchResult({ source, data }) {
  const navigate = useNavigate();

  if (!data || data.length === 0)
    return <p className="text-gray-500">Tidak ada hasil</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((item, idx) => {
        // ==== MELOLO ====
        if (source === "melolo") {
          const book = item.books?.[0];
          if (!book) return null;

          return (
            <div
              key={idx}
              onClick={() => navigate(`/melolo/${book.book_id}`)}
              className="bg-white rounded shadow cursor-pointer hover:shadow-lg transition"
            >
              <img
                src={book.thumb_url}
                alt={book.book_name}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2">
                  {book.book_name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {book.show_creation_status}
                </p>
              </div>
            </div>
          );
        }

        // ==== FLICKREELS ====
        if (source === "flickreels") {
          return (
            <div
              key={item.playlet_id}
              onClick={() => navigate(`/flickreels/${item.playlet_id}`)}
              className="bg-white rounded shadow cursor-pointer hover:shadow-lg transition"
            >
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {item.introduce}
                </p>
              </div>
            </div>
          );
        }

        // ==== DRAMABOX (DEFAULT) ====
        return (
          <div
            key={item.bookId}
            onClick={() => navigate(`/dramabox/${item.bookId}`)}
            className="bg-white rounded shadow cursor-pointer hover:shadow-lg transition"
          >
            <img
              src={item.cover}
              alt={item.bookName}
              className="w-full h-48 object-cover rounded-t"
            />
            <div className="p-3">
              <h3 className="font-semibold text-sm line-clamp-2">
                {item.bookName}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {item.introduction}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
