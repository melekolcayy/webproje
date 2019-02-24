var express = require('express');
var router = express.Router();

var ctrlMekanlar =require('../controllers/mekanlar');
var ctrlDigerleri =require('../controllers/digerleri');



router.get('/',ctrlMekanlar.anaSayfa);

router.get('/mekan/:mekanid',ctrlMekanlar.mekanBilgisi);

router.get('/mekan/:mekanid/yorum/yeni',ctrlMekanlar.yorumEkle);
router.post('/mekan/:mekanid/yorum/yeni',ctrlMekanlar.yorumumuEkle);

router.get('/hakkinda',ctrlDigerleri.hakkinda);

router.get('/admin', ctrlMekanlar.adminSayfa);

router.get('/admin/mekan/yeni', ctrlMekanlar.mekanEkle);

router.post('/admin/mekan/yeni', ctrlMekanlar.mekaniEkle);

router.get('/admin/mekan/:mekanid/sil', ctrlMekanlar.mekanSil);

router.get('/admin/mekan/:mekanid/guncelle', ctrlMekanlar.mekanGuncelle);

router.post('/admin/mekan/:mekanid/guncelle', ctrlMekanlar.mekaniGuncelle);


module.exports=router;

