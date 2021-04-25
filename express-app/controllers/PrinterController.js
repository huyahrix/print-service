/**
 * @copyright 2021 © DigiNet
 * @author ngochuy
 * @create 2021/04/12
 * @update 2021/04/12
 */
'use strict';

const printer = require('pdf-to-printer');
const fs = require('fs');
const path = require('path');

const PrinterController = {
    print: async (req, res) => {
        console.log('===== print');
        const params = req.body;
        console.log('params', params)
        console.log("req.file", req.file);
        console.log('process.env.NODE_ENV', process.env.NODE_ENV);

        if (!params.PrinterName) {
            return res.badRequest({ code: 'ValidationError', message: '\"PrinterName\" is required' })
        }
        if (!req.file) {
            return res.badRequest({ code: 'ValidationError', message: '\"file\" is required' })
        }

        let filePath;
        try {
            if (process.env.NODE_ENV === 'electron') {
                // electron build 
                filePath = path.join(__dirname, '../../', req.file.path);
            } else {
                // service build 
                filePath = path.join(__dirname, '../', req.file.path);
            }
            console.log('filePath', filePath);
        } catch (error) {
            console.error(error);
            return res.badRequest(error);
        }

        const options = {
            printer: params.PrinterName,
            unix: ['-o fit-to-page'],
            win32: ['-print-settings "fit"'],
        };

        printer
            .print(filePath, options)
            .then(() => {
                res.ok({ status: 'completed' });
            })
            .catch(error => {
                console.error(error);
                return res.badRequest(error);
            })
            .finally(() => {
                console.info('unlinkSync ' + filePath);
                try {
                    fs.unlinkSync(filePath);
                } catch (error) {
                    console.error(error)
                }

            });
    },
    listPrinters: async (req, res) => {
        console.log('===== listPrinters');
        printer.getPrinters().then(result => {
            return res.ok(result);
        }).catch(error => {
            console.error(error);
            return res.badRequest(error);
        });
    },
    defaultPrinter: async (req, res) => {
        console.log('===== defaultPrinter');
        const params = req.body;
        console.log(params)
        req.app.locals.defaultPrinter = params.PrinterName;

        return res.ok({ defaultPrinter: req.app.locals.defaultPrinter });
    },
    printTest: async (req, res) => {
        console.log('===== printTest');
        const params = req.body;
        console.log(params)

        if (!params.PrinterName) {
            return res.badRequest({ code: 'ValidationError', message: '\"PrinterName\" is required' })
        }

        let filePath;
        try {
            if (process.env.NODE_ENV === 'electron') {
                // electron build 
                filePath = path.join(__dirname, '../../uploads/Invoice Template Seablue.pdf');
            } else {
                // service build 
                filePath = path.join(__dirname, '../uploads/Invoice Template Seablue.pdf');
            }
            console.log('filePath', filePath);
        } catch (error) {
            console.error(error);
            return res.badRequest(error);
        }

        const options = {
            printer: params.PrinterName,
            paper: 'B5',
            unix: ['-o fit-to-page'],
            win32: ['-print-settings "paper=B5"'],
        };

        printer
            .print(filePath, options)
            .then(() => {
                res.ok({ status: 'completed' });
            })
            .catch(error => {
                console.error(error);
                return res.badRequest(error);
            })
            .finally(() => {
            });
    },
};

module.exports = PrinterController;
