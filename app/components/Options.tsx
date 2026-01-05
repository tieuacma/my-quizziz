import { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { GetOptionClassFunction } from '../hooks/quizHandlers';

interface OptionsProps {
  options: string[];
  getOptionClass: GetOptionClassFunction;
  handleAnswerClick: (option: string) => void;
  showFeedback: boolean;
  questionId?: number | string;
  questionType?: string;
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

export default function Options({ options, getOptionClass, handleAnswerClick, showFeedback, questionId, questionType }: OptionsProps) {
  const isProcessingRef = useRef(false);

  // Shuffle options and track original indices
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [originalIndices, setOriginalIndices] = useState<number[]>([]);

  useEffect(() => {
    // Create shuffled version of options (skip shuffling for reading_sub questions)
    const indices = options.map((_, index) => index);

    if (questionType === "reading_sub") {
      // For reading_sub questions, keep original order
      setShuffledOptions(options);
      setOriginalIndices(indices);
    } else {
      // For other question types, shuffle options
      const shuffledIndices = [...indices].sort(() => Math.random() - 0.5);
      const shuffled = shuffledIndices.map(index => options[index]);

      setShuffledOptions(shuffled);
      setOriginalIndices(shuffledIndices);
    }
  }, [options, questionId, questionType]); // Re-shuffle when question changes or questionType changes

  const handleClick = (option: string) => {
    if (showFeedback || isProcessingRef.current) return;
    isProcessingRef.current = true;
    handleAnswerClick(option);
    // Reset processing flag after a short delay to allow for state updates
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 100);
  };

  return (
    /* Giữ nguyên grid 2 cột để ô đáp án to và thoáng */
    <div className="grid grid-cols-2 gap-8 mt-10">
      {shuffledOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => handleClick(option)}
          disabled={showFeedback || isProcessingRef.current}
          /* justify-center và items-center để nội dung luôn nằm giữa ô */
          className={`${getOptionClass(option, shuffledOptions, originalIndices)}
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