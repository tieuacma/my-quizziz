import { useEffect, useState } from "react";

interface PointsAnimationProps {
  showPointsAnimation: boolean;
  pointsEarned: number;
}

export default function PointsAnimation({ showPointsAnimation, pointsEarned }: PointsAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'fadeIn' | 'move' | 'fadeOut'>('fadeIn');

  useEffect(() => {
    if (showPointsAnimation) {
      setAnimationPhase('fadeIn');
      const timer1 = setTimeout(() => setAnimationPhase('move'), 200);
      const timer2 = setTimeout(() => setAnimationPhase('fadeOut'), 600);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [showPointsAnimation]);

  if (!showPointsAnimation) return null;

  const getClass = () => {
    switch (animationPhase) {
      case 'fadeIn':
        return 'opacity-100 translate-y-0 scale-110';
      case 'move':
        return 'opacity-100 -translate-y-12 scale-100';
      case 'fadeOut':
        return 'opacity-0 -translate-y-12 scale-90';
      default:
        return 'opacity-0';
    }
  };

  return (
    <div className="absolute top-20 right-6 z-10 transition-all duration-300 ease-linear">
      <div className={`text-green-500 font-bold text-2xl transform ${getClass()} animate-pulse filter drop-shadow-lg`}>
        +{pointsEarned} điểm
      </div>
    </div>
  );
}