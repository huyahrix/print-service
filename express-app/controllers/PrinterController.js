/**
 * @copyright 2021 © DigiNet
 * @author ngochuy
 * @create 2021/04/12
 * @update 2021/04/12
 */
'use strict';
const printer = require("printer");

const PrinterController = {
    listPrinters: async (req, res) => {
        const pr = printer.getPrinters();
        return res.ok(pr);
    },
};

module.exports = PrinterController;
