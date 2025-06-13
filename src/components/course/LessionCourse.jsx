import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Settings,
  Maximize,
  Edit3,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';

const LessonCourse = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lessonData, setLessonData] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://684a940d165d05c5d3596089.mockapi.io/lessioncourse');
      if (!response.ok) throw new Error('Failed to fetch lessons');
      const data = await response.json();
      setLessons(data);
      setLessonData(data[0]);
      setDuration(data[0].duration);
      setCurrentTime(data[0].timeWatched);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (lessonId, progress, timeWatched) => {
    const index = lessons.findIndex((l) => l.id === lessonId);
    if (index !== -1) {
      lessons[index].progress = progress;
      lessons[index].timeWatched = timeWatched;
    }
  };

  const toggleBookmark = async (lessonId) => {
    const index = lessons.findIndex((l) => l.id === lessonId);
    if (index !== -1) {
      lessons[index].isBookmarked = !lessons[index].isBookmarked;
      setLessonData({ ...lessons[index] });
    }
  };

  const saveNote = async (lessonId, note) => {
    console.log(`Note for lesson ${lessonId} at ${currentTime}s: ${note}`);
    return { id: Date.now(), note, timestamp: currentTime };
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && lessonData) {
      interval = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 1, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, lessonData]);

  useEffect(() => {
    if (lessonData && isPlaying) {
      const interval = setInterval(() => {
        const progress = (currentTime / duration) * 100;
        updateProgress(lessonData.id, progress, currentTime);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentTime, isPlaying, lessonData]);

  const handleNoteClick = async () => {
    const note = prompt('Nhập ghi chú của bạn:');
    if (note && lessonData) await saveNote(lessonData.id, note);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${('0' + (s % 60)).slice(-2)}`;

  const handlePreviousLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === lessonData.id);
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1];
      setLessonData(prevLesson);
      setDuration(prevLesson.duration);
      setCurrentTime(prevLesson.timeWatched);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === lessonData.id);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      setLessonData(nextLesson);
      setDuration(nextLesson.duration);
      setCurrentTime(nextLesson.timeWatched);
    }
  };

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (error) return <div className="p-4 text-red-500">Lỗi: {error}</div>;
  if (!lessonData) return <div className="p-4">Không có dữ liệu</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{lessonData.title}</h1>
      <p className="text-gray-600 mb-4">{lessonData.description}</p>
      <div className="mb-4 flex items-center gap-4">
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
          <div
            className="bg-green-500 h-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
      </div>
      <button onClick={handleNoteClick} className="mr-4">📝 Ghi chú</button>
      <button onClick={() => toggleBookmark(lessonData.id)}>
        <Bookmark className={lessonData.isBookmarked ? 'text-yellow-500' : ''} />
      </button>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Mục tiêu</h2>
        <ul className="list-disc ml-6 mt-2">
          {lessonData.objectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePreviousLesson}
          disabled={lessons.findIndex((l) => l.id === lessonData.id) === 0}
        >
          <ChevronLeft /> Bài trước
        </button>
        <button
          onClick={handleNextLesson}
          disabled={lessons.findIndex((l) => l.id === lessonData.id) === lessons.length - 1}
        >
          Bài tiếp <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default LessonCourse;
