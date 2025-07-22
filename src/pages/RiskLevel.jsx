import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"; // Cập nhật đường dẫn nếu cần
import api from "../services/axios"; // Cập nhật đường dẫn nếu cần

// Component Badge không đổi, vẫn dùng để hiển thị mức độ rủi ro
const RiskLevelBadge = ({ level }) => {
  const levelStyles = {
    HIGH: { backgroundColor: "#ffcdd2", color: "#c63828" },
    MEDIUM: { backgroundColor: "#ffe0b2", color: "#f57c00" },
    LOW: { backgroundColor: "#c8e6c9", color: "#2e7d32" },
    UNKNOWN: { backgroundColor: "#f0f0f0", color: "#333" },
  };

  const style = levelStyles[level?.toUpperCase()] || levelStyles.UNKNOWN;

  return (
    <span
      style={{
        ...style,
        padding: "4px 10px",
        borderRadius: "12px",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: "0.85rem",
      }}
    >
      {level || "N/A"}
    </span>
  );
};

// Component mới cho mỗi thẻ kết quả khảo sát
const SurveyResultCard = ({ result }) => {
  // Hàm lấy màu viền dựa trên mức độ rủi ro
  const getBorderColor = (level) => {
    const colors = {
      HIGH: "#c63828",
      MEDIUM: "#f57c00",
      LOW: "#2e7d32",
    };
    return colors[level?.toUpperCase()] || "#ccc";
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    borderTop: `5px solid ${getBorderColor(result.riskLevel)}`,
    marginBottom: "20px", // Khoảng cách giữa các thẻ
  };

  // Hàm định dạng thời gian
  const formatTakenAt = (timeString) => {
    if (!timeString) return "Không rõ";
    if (timeString.includes("T")) {
      return new Date(timeString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return timeString;
  };

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          borderBottom: "1px solid #eee",
          paddingBottom: "12px",
        }}
      >
        <h3 style={{ margin: 0, color: "#333" }}>Kết quả Khảo sát</h3>
        <span style={{ fontSize: "0.9rem", color: "#666", fontWeight: "500" }}>
          Ngày: {formatTakenAt(result.takenAt)}
        </span>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div>
          <p style={{ margin: "0 0 5px 0", color: "#555", fontSize: "0.9rem" }}>
            Mức độ rủi ro
          </p>
          <RiskLevelBadge level={result.riskLevel} />
        </div>
        <div>
          <p style={{ margin: "0 0 5px 0", color: "#555", fontSize: "0.9rem" }}>
            Điểm số
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#111",
            }}
          >
            {result.score}
          </p>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <p style={{ margin: "0 0 5px 0", color: "#555", fontSize: "0.9rem" }}>
          Khuyến nghị từ chuyên gia
        </p>
        <p
          style={{
            margin: 0,
            background: "#f9f9f9",
            padding: "10px",
            borderRadius: "4px",
            color: "#444",
          }}
        >
          {result.recommendation || "Không có khuyến nghị nào."}
        </p>
      </div>
    </div>
  );
};

// Component chính được sửa đổi để sử dụng Card layout
function RiskLevel() {
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    const fetchSurveyResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/survey-results/account/${user.id}`);
        setResults(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Không thể tải được kết quả khảo sát.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyResults();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
        Đang tải lịch sử khảo sát...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          color: "red",
          background: "#fff8f8",
          border: "1px solid #ffd4d4",
          borderRadius: "8px",
          width: "fit-content",
          margin: "auto",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ background: "#f4f7f9", padding: "20px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#2c3e50", marginBottom: "25px" }}>
          Lịch sử Khảo sát Rủi ro
        </h1>
        {results.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <p>Bạn chưa thực hiện bài khảo sát nào.</p>
          </div>
        ) : (
          <div>
            {results.map((result, index) => (
              <SurveyResultCard key={index} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiskLevel;
