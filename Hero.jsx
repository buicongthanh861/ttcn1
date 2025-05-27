import { Award, Search, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroImg from '../assets/HeroImg.png';
import CountUp from 'react-countup';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className='bg-slate-800 pt-14'>
      <div className='lg:h-[700px] max-w-7xl mx-auto flex md:flex-row flex-col gap-10 items-center'>
        {/* Text section */}
        <div className='space-y-7 px-4 md:px-0'>
          <h1 className='text-4xl mt-10 md:mt-0 md:text-6xl font-extrabold text-gray-200'>
            Khám phá <span className='text-blue-500'>Hơn 14000+ <br /> khóa học tại đây</span>
          </h1>
          <p className='text-gray-300 text-lg'>Tất cả khóa học dành cho sinh viên ngành công nghệ thông tin và tra cứu tài liệu.</p>

          {/* Giao diện tìm kiếm với sự kiện đúng */}
          <div className='inline-flex relative'>
            <input
              type="text"
              placeholder='Tìm kiếm khóa học tại đây...'
              className='bg-gray-200 w-[350px] md:w-[450px] text-gray-800 p-4 pr-40 rounded-lg rounded-r-xl placeholder:text-gray-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch} className='px-4 py-[14px] flex gap-1 items-center bg-blue-500 font-semibold absolute right-0 text-white rounded-r-lg text-xl'>
              Search
              <Search width={20} height={20}/>
            </button>
          </div>
        </div>

        {/* Image section */}
        <div className='flex md:h-[700px] items-end relative px-4 md:px-0'>
          <img src={HeroImg} alt="" className='w-[600px] shadow-blue-500 drop-shadow-lg' />
          <div className='bg-slate-200 hidden md:flex gap-3 items-center rounded-md absolute top-[35%] right-0 px-4 py-2'>
            <div className='rounded-full bg-blue-400 p-2 text-white'>
              <User/>
            </div>
            <div>
              <h2 className='font-bold text-2xl'><CountUp end={4500}/>+</h2>
              <p className='italic text-sm text-gray-600 leading-none'>Số lượng sinh viên đang theo học</p>
            </div>
          </div>
          <div className='bg-slate-200 hidden md:flex gap-3 items-center rounded-md absolute top-[15%] left-0 px-4 py-2'>
            <div className='rounded-full bg-blue-400 p-2 text-white'>
              <Award/>
            </div>
            <div>
              <h2 className='font-bold text-2xl'><CountUp end={684}/>+</h2>
              <p className='italic text-sm text-gray-600 leading-none'>Số chứng chỉ mà sinh viên nhận được</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Hero 