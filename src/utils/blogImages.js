import blog1 from "../assets/blogs/blog1.jpg";
import blog2 from "../assets/blogs/blog2.jpg";
import blog3 from "../assets/blogs/blog3.jpg";
import blog4 from "../assets/blogs/blog4.jpg";
import blog5 from "../assets/blogs/blog5.jpg";
import blog6 from "../assets/blogs/blog6.jpg";
import blog7 from "../assets/blogs/blog7.jpg";
import blog8 from "../assets/blogs/blog8.jpg";
import blog9 from "../assets/blogs/blog9.jpg";
import blog10 from "../assets/blogs/blog10.jpg";

// Tạo object mapping ID với hình ảnh
export const blogImages = {
  1: blog1,
  2: blog2,
  3: blog3,
  4: blog4,
  5: blog5,
  6: blog6,
  7: blog7,
  8: blog8,
  9: blog9,
  10: blog10,
};

// Lấy hình ảnh theo ID
export const getBlogImage = (id) => {
  return blogImages[id] || "/placeholder.svg"; 
};
