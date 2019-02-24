var mongoose = require('mongoose');
var dbURI = 'mongodb://melekolcay:olcay.98@ds123444.mlab.com:23444/mekan32';

mongoose.set('useNewUrlParser', true);
//mongoose.set('useFindAndModify', false);
//mongoose.set('useCreateIndex', true);

mongoose.connect(dbURI, {useNewUrlParser: true,useCreateIndex:true,useFindAndModify:false});
 

//bağlandığında konsola beğlantı bilgilerini yazdırır.
mongoose.connection.on('connected', function(){ 
	console.log('Mongoose '+ dbURI+
	'adresindeki veritabanına bağlandı\n');

}); 

// bağlantı hastası olduğunda konsola hata bilgisini yazdır
mongoose.connection.on('error', function (err){ 
	console.log('Mongoose bağlantı hatası\n:'+ err);
}); 

//Bağlantı kesildiğinde konsola kesildi bilgisi yaz
mongoose.connection.on('disconnected', function(){ 
	console.log('Mongoose bağlantısı kesildi\n');
}); 

kapat = function(msg, callback){ 
	mongoose.connection.close(function() { 
		console.log('Mongoose kapatıldı\n ' +msg);
		callback();
	});
}; 
//nodemon kullanıyorsanız ayrı bir kapatma işlemi gerekir.
process.once('SIGUSR2', function(){ 
	kapat('nodemon kapatıldı\n', function(){ 
		process.kill(process.pid,'SIGUSR2');
	});
});

process.on('SIGNIT', function() { 
	kapat('Uygulama kapatıldı\n', function() { 
		process.exit(0);
	});
});
require('./mekansema');
