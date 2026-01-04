import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface OptionsProps {
  options: string[];
  getOptionClass: (option: string) => string;
  handleAnswerClick: (option: string) => void;
  showFeedback: boolean;
}

// Component nội bộ để xử lý render nội dung
const MarkdownRenderer = ({ content }: { content: string }) => (
  <ReactMarkdown 
    remarkPlugins={[remarkMath]} 
    rehypePlugins={[rehypeKatex]}
    components={{
      // Đảm bảo các thẻ p (do markdown sinh ra) không làm lệch layout căn giữa
      p: ({ children }) => <p className="m-0 inline-block">{children}</p> 
    }}
  >
    {content}
  </ReactMarkdown>
);

export default function Options({ options, getOptionClass, handleAnswerClick, showFeedback }: OptionsProps) {
  return (
    /* Giữ nguyên grid 2 cột để ô đáp án to và thoáng */
    <div className="grid grid-cols-2 gap-8 mt-10">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => !showFeedback && handleAnswerClick(option)}
          disabled={showFeedback}
          /* justify-center và items-center để nội dung luôn nằm giữa ô */
          className={`${getOptionClass(option)} 
            flex items-center justify-center 
            p-8 rounded-[2rem] border-2 
            transition-all min-h-[110px] group shadow-sm 
            hover:shadow-xl active:scale-95`}
        >
          {/* Sử dụng div thay cho span vì Markdown sẽ render ra các block.
            Dùng text-center và inline-block để công thức latex luôn nằm chính giữa.
          */}
          <div className="text-gray-700 font-semibold text-2xl text-center leading-tight">
            <MarkdownRenderer content={option} />
          </div>
        </button>
      ))}
    </div>
  );
}