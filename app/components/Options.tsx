interface OptionsProps {
  options: string[];
  getOptionClass: (option: string) => string;
  handleAnswerClick: (option: string) => void;
  showFeedback: boolean;
}

export default function Options({ options, getOptionClass, handleAnswerClick, showFeedback }: OptionsProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => !showFeedback && handleAnswerClick(option)}
          className={getOptionClass(option)}
          disabled={showFeedback}
        >
          <div className="flex items-center">
            <span className="inline-block w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 group-hover:from-purple-200 group-hover:to-pink-200 text-center leading-12 rounded-2xl mr-6 font-bold text-gray-600 group-hover:text-purple-700 transition-all text-xl">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-gray-700 group-hover:text-gray-900 font-medium text-xl">{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
}