import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white py-6 border-t border-blue-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="text-center md:text-left">
            <h2 className="text-base font-bold uppercase tracking-tight">
              EnglishLMS
            </h2>
            <p className="text-[10px] text-blue-200 mt-1 font-medium">
              By Dương Thị Hằng
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-wider">
            <span className="cursor-pointer hover:underline">
              Liên hệ trợ giúp
            </span>
            <span className="cursor-pointer hover:underline">
              Chính sách bảo mật
            </span>
            <span className="cursor-pointer hover:underline">
              Điều khoản sử dụng
            </span>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;