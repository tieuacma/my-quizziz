"use client";

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Import CSS của KaTeX để hiển thị công thức toán học
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = "" }: MarkdownRendererProps) => {
  return (
    <div className={`markdown-container ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Custom render cho thẻ <p> để tránh tạo khoảng trống thừa trong câu hỏi/đáp án
          p: ({ children }) => <span className="inline-block m-0">{children}</span>,
          
          // Bạn có thể thêm các định dạng khác ở đây nếu cần
          code: ({ children }) => (
            <code className="bg-gray-100 px-1 rounded text-red-500 font-mono text-sm">
              {children}
            </code>
          ),
          
          // Đảm bảo ảnh trong markdown không tràn khung
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full h-auto rounded-lg my-2 mx-auto block" 
            />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};