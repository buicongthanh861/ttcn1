import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/v1/course/search?query=${encodeURIComponent(searchQuery)}`);

        if (response.data.success) {
          setCourses(response.data.course);
        } else {
          setError('Không tìm thấy khóa học phù hợp.');
        }
      } catch (err) {
        console.error(err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim()) {
      fetchCourses();
    } else {
      setCourses([]);
      setLoading(false);
    }
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 mt-10">
        Kết quả tìm kiếm cho: <span className="text-blue-500">"{searchQuery}"</span>
      </h1>

      {loading && <p className="text-gray-500">Đang tải kết quả...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && courses.length === 0 && (
        <p className="text-gray-500">Không tìm thấy khóa học phù hợp.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Search;
