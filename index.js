// index nơi làm gì? :
// 1 nới để kết nối hỗ trợ những thư viên lớn nhất của dự án đó
// 2 setup môi trường vd: database, PORT
// 3 trỏ đường dẫn về kết nối lưu trữ dữ liệu và đường dẫn đến thiết kê FE
// 4 kết nối những phần mềm trung gian

// index.js là lõi để kết nối nên được ưu tiên chạy đồng nghĩa nó là main
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

// Giả định môi trường, nếu mà port lỗi thì chạy server port:3000
const app = express();
const PORT = process.env.PORT || 3000;

// tạo hằng số đường dẫn đến thiết kế css, js, ... 
const path = require('path');

// dẫn truyền đến thư mục code fe
// Thiết lập thư mục "views/layout/assets" là thư mục chứa các tài nguyên tĩnh
// Thêm module path: Module path được sử dụng để xử lý đường dẫn một cách chính xác, đảm bảo ứng dụng hoạt động trên các hệ điều hành khác nhau.
// Sử dụng express.static: Hàm express.static được dùng để thiết lập một thư mục là nơi chứa các tài nguyên tĩnh (như CSS, JavaScript, hình ảnh).
// path.join(__dirname, 'views', 'layout', 'assets'):
// __dirname: Biến toàn cục chứa đường dẫn đến thư mục hiện tại (thư mục chứa file index.js).
// path.join: Hàm nối các phần đường dẫn lại với nhau một cách an toàn và phù hợp với hệ điều hành.
// Kết quả của path.join sẽ là đường dẫn tuyệt đối đến thư mục assets.
app.use(express.static(path.join(__dirname, 'views', 'layout', 'assets')));


app.listen(PORT,() =>{
    console.log(`Server started at http://localhost:${PORT}`);
})

//database connection new
mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;

db.on("error",(error) => console.error("MongoDB connection error:",error));
db.once("open",() => console.log("Connected to the database!"));

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    session({
        secret:"100177",
        saveUninitialized: true,
        resave: false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// thiết lập EJS làm template engine mặc định cho ứng dụng Express.js
// Tương ứng
app.set('view engine','ejs');

// nhận kết nối index.js với routes.js
app.use("", require("./routes/routes"));

// trở file upload
app.use(express.static("upload"));