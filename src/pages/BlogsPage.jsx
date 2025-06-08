import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BlogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsPerPage = 3;

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://684482e971eb5d1be0337d19.mockapi.io/blogs"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data = await response.json();
        setBlogPosts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Search
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    return (
      matchesSearch &&
      post.category.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts
    .filter((post) => !post.featured)
    .slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(
    filteredPosts.filter((post) => !post.featured).length / postsPerPage
  );

  // Render icon
  const renderIcon = (iconType) => {
    switch (iconType) {
      case "brain":
        return (
          <svg
            className="w-12 h-12 text-orange-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21.33 12.91c.09-.09.15-.2.15-.33s-.06-.24-.15-.33L12 3.08c-.09-.09-.2-.15-.33-.15s-.24.06-.33.15L2.67 12.25c-.09.09-.15.2-.15.33s.06.24.15.33l8.67 8.67c.09.09.2.15.33.15s.24-.06.33-.15l8.67-8.67zM12 4.83l6.84 6.84-6.84 6.84L5.16 11.67 12 4.83z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case "psychology":
        return (
          <svg
            className="w-12 h-12 text-purple-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.72 0-.43-.35-.78-.78-.78-.17 0-.33.06-.46.14-.82.28-1.69.43-2.66.43-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 1.57-.45 3.03-1.23 4.26-.15.24-.23.52-.23.8 0 .83.67 1.5 1.5 1.5.41 0 .78-.17 1.05-.44C21.38 16.5 22 14.32 22 12c0-5.52-4.48-10-10-10z" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        );
      case "shield":
        return (
          <svg
            className="w-12 h-12 text-green-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
          </svg>
        );
      case "people":
        return (
          <svg
            className="w-12 h-12 text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.24-.72-.84-1.29-1.58-1.29-.6 0-1.13.38-1.34.94L15.5 11.5c-.21.56-.21 1.18 0 1.74L17 16v6h3zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 16v-6h2.5L7.96 8.37c-.24-.72-.84-1.29-1.58-1.29-.6 0-1.13.38-1.34.94L3.5 11.5c-.21.56-.21 1.18 0 1.74L5 16v6h2z" />
          </svg>
        );
      case "education":
        return (
          <svg
            className="w-12 h-12 text-indigo-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18M12,3L1,9L12,15L21,11V17H23V9L12,3Z" />
          </svg>
        );
      case "health":
        return (
          <svg
            className="w-12 h-12 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12.8,5.4C12.8,5.4 12.8,5.4 12.8,5.4C13.1,4.9 13.4,4.4 13.7,4C14.8,2.4 15.4,1.8 16.3,2.1C17.1,2.3 17.8,3.1 17.9,4C18.1,5.2 17.4,6.6 16.3,7.5C15.9,7.9 15.4,8.1 14.9,8.3L17.6,11.0L19,9.6L20.4,11L19,12.4L20.4,13.8L19,15.2L17.6,13.8L16.2,15.2L14.8,13.8L16.2,12.4L14.8,11L13.4,12.4L12,11L10.6,12.4L9.2,11L7.8,12.4L6.4,11L5,12.4L3.6,11L2.2,12.4L0.8,11L2.2,9.6L3.6,11L5,9.6L6.4,11L7.8,9.6L9.2,11L10.6,9.6L12,11L12.8,5.4Z" />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-12 h-12 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-12 h-12 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Lỗi tải dữ liệu
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <section className="bg-emerald-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4" data-aos="fade-up">
            Blog & Kiến thức
          </h1>
          <p
            className="text-lg text-emerald-100 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Khám phá những bài viết chuyên sâu về phòng chống tệ nạn xã hội và
            chia sẻ kiến thức từ các chuyên gia hàng đầu
          </p>

          {/* Search Bar */}
          <div
            className="max-w-2xl mx-auto mt-8 relative"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex items-center bg-white rounded-lg overflow-hidden">
              <div className="pl-4">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết, chủ đề..."
                className="w-full px-4 py-3 text-gray-800 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-emerald-700 hover:bg-emerald-900 text-white px-6 py-3 transition-colors">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-0">
              <button
                className={`px-4 py-2 rounded-full border transition-colors ${
                  activeFilter === "all"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-emerald-500"
                }`}
                onClick={() => setActiveFilter("all")}
              >
                Tất cả chủ đề
              </button>
              <button
                className={`px-4 py-2 rounded-full border transition-colors ${
                  activeFilter === "phòng chống ma túy"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-emerald-500"
                }`}
                onClick={() => setActiveFilter("phòng chống ma túy")}
              >
                Phòng chống ma túy
              </button>
              <button
                className={`px-4 py-2 rounded-full border transition-colors ${
                  activeFilter === "tâm lý học"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-emerald-500"
                }`}
                onClick={() => setActiveFilter("tâm lý học")}
              >
                Tâm lý học
              </button>
              <button
                className={`px-4 py-2 rounded-full border transition-colors ${
                  activeFilter === "giáo dục"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-emerald-500"
                }`}
                onClick={() => setActiveFilter("giáo dục")}
              >
                Giáo dục
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Hiển thị {indexOfFirstPost + 1}-
                {Math.min(
                  indexOfLastPost,
                  filteredPosts.filter((post) => !post.featured).length
                )}
                trong số {filteredPosts.filter((post) => !post.featured).length}{" "}
                bài viết
              </span>
              <div className="flex border rounded overflow-hidden">
                <button
                  className={`p-2 transition-colors ${
                    activeView === "grid"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveView("grid")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  className={`p-2 transition-colors ${
                    activeView === "list"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveView("list")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Highlight Post */}
          {filteredPosts.length > 0 && (
            <div className="mb-10" data-aos="fade-up">
              <div className="bg-emerald-600 rounded-lg overflow-hidden">
                <div className="p-8 text-white">
                  <span className="inline-block px-3 py-1 bg-white text-emerald-600 text-xs font-semibold rounded-full mb-4">
                    BÀI VIẾT NỔI BẬT
                  </span>
                  <div className="flex items-start mb-4">
                    <div className="mr-6 mt-2">
                      {renderIcon(
                        filteredPosts[0].category === "TÂM LÝ HỌC"
                          ? "psychology"
                          : filteredPosts[0].category === "PHÒNG NGỪA"
                          ? "shield"
                          : filteredPosts[0].category === "CỘNG ĐỒNG"
                          ? "people"
                          : filteredPosts[0].category === "GIÁO DỤC"
                          ? "education"
                          : filteredPosts[0].category === "SỨC KHỎE"
                          ? "health"
                          : filteredPosts[0].category === "PHÒNG CHỐNG MA TÚY"
                          ? "warning"
                          : "brain"
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        {filteredPosts[0].title}
                      </h2>
                      <span className="text-emerald-200 text-sm font-medium">
                        {filteredPosts[0].category}
                      </span>
                    </div>
                  </div>
                  <p className="text-emerald-100 mb-6 text-lg">
                    {filteredPosts[0].description}
                  </p>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 bg-white text-emerald-600 rounded-full flex items-center justify-center font-semibold">
                        {filteredPosts[0].author.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {filteredPosts[0].author.name}
                        </p>
                        <p className="text-sm text-emerald-100">
                          {filteredPosts[0].author.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {filteredPosts[0].readTime}
                      </span>
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {filteredPosts[0].views}
                      </span>
                      <span>{filteredPosts[0].date}</span>
                    </div>
                  </div>

                  <Link
                    to={`/blogs/${filteredPosts[0].id}`}
                    className="mt-6 inline-block px-6 py-3 bg-white text-emerald-600 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Đọc bài viết →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Blog Posts */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Bài viết mới nhất</h2>
            <Link
              to="/blogs"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Xem tất cả →
            </Link>
          </div>

          {activeView === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div
                    className={`p-6 flex justify-center ${
                      post.category === "TÂM LÝ HỌC"
                        ? "bg-purple-50"
                        : post.category === "PHÒNG NGỪA"
                        ? "bg-green-50"
                        : post.category === "CỘNG ĐỒNG"
                        ? "bg-blue-50"
                        : post.category === "GIÁO DỤC"
                        ? "bg-indigo-50"
                        : post.category === "SỨC KHỎE"
                        ? "bg-red-50"
                        : "bg-orange-50"
                    }`}
                  >
                    {renderIcon(post.icon)}
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <h3 className="text-lg font-bold mt-2 hover:text-emerald-600 transition-colors line-clamp-2">
                        <Link to={`/blogs/${post.id}`}>{post.title}</Link>
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-xs">
                          {post.author.avatar}
                        </div>
                        <span className="text-gray-700 font-medium">
                          {post.author.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-500">
                        <span className="flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      {post.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {currentPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div
                    className={`p-6 flex items-center justify-center ${
                      post.category === "TÂM LÝ HỌC"
                        ? "bg-purple-50"
                        : post.category === "PHÒNG NGỪA"
                        ? "bg-green-50"
                        : post.category === "CỘNG ĐỒNG"
                        ? "bg-blue-50"
                        : post.category === "GIÁO DỤC"
                        ? "bg-indigo-50"
                        : post.category === "SỨC KHỎE"
                        ? "bg-red-50"
                        : "bg-orange-50"
                    }`}
                    style={{ minWidth: "120px" }}
                  >
                    {renderIcon(post.icon)}
                  </div>
                  <div className="p-6 flex-1">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-bold mt-2 hover:text-emerald-600 transition-colors">
                        <Link to={`/blogs/${post.id}`}>{post.title}</Link>
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-xs">
                          {post.author.avatar}
                        </div>
                        <span className="text-gray-700 font-medium">
                          {post.author.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-500">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {post.readTime}
                        </span>
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          {post.views}
                        </span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                } transition-colors`}
              >
                &laquo;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 border rounded ${
                      pageNum === currentPage
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                } transition-colors`}
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogsPage;