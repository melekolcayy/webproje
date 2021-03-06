const mongoose = require('mongoose');
const mekan = mongoose.model('mekan');
const cevapOlustur = function (res, status, content) {
    res
        .status(status)
        .json(content);

};
const mekanlariListele = async (req, res) => {
    //url den enlem ve boylam parametrelerini al
    var boylam = parseFloat(req.query.boylam);
    var enlem = parseFloat(req.query.enlem);
    //var maksimumMesafe=req.query.mm
    //alınan bilgilerden nokta tanımlama
    var konum = {
        type: "Point",
        coordinates: [enlem, boylam]
    };//cografi secenekleri ekle
    if (!enlem || !boylam) {
        cevapOlustur(res, 404, { "mesaj": "enlem ve boylam zorunlu " });
        return;
    }
    try {
        const sonuclar = await mekan.aggregate([
            {
                $geoNear: {
                    near: konum,
                    distanceField: "mesafe",
                    key: "koordinatlar",
                    spherical: true,
                    maxDistance: 20000,
                    limit: 10
                }
            }
        ]);
        //dönen sonuçalrı tutacagımız diziyi tanımla
        //maple sadece anasayfada yer alacak bilgileri geitr
        const mekanlar = sonuclar.map(sonuc => {
            return {
                id: sonuc._id,
                ad: sonuc.ad,
                adres: sonuc.adres,
                puan: sonuc.puan,
                imkanlar: sonuc.imkanlar,
                mesafe: sonuc.mesafe.toFixed() + 'm'
            }
        });
        cevapOlustur(res, 200, mekanlar);
    } catch (hata) {
        cevapOlustur(res, 404, hata);
    }
}
const mekanEkle = function (req, res) {
    mekan.create({
        ad: req.body.ad,
        adres: req.body.adres,
        imkanlar: req.body.imkanlar.split(","),
        koordinatlar: [parseFloat(req.body.enlem), parseFloat(req.body.boylam)],
        saatler: [
            {
                gunler: req.body.gunler1,
                acilis: req.body.acilis1,
                kapanis: req.body.kapanis1,
                kapali: false,

            }, {
                gunler: req.body.gunler2,
                acilis: req.body.acilis2,
                kapanis: req.body.kapanis2,
                kapali: false,
            }]
    }, function (hata, mekan) {
        if (hata) {
            cevapOlustur(res, 400, hata);
        } else {
            cevapOlustur(res, 201, mekan);
        }
    });
};
const mekanGetir = function (req, res) {
    if (req.params && req.params.mekanid) {
        mekan.findById(req.params.mekanid)
            .exec(
                function (hata, mekan) {
                    if (!mekan) {
                        cevapOlustur(res, 404, { "durum": "mekanid bulunamadı" });
                        return;
                    }
                    else if (hata) {
                        cevapOlustur(res, 404, hata);
                        return;
                    }
                    cevapOlustur(res, 200, mekan);
                }
            );
    }
    else
        cevapOlustur(res, 404, { "durum": "istekte mekanid yok" });
}


const mekanGuncelle = function (req, res) {
    if (!req.params.mekanid) {
        cevapOlustur(res, 404, { "mesaj": "Bulunamadı.mekanid gerekli" });
        return;

    }
    mekan
        .findById(req.params.mekanid)
        .select('-yorumlar -puan')
        .exec(
            function (hata, gelenMekan) {
                if (!gelenMekan) {
                    cevapOlustur(res, 404, { "mesaj": "mekanid bulunamadı" });
                    return;
                } else if (hata) {
                    cevapOlustur(res, 400, hata);
                    return;
                }
                gelenMekan.ad = req.body.ad;
                gelenMekan.adres = req.body.adres;
                gelenMekan.imkanlar = req.body.imkanlar.split(",");
                gelenMekan.koordinatlar = [parseFloat(req.body.enlem), parseFloat(req.body.boylam)];
                gelenMekan.saatler = [{
                    gunler: req.body.gunler1,
                    acilis: req.body.acilis1,
                    kapanis: req.body.kapanis1,
                    kapali: false,


                }, {
                    gunler: req.body.gunler2,
                    acilis: req.body.acilis2,
                    kapanis: req.body.kapanis2,
                    kapali: false,

                }];
                gelenMekan.save(function (hata, mekan) {
                    if (hata) {
                        cevapOlustur(res, 404, hata);

                    } else {
                        cevapOlustur(res, 200, mekan);
                    }
                });
            });
}
const mekanSil = function (req, res) {
    var mekanid = req.params.mekanid;
    if (mekanid) {
        mekan
            .findByIdAndRemove(mekanid)
            .exec(
                function (hata, gelanMekan) {
                    if (hata) {
                        cevapOlustur(res, 404, hata);
                        return;
                    }
                    cevapOlustur(res, 204, null);
                }
            );

    } else {
        cevapOlustur(res, 404, { "mesaj": "mekanid bulunamadı" });
    }
};





const aktifMekanListe = function (req, res) {
    mekan.find({}, function (hata, sonuclar){
        var mekanlar = [];
          if (hata) {
            cevapOlustur (res, 404, hata);
          } else {//her bir sonucu dolaş ve mekanlara ekle
            sonuclar.forEach(function(sonuc) {
                mekanlar.push({
                    ad: sonuc.ad,
                    adres: sonuc.adres,
                    puan: sonuc.puan,
                    imkanlar: sonuc.imkanlar,
                    _id: sonuc._id
                }); });
            cevapOlustur (res, 200, mekanlar);
            }
        });
    
};


module.exports = {
    mekanlariListele,
    mekanEkle,
    mekanGetir,
    mekanGuncelle,
    mekanSil,
    aktifMekanListe
};  