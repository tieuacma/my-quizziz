interface ScoreDisplayProps {
  score: number;
  scoreUpdateAnimation: boolean;
}

export default function ScoreDisplay({ score, scoreUpdateAnimation }: ScoreDisplayProps) {
  return (
    <div className={`absolute top-6 right-6 bg-gradient-to-r from-white via-purple-50 to-pink-50 bg-opacity-95 rounded-3xl px-8 py-4 shadow-2xl border-2 border-purple-300 z-10 transition-all duration-500 ease-in-out ${scoreUpdateAnimation ? 'scale-110 shadow-3xl ring-4 ring-purple-400 animate-pulse bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100' : ''}`}>
      <p className={`text-2xl font-bold text-gray-800 transition-transform duration-500 ease-in-out ${scoreUpdateAnimation ? 'scale-125 text-purple-700 drop-shadow-lg' : ''} drop-shadow-sm`}>Điểm: {score}</p>
    </div>
  );
}