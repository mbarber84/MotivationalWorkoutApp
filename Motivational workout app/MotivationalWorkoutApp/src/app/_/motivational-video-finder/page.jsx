"use client";
import React from "react";

function MainComponent() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  const categories = [
    { id: "success", label: "Success", icon: "🏆" },
    { id: "mindset", label: "Mindset", icon: "🧠" },
    { id: "fitness", label: "Fitness", icon: "💪" },
    { id: "business", label: "Business", icon: "💼" },
    { id: "purpose", label: "Purpose", icon: "🎯" },
  ];

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = (videoId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(videoId)
        ? prevFavorites.filter((id) => id !== videoId)
        : [...prevFavorites, videoId];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const fetchVideos = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/integrations/web-scraping/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: `https://www.youtube.com/results?search_query=motivational+${category}+videos`,
          getText: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching videos: ${response.status}`);
      }

      const text = await response.text();
      const dummyVideos = [
        {
          id: 1,
          title: "Motivational Video 1",
          thumbnail: "/placeholder-1.jpg",
        },
        {
          id: 2,
          title: "Motivational Video 2",
          thumbnail: "/placeholder-2.jpg",
        },
        {
          id: 3,
          title: "Motivational Video 3",
          thumbnail: "/placeholder-3.jpg",
        },
      ];
      setVideos(dummyVideos);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white dark:bg-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Find Your Motivation
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          Discover inspiring videos tailored to your personal growth journey
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-6 py-3 rounded-md text-sm ${
            selectedCategory === "all"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "border border-gray-200 text-gray-900 dark:text-white"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-3 rounded-md text-sm flex items-center gap-2 ${
              selectedCategory === cat.id
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "border border-gray-200 text-gray-900 dark:text-white"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-3"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded"></div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            No videos found for this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="group cursor-pointer relative">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(video.id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i
                    className={`fas fa-heart ${
                      favorites.includes(video.id)
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  ></i>
                </button>
              </div>
              <h3 className="text-gray-900 dark:text-white font-medium">
                {video.title}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MainComponent;