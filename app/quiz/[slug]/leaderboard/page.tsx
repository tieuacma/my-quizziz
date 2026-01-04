import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function LeaderboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Truy vấn lấy Top 10 bảng xếp hạng
  const { data: leaderboard, error } = await supabase
    .from('quiz_sessions')
    .select(`
      score,
      user_id,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq('quiz_slug', slug)
    // .eq('status', 'finished') // Mở comment nếu bạn có logic status
    .order('score', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Lỗi lấy bảng xếp hạng:", error);
    return <div>Không thể tải bảng xếp hạng.</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Bảng Xếp Hạng
        </h1>

        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-gray-400 uppercase text-sm">
              <tr>
                <th className="px-6 py-4">Hạng</th>
                <th className="px-6 py-4">Người chơi</th>
                <th className="px-6 py-4 text-right">Điểm số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leaderboard?.map((entry: any, index: number) => (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-5 font-bold text-lg">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </td>
                  <td className="px-6 py-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs">
                      {entry.profiles?.avatar_url ? (
                        <img src={entry.profiles.avatar_url} alt="avatar" className="rounded-full" />
                      ) : (
                        entry.profiles?.username?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="font-medium text-gray-200">
                      {entry.profiles?.username || "Ẩn danh"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-xl text-yellow-500">
                    {entry.score.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {leaderboard?.length === 0 && (
            <p className="p-10 text-center text-gray-500">Chưa có ai tham gia lượt chơi này.</p>
          )}
        </div>
      </div>
    </main>
  );
}