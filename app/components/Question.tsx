interface QuestionProps {
  question: string;
  transition: boolean;
}

export default function Question({ question, transition }: QuestionProps) {
  return (
    <div className="mb-10">
      <h2 className={`text-3xl font-bold text-gray-800 leading-relaxed transition-all duration-300 ${transition ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
        {question}
      </h2>
    </div>
  );
}