import clientPromise from "@/lib/mongodb/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Kiểm tra xem biến môi trường có tồn tại không trước khi kết nối
    if (!process.env.MONGODB_URI) {
      console.error("❌ Lỗi: Biến MONGODB_URI không tồn tại trong .env.local");
      return NextResponse.json(
        { success: false, message: "Thiếu cấu hình biến môi trường trên Server." },
        { status: 500 }
      );
    }

    // 2. Chờ kết nối tới MongoDB
    console.log("⏳ Đang thử kết nối tới MongoDB Atlas...");
    const client = await clientPromise;
    const db = client.db("admin"); 
    
    // 3. Gửi lệnh ping tới server MongoDB để xác nhận kết nối sống
    await db.command({ ping: 1 });
    
    console.log("✅ Kết nối MongoDB thành công!");

    return NextResponse.json({ 
      success: true, 
      message: "Kết nối MongoDB thành công rực rỡ!",
      env_status: "Đã nhận biến môi trường"
    });

  } catch (error: any) {
    // 4. Bắt các lỗi cụ thể (Sai mật khẩu, Sai IP,...)
    console.error("❌ Lỗi kết nối Database chi tiết:", error.message);
    
    return NextResponse.json({ 
      success: false, 
      message: "Kết nối thất bại. Vui lòng kiểm tra Terminal để xem lỗi chi tiết.", 
      error: error.message 
    }, { status: 500 });
  }
}