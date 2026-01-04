import clientPromise from "@/lib/mongodb/client";
import { NextResponse } from "next/server";

// Ép Next.js luôn thực hiện fetch mới, không cache kết quả lỗi
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Kiểm tra biến môi trường
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("❌ MONGODB_URI is undefined in environment variables");
      return NextResponse.json(
        { success: false, error: "Missing MONGODB_URI" },
        { status: 500 }
      );
    }

    // Log chuỗi URI đã ẩn mật khẩu để kiểm tra cấu hình trên Vercel
    const maskedUri = uri.replace(/:([^@]+)@/, ":******@");
    console.log("⏳ Connecting to MongoDB with URI:", maskedUri);

    // 2. Kết nối tới Client
    const client = await clientPromise;
    
    // 3. Chọn Database
    // Sử dụng db() không tham số để lấy database mặc định từ chuỗi kết nối (quizziz)
    // Nếu vẫn lỗi "bad auth", hãy thử đổi thành client.db("test") 
    const db = client.db(); 
    
    console.log("✅ MongoDB Client connected. Fetching quizzes...");

    // 4. Truy vấn dữ liệu từ collection 'quizzes'
    const quizzes = await db
      .collection("quizzes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`Successfully fetched ${quizzes.length} quizzes.`);

    return NextResponse.json(quizzes);

  } catch (error: any) {
    // Log lỗi chi tiết ra console của Vercel
    console.error("❌ API ERROR:", error.message);

    // Trả về lỗi chi tiết để bạn thấy được trên trình duyệt
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal Server Error", 
        error: error.message,
        suggestion: "Check if your IP is whitelisted and credentials are correct."
      },
      { status: 500 }
    );
  }
}