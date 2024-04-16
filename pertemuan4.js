// Dataset Rumah

let dataFromExcel = [
    [3, 150, 'Kota', 500],
    [2, 100, 'Kota', 400],
    [2, 150, 'Kota'],
    [4, 200, 'Desa', 400],
    [4, 200, 'Desa', 410],
    [4, 200, 'Desa', 420],
    [5, 250, 'Desa', 600],
    [1, 50, '', 50],
    [1, 50, 50, 'Gurun Pasir', 50],
    [2, 100, 'Kota', 400],
    [3, 110, 'Kota', 400],
    [2, 110, 'Kota', 600],
    [5, 110, 'Kota', 600],
    [6, 110, 'Kota', 600],
    [3, 110, 'Kota', 600],
]

let dataHasilLatihanModel;

function trainModel (dataset) {

// Fungsi untuk Pencatatan Data
let koefisienKamar, koefisienLuas, koefisienLokasi, koefisienHarga;

// Fungsi untuk Validasi dan Verifikasi Data
let dataTervalidasiDanTerverifikasi = [];

// Tahap Proses Validasi dan Verifikasi Data
for (index = 0; index < dataset.length; index++) {
    let dataKamar;
    let dataLuas;
    let dataLokasi;
    let dataHarga;

    // Proses Validasi Data
    if (typeof(dataset[index][0]) == "number") {
        dataKamar = dataset[index][0];
    }

    if (typeof(dataset[index][1]) == "number") {
        dataLuas = dataset[index][1];
    }

    if (typeof(dataset[index][2]) == "string") {
        if (dataset[index][2] == 'Desa' || dataset[index][2] == 'Kota') {
            dataLokasi = dataset[index][2];
        }
    }

    if (typeof(dataset[index][3]) == "number") {
        dataHarga = dataset[index][3];
    }

    // Proses Verifikasi Data
    if (dataset[index].length == 4 && typeof(dataset[index][index]) != 'undefined') {
        dataTervalidasiDanTerverifikasi.push(dataset[index]);
    }
};

// Fungsi untuk Transformasi Data

for (index = 0; index < dataTervalidasiDanTerverifikasi.length; index++) {
    dataTerformat = {
        'kamar' : dataTervalidasiDanTerverifikasi[index][0],
        'luas' : dataTervalidasiDanTerverifikasi[index][1],
        'lokasi' : dataTervalidasiDanTerverifikasi[index][2],
        'harga' : dataTervalidasiDanTerverifikasi[index][3],
    }

    dataTervalidasiDanTerverifikasi.splice(index, 1, dataTerformat);
}

// Fungsi untuk Analisis Data

// Menentukan nilai rata-rata
meanKamar = dataTervalidasiDanTerverifikasi.reduce((total, rumah) => total + rumah.kamar, 0) / dataTervalidasiDanTerverifikasi.length;

meanLuas = dataTervalidasiDanTerverifikasi.reduce((total, rumah) => total + rumah.luas, 0) / dataTervalidasiDanTerverifikasi.length;

meanHarga = dataTervalidasiDanTerverifikasi.reduce((total, rumah) => total + rumah.harga, 0) / dataTervalidasiDanTerverifikasi.length;


// Analisis Koefisien Kamar
numeratorKamar =  dataTervalidasiDanTerverifikasi.reduce((total, rumah) => total + (rumah.kamar - meanKamar) * (rumah.harga - meanHarga), 0);

denominatorKamar = dataTervalidasiDanTerverifikasi.reduce((total, rumah) => total + Math.pow(rumah.kamar - meanKamar, 2), 0);

koefisienKamar = numeratorKamar / denominatorKamar;


// Analisis Koefisien Luas
numeratorLuas = dataTervalidasiDanTerverifikasi.reduce((total, rumah) => total + (rumah.luas - meanLuas) * (rumah.harga - meanHarga), 0);

denominatorLuas = dataTervalidasiDanTerverifikasi.reduce((total, rumah) => total + Math.pow(rumah.luas - meanLuas, 2), 0);

koefisienLuas = numeratorLuas / denominatorLuas;

// Analisis Koefisien Lokasi
let hargaKota = dataTervalidasiDanTerverifikasi.filter(rumah => rumah.lokasi == 'Kota').reduce((total, rumah) => total + rumah.harga, 0) / dataTervalidasiDanTerverifikasi.filter(rumah => rumah.lokasi == 'Kota').length;

let hargaDesa = dataTervalidasiDanTerverifikasi.filter(rumah => rumah.lokasi == 'Desa').reduce((total, rumah) => total + rumah.harga, 0) / dataTervalidasiDanTerverifikasi.filter(rumah => rumah.lokasi == 'Desa').length;

koefisienLokasi = (hargaKota - hargaDesa) / 1;

// Analisis Koefisien Harga
koefisienHarga = meanHarga - (koefisienKamar * meanKamar) - (koefisienLuas * meanLuas) - koefisienLokasi;

// Fungsi untuk Interpretasi Data
dataHasilLatihanModel = { koefisienKamar, koefisienLuas, koefisienLokasi, koefisienHarga};

return { koefisienKamar, koefisienLuas, koefisienLokasi, koefisienHarga}

}

// Proses melatih model
let dataHasilLatihModel = trainModel(dataFromExcel);

function prediksiHargaRumah (model, jumlahKamar, luasRumah, lokasiRumah) {
    const hasilHargaPrediksi = model.koefisienHarga + model.koefisienKamar * jumlahKamar + model.koefisienLuas * luasRumah + model.koefisienLokasi * (lokasiRumah == 'Kota' ? 1 : 0);
    return hasilHargaPrediksi;
}

// Mulai melakukan prediksi harga rumah
let jumlahKamar = 3;
let luasRumah = 180;
let lokasiRumah = 'Kota';
let hargaPrediksi = prediksiHargaRumah(dataHasilLatihModel, jumlahKamar, luasRumah, lokasiRumah);

console.log("Hasil Prediksi Harga Rumah:");
console.log("Jumlah Kamar : " + jumlahKamar);
console.log("Jumlah Luas : " + luasRumah);
console.log("Jumlah Luas : " + lokasiRumah);
console.log("Harga Hasil Prediksi: Rp. " + hargaPrediksi.toFixed(2) + " Juta");


console.log('');
console.log(dataHasilLatihanModel);