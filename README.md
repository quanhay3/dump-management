# 🎓 Ứng Dụng Ôn Tập Trắc Nghiệm

Ứng dụng web hiện đại để ôn tập trắc nghiệm với **ReactJS Frontend** và **NodeJS Backend**.

## ✨ Tính năng

### Frontend (ReactJS)
- ✅ Giao diện hiện đại với Styled Components
- ✅ Responsive design cho mọi thiết bị
- ✅ Single Page Application với React Router
- ✅ Kiểm tra đáp án real-time
- ✅ Thanh tiến trình và thống kê chi tiết
- ✅ Upload PDF với drag & drop

### Backend (NodeJS)
- ✅ RESTful API với Express.js
- ✅ Upload và parse file PDF tự động
- ✅ CORS support cho cross-origin requests
- ✅ Validation và error handling
- ✅ File upload với Multer

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
# Cài đặt tất cả dependencies
npm run install-all

# Hoặc cài đặt từng phần
npm install                    # Root dependencies
cd server && npm install       # Server dependencies  
cd client && npm install       # Client dependencies
```

### 2. Chạy ứng dụng

#### Chạy cả Frontend và Backend cùng lúc:
```bash
npm run dev
```

#### Hoặc chạy riêng từng phần:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

### 3. Truy cập ứng dụng
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📁 Cấu trúc dự án

```
quiz-app/
├── client/                 # ReactJS Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React Components
│   │   │   ├── Home.js     # Trang chủ
│   │   │   ├── Quiz.js     # Trang làm bài
│   │   │   ├── Results.js  # Trang kết quả
│   │   │   └── UploadPDF.js # Trang upload PDF
│   │   ├── App.js          # Main App component
│   │   └── index.js        # Entry point
│   └── package.json
├── server/                 # NodeJS Backend
│   ├── index.js           # Express server
│   ├── uploads/           # Thư mục lưu file upload
│   └── package.json
└── package.json           # Root package.json
```

## 🔌 API Endpoints

### Questions
- `GET /api/questions` - Lấy tất cả câu hỏi
- `GET /api/questions/:id` - Lấy câu hỏi theo ID
- `POST /api/submit-answer` - Kiểm tra đáp án
- `POST /api/submit-quiz` - Nộp bài và tính điểm

### File Upload
- `POST /api/upload-pdf` - Upload và parse file PDF

## 📄 Định dạng PDF được hỗ trợ

Để ứng dụng có thể parse PDF chính xác, file PDF cần tuân theo format:

```
1. Câu hỏi đầu tiên?
A. Đáp án A
B. Đáp án B  
C. Đáp án C
D. Đáp án D
Đáp án: A

2. Câu hỏi thứ hai?
A. Đáp án A
B. Đáp án B
C. Đáp án C  
D. Đáp án D
Đáp án: C
```

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client

### Backend  
- **Express.js** - Web framework
- **Multer** - File upload middleware
- **PDF-Parse** - PDF text extraction
- **CORS** - Cross-origin resource sharing

## 🎨 Tùy chỉnh

### Thay đổi theme colors
Chỉnh sửa các styled components trong từng file component để thay đổi màu sắc.

### Thêm câu hỏi mẫu
Chỉnh sửa mảng `questions` trong `server/index.js`.

### Cải thiện PDF parsing
Tùy chỉnh hàm `parsePdfToQuestions()` trong `server/index.js` để phù hợp với format PDF của bạn.

## 🚀 Deploy

### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
# Upload thư mục build/ lên hosting
```

### Backend (Heroku/Railway)
```bash
cd server  
# Deploy theo hướng dẫn của platform
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.