const express = require("express"),
    router = express.Router();

var printer = require("printer"),
    filename = process.argv[2] || __filename;

//GET home page.
router.get("/", function (req, res) {
    res.render("index", { title: "Express" });
});

// print
router.get("/print", function (req, res) {
    // use: node printFile.js [filePath printerName]
    console.log('platform:', process.platform);
    console.log('try to print file: ' + filename);

    console.log('default printer: ', printer.getDefaultPrinterName());
    process.env[3] = 'Microsoft XPS Document Writer';

    const pr = printer.getPrinter(process.env[3]);
    console.log('set print :',pr)

    if (process.platform != 'win32') {
        printer.printFile({
            filename: filename,
            printer: process.env[3], // printer name, if missing then will print to default printer
            success: function (jobID) {
                console.log("sent to printer with ID: " + jobID);
            },
            error: function (err) {
                console.log(err);
            }
        });
    } else {
        // not yet implemented, use printDirect and text
        var fs = require('fs');
        printer.printDirect({
            data: fs.readFileSync(filename),
            printer: process.env[3], // printer name, if missing then will print to default printer
            success: function (jobID) {
                console.log("sent to printer with ID: " + jobID);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
    res.render("index", { title: "Express" });
});

module.exports = router;
