interface FinalScoreProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTimeSpent: number;
  maxStreak: number;
  onPlayAgain?: () => void;
}

export default function FinalScore({
  score,
  totalQuestions,
  correctAnswers,
  totalTimeSpent,
  maxStreak,
  onPlayAgain
}: FinalScoreProps) {
  const averageTime = totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0;

  return (
    <div className="text-center py-8">
      <div className="mb-8">
        <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-6">
          <span className="text-6xl">🎉</span>
        </div>
        <h2 className="text-5xl font-bold text-gray-800 mb-4">Hoàn thành!</h2>
        <p className="text-xl text-gray-600">Chúc mừng bạn đã hoàn thành bài quiz</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200">
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tổng câu hỏi</p>
          <p className="text-2xl font-bold text-blue-800">{totalQuestions}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl">✅</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Câu đúng</p>
          <p className="text-2xl font-bold text-green-800">{correctAnswers}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg border border-yellow-200">
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl">⏱️</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Thời gian TB</p>
          <p className="text-2xl font-bold text-yellow-800">{averageTime}s</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200">
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl">🏆</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tổng điểm</p>
          <p className="text-2xl font-bold text-purple-800">{score}</p>
        </div>
      </div>

      {/* Streak Display */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 mb-10 max-w-md mx-auto border border-orange-200">
        <div className="flex items-center justify-center mb-1">
          <span className="text-2xl">🔥</span>
        </div>
        <p className="text-sm text-gray-600">Chuỗi đúng dài nhất</p>
        <p className="text-xl font-bold text-orange-800">{maxStreak}</p>
      </div>

      <button
        onClick={onPlayAgain || (() => window.location.reload())}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 px-12 rounded-3xl transition-all transform hover:scale-105 shadow-lg text-xl"
      >
        Chơi lại
      </button>
    </div>
  );
}