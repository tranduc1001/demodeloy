// file routes là nơi xủ lý code logic của BE
const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require("fs");


// image upload
var storage = multer.diskStorage({
    // hàm xác định mục lưu trữ file ảnh
    destination: function(req, file, cb){
        cb(null, './upload')
    },
    // hàm này xác định tên file ảnh khi lưu trữ 
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});
//  phần này tạo ra 1 middleware upload sử dụng cấu hình lưu trữ đã định nghĩa
var upload = multer({
    storage: storage,
}).single('image');

// insert an user into database route
// VERSION cũ (dùng callback)
// router.post("/add", upload, (req, res) => {
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         image: req.file.filename,
//     });
//     user.save((err) => {
//         if (err) {
//             res.json({message: err.message, type: 'danger'});
//         } else {
//             req.session.message = {
//                 type: "success",
//                 message: "User added successfully!",
//             }
//         };
//         res.redirect("/")
//     });
// });

// VERSION MỚI (dùng Promise)
router.post("/add", upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });

    user.save()
        .then(() =>{
            req.session.message = {
                type: "success",
                message: "User added successfully!",
            };
            res.redirect("/");
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger'});
        });
});


// hiển thị cho user thấy promise version
// add users page
router.get("/add", (req, res) =>{
    res.render("add_users", {title: "Add Users"});
})

// Trả câu lệnh thông báo về trang chủ thành công hay thất bại Phiên bản callback(cũ)
// router.get("/", (req, res) =>{
//     User.find().exec((err, users) =>{
//         if (err) {
//             res.json({ message: err.message });
//         } else {
//             res.render('index',{
//                 title: 'Home Page',
//                 users: users,
//             });
//         }
//     });
// });

// Trả câu lệnh thông báo về trang chủ thành công hay thất bại Phiên bản promise(mới)
router.get("/", (req, res) => {
    User.find()
        .exec()
        .then(users =>{
            res.render('index', {
                title: 'Home Page',
                users: users,
        });
    })
    .catch(err => {
        res.json({ message: err.message });
    });
});

// Check lại router đã exports hoặc có trục trặc j ở cuối route.js
module.exports = router;

// Update an user route
// old version bản callback
// router.get("/edit/:id", (req, res) => {
//     let id = req.params.id;
//     User.findById(id, (err, user) => {
//         if (err) {
//             res.redirect("/");
//         } else {
//             if (user == null) {
//                 res.redirect("/");
//             } else {
//                 res.render("edit_users", {
//                     title: "Update User",
//                     user: user,
//                 });
//             }
//         }
//     });
// });

// New version then catch
router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then(user => {
            if (user == null) {
                res.redirect("/");
            } else {
                res.render("edit_users", {
                    title: "Update User",
                    user: user,
                });
            }
        })
        .catch(err => {
            res.redirect("/");
        });
});

// UPDATE XỬ LÝ ẢNH UPLOADS PHIÊN BẢN CALLBACK
// old version Callback();
// router.post("/edit/:id", upload, (req, res) => {
//     let id = req.params.id;
//     let new_image = "";

//     if (req.file) {
//         new_image = req.file.filename;
//         try {
//             fs.unlinkSync("./upload/", + req.body.old_image);
//         } catch (err) {
//             console.log(err);
//         }
//     } else {
//         new_image = req.body.old_image;
//     }

//     User.findByIdAndUpdate(id, {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         image: new_image,
//     }, (err, result) => {
//         if (err) {
//             res.json({ message: err.message, type: 'danger' });
//         } else {
//             req.session.message = {
//                 type: 'success',
//                 message: 'User updated successfully!'
//             };
//             res.redirect('/');
//         }
//     });
// });

// New version router async/await
// UPDATE BẢN ASYNC/AWAIT 
router.post("/edit/:id", upload, async(req, res) => {
    try {
        let id = req.params.id;
        let new_image = "";

        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync("./upload/", + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            new_image = req.body.old_image; 

        }

        const result = await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,

        });

        req.session.message = {
            type: 'success',
            message: 'User updated successfully!'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Delete user route
// old version callback
// router.get("/delete/:id", (req, res) => {
//     let id = req.params.id;
//     User.findByIdAndDelete(id, (err, result) => {
//         if (result.image != "") {
//             try {
//                 fs.unlinkSync("./upload/", + result.image);
//             } catch (err) {
//                 console.log(err);
//             }
//         }

//         if (err) {
//             res.json({ message: err.message });
//         } else {
//             req.session.message = {
//                 type: "info",
//                 message: "User deleted successfully!"
//             };
//             res.redirect("/"); 

//         }
//     });
// });

// New version async/await
router.get("/delete/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const result = await User.findByIdAndDelete(id);

        if (result.image != "") {
            try {
                fs.unlinkSync("./upload/", + result.image);
            } catch (err) {
                console.log(err);
            }
        }

        req.session.message = {
            type: "info",
            message: "User deleted successfully!"
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message });
    }
});