const mongoose = require('mongoose');

const ketariSchema = {
    noSiri: String,
    ic: String,
    icLama: String,
    email: String,
    phoneNo: String,
    nama: String,
    jantina: String,
    noRumah: String,
    kodLokaliti: String,
    namaLokaliti: String,
    namaParlimen: String,
    namaDM: String,
    namaDun: String,
    negeri: String,
    tahunLahir: String,
    tindakan: String,
    // img: {
    //     data: Buffer,
    //     contentType: String
    // },
    // img: [String],
    img: Array,
    bantuan: String,
}

module.exports = mongoose.model("Ketari", ketariSchema);