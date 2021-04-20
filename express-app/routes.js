/**
 * @copyright 2021 © DigiNet
 * @author ngochuy
 * @create 2021/04/20
 * @update 2021/04/20
 */
'use strict';

const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    PrinterController = require('./controllers/PrinterController');

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
    }
})

var upload = multer({ storage: storage })

//GET home page.
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('*/printer/list-printer', PrinterController.listPrinters);
// router.post('*/printer/print', multer().array('formData'), PrinterController.print);
router.post('*/printer/print', upload.single('file'), PrinterController.print);
router.post('*/printer/print-test', upload.single('file'), PrinterController.printTest);
router.put('*/printer/default-printer', PrinterController.defaultPrinter);

module.exports = router;
