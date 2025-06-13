import { Video, CheckCircle } from "lucide-react";

const GoogleMeetInfo = ({ className = "" }) => {
  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center">
          <Video className="w-5 h-5 mr-2" />
          <h3 className="font-semibold">Tư vấn qua Google Meet</h3>
        </div>
      </div>

      <div className="bg-blue-50 p-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
            <p>
              Link Google Meet sẽ được gửi cho bạn trước buổi tư vấn
            </p>
          </div>

          <div className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
            <p>
              Đảm bảo bạn có kết nối internet ổn định và thiết bị có camera,
              microphone
            </p>
          </div>

          <div className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
            <p>Tham gia buổi tư vấn từ không gian yên tĩnh, riêng tư</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMeetInfo;
