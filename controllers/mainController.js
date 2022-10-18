require('dotenv').config();
const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const Ketari = require('../models/ketariModel');
const upload_path = require('../upload_path');

const router = express.Router();

//multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ '-' + file.originalname.replace(/\\/g, "/"));
    }
});
  
const upload = multer({ storage: storage });
//const upload = multer({dest: './uploads'});


//for all data
router.route("/main")

.get(function(req, res){
    Ketari.find(function(err, data){
        if(!err){
            res.send(data);
        }
        else{
            res.send(err);
        }
    });
})


.post(upload.any(), function(req, res){
    const r = req.body;

    // const imgData = {
    //     data: fs.readFileSync(
    //         path.join(
    //             __dirname + '/uploads/' + req.file
    //             )
    //         ),
    //     contentType: 'image/png'
    // };
    // const imgData = {
    //     data: req.file.buffer,
    //     contentType: req.file.mimetype
    // };
    // const remove = path.join(
    //     __dirname,'..',
    //     'public'
    // );
    //const imageArray = [];
    const image =  req.files;
    const host = upload_path;
    const imgData = image.map(
        file => host.replace(/\\/g, '/') + '/' + file.path.replace(/\\/g, '/')
    );
    //const filePath = req.protocol + "://" + host + '/' + req.file.path;

    //upload img
    // for (var i = 0; i < image.length; i++){
    //     imageArray.push(imgData);
    // }
    //console.log(image.length);

    const newKetari = Ketari({
        noSiri: r.noSiri,
        ic: r.ic,
        icLama: r.icLama,
        email: r.email,
        phoneNo: r.phoneNo,
        nama: r.nama,
        jantina: r.jantina,
        noRumah: r.noRumah,
        kodLokaliti: r.kodLokaliti,
        namaLokaliti: r.namaLokaliti,
        namaParlimen: r.namaParlimen,
        namaDM: r.namaDM,
        namaDun: r.namaDun,
        negeri: r.negeri,
        tahunLahir: r.tahunLahir,
        tindakan: r.tindakan,
        // img: {
        //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.img)),
        //     contentType: 'image/png'
        // },
        img: imgData,
        bantuan: r.bantuan,
    });

    newKetari.save(function(err){
        if(!err){
            res.send("Successfully added");
        }
        else{
            res.send(err);
        }
    });

    //console.log(imgData);
})

.delete(function(req, res){
    Ketari.deleteMany(function(err){
        if(!err){
            res.send("Successfully delete all data");
        }
        else{
            res.send(err);
        }
    });
});


//for specific one data
router.route("/one_data")

.get(function(req, res){
    Ketari.findOne(
        {"_id": req.query.id},
        function(err, data){
            if(!err){
                res.send(data);
            }
            else{
                res.send(err);
            }
        }
    );
})

// //modify all data
// .put(function(req, res){
//     Ketari.updateMany(
//         {"_id": req.params.id},

//     );
// })

// //modify partial data
// .patch(function(req, res){
//     Ketari.updateOne(
//         {"_id": req.params.id},
        
//     );
// })

//update one document
.put(upload.any(), function(req, res){
    const r = req.body;

    const arrayImg = [];
    const image =  req.files;
    const host = upload_path;
    const imgData = image.map(
        file => host.replace(/\\/g, '/') + '/' + file.path.replace(/\\/g, '/')
    );

    //console.log(arrayImg);

    // Ketari.findOne(
    //     {"_id": req.query.id},
    //     function(err, data){
    //         if(!err){
    //             //console.log(data.img);
    //             arrayImg.push(data.img);
    //             arrayImg.push(imgData);
    //         }
    //         else{
    //             res.send(err);
    //         }
    //     }
    // );

    Ketari.findByIdAndUpdate(
        {"_id": req.query.id},
        {
            noSiri: r.noSiri,
            ic: r.ic,
            icLama: r.icLama,
            email: r.email,
            phoneNo: r.phoneNo,
            nama: r.nama,
            jantina: r.jantina,
            noRumah: r.noRumah,
            kodLokaliti: r.kodLokaliti,
            namaLokaliti: r.namaLokaliti,
            namaParlimen: r.namaParlimen,
            namaDM: r.namaDM,
            namaDun: r.namaDun,
            negeri: r.negeri,
            tahunLahir: r.tahunLahir,
            tindakan: r.tindakan,
            img: imgData,
            bantuan: r.bantuan
        },
        { new: true},
        function(err, data){
            if(!err){
                res.send(data);
            }
            else{
                res.send(err);
            }
        }
    );

})

.delete(function(req, res){
    Ketari.deleteOne(
        {"_id": req.query.id},
        function(err){
            if(!err){
                res.send("Successfully delete the data");
            }
            else{
                res.send(err);
            }
        }
    );
});


router.route("/excel_file")
.get(function(req, res){
    var wb = XLSX.utils.book_new();

    Ketari.find(function(err, data){
        if(!err){
            var temp = JSON.stringify(data);
            temp = JSON.parse(temp);
            var ws = XLSX.utils.json_to_sheet(temp);
            var down = __dirname+'\assets\exportdata.xlsx';
            XLSX.utils.book_append_sheet(wb, ws, "sheet1");
            XLSX.writeFile(wb, down);
            res.download(down);
        }
        else{
            res.send(err);
        }
    });
});

module.exports = router;