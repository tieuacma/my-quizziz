interface OptionsProps {
  options: string[];
  getOptionClass: (option: string) => string;
  handleAnswerClick: (option: string) => void;
  showFeedback: boolean;
}

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
          {/* Chỉ giữ lại thẻ span chứa nội dung câu trả lời */}
          <span className="text-gray-700 font-semibold text-2xl text-center leading-tight">
            {option}
          </span>
        </button>
      ))}
    </div>
  );
}