import Header from "../components/Header";
import Footer from "../components/Footer";
import BannerImage1 from "../assets/banner1.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
    

      {/* Banner */}
      <section className="bg-emerald-600 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6" data-aos="fade-right">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Hỗ trợ phòng ngừa sử dụng ma túy
              </h1>
              <p className="text-lg text-emerald-100 leading-relaxed">
                Chúng tôi cung cấp các khóa học, chương trình giáo dục và tư vấn
                chuyên nghiệp để giúp bạn và cộng đồng phòng ngừa tệ nạn xã hội.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 bg-white text-emerald-600 hover:bg-gray-100 rounded-md font-semibold text-lg transition-colors">
                  Bắt đầu ngay
                </button>
                <button className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-emerald-600 rounded-md font-semibold text-lg transition-colors">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>

            <div
              className="flex justify-center lg:justify-end"
              data-aos="fade-left"
            >
              <div className="relative">
                <img
                  src={BannerImage1}
                  alt="Nói không với ma túy"
                  className="w-[600px] h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Dịch vụ của chúng tôi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các chương trình và dịch vụ hỗ trợ phòng ngừa ma túy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Courses */}
            <div
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 text-center"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Khóa học trực tuyến
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Các khóa học được thiết kế bởi chuyên gia, giúp nâng cao nhận
                thức và tác hại của ma túy.
              </p>
            </div>

            {/* Events */}
            <div
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Sự kiện cộng đồng
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tham gia các hoạt động giáo dục, tuyên truyền trong cộng đồng để
                lan tỏa thông điệp tích cực.
              </p>
            </div>

            {/* Consultation */}
            <div
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 text-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Tư vấn chuyên nghiệp
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Đặt lịch tư vấn với các chuyên gia tâm lý, bác sĩ để được hỗ trợ
                kịp thời.
              </p>
            </div>
          </div>
        </div>
      </section>

   
    </div>
  );
};

export default HomePage;
