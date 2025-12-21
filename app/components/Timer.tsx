interface TimerProps {
  currentQuestion: number;
  questionsLength: number;
  timeLeft: number;
  timeLimit: number;
}

export default function Timer({ currentQuestion, questionsLength, timeLeft, timeLimit }: TimerProps) {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <p className="text-lg text-gray-500 uppercase tracking-widest font-bold">
          Câu hỏi {currentQuestion + 1} / {questionsLength}
        </p>
        <div className="flex items-center space-x-4">
          <span className="text-lg text-gray-500">Thời gian:</span>
          <div className={`px-4 py-2 rounded-full font-bold text-white text-lg ${timeLeft > 5 ? 'bg-green-500' : timeLeft > 2 ? 'bg-yellow-500' : 'bg-red-500'}`}>
            {timeLeft}s
          </div>
        </div>
      </div>
      {/* Time Progress Bar */}
      <div className="w-full bg-gray-200 h-4 rounded-full mb-4">
        <div 
          className={`h-4 rounded-full transition-all duration-1000 ${timeLeft > 5 ? 'bg-green-500' : timeLeft > 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
        ></div>
      </div>
      <div className="w-full bg-gray-200 h-4 rounded-full">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questionsLength) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}