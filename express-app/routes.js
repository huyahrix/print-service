const express = require("express"),
    router = express.Router();

var printer = require("printer"),
    filename = process.argv[2] || __filename;

const PrinterController = require('./controllers/PrinterController')

//GET home page.
router.get("/", function (req, res) {
    res.render("index", { title: "Express" });
});

// print
router.post("/print", function (req, res) {
    try {

        let { remote } = require("electron");
        const { PosPrinter } = remote.require("electron-pos-printer");

        const data = [
            {
                type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
                value:
                    `<html>
    <head>
        <meta charset="UTF8">
        <title>Printer Model</title>
    </head>
    <style type="text/css">
        *, *::before, *::after {
            box-sizing: border-box;
        }
        body { padding: 0; margin: 0; }
        #page-wrapper {
            text-align: center; width: 100%; height: 100vh ;
        }
        #segment {
            border: 0.3rem solid black;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.5rem;
            margin: 1rem;
        }
        .qr-code { }
        .inventory-information { }
        .inventory-base {  }
        .inventory-extend {  }
        input { border: none; }
        .row { display: flex; align-items: center;}
        .text {  padding: 0 2rem }
        .qr-img {
                    width: 50%;
                }
        p {font-size: 1.5rem;}
   </style>
    <body>
       <div id="page-wrapper">
       
           <section id="segment">
                                  <div class="inventory-information">
                                      <div class="inventory-base">
                                           <div class="qr-code">
                                              <img class="qr-img" src="data:image/jpeg;base64,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" />
                                           </div>
                                           <p>19-04-2021</p>
                                           <p>"0</p>
                                           <p>012364</p>
                                      </div>
                                      <div class="inventory-extend">
                                      
                                      </div>
                                  </div>
            </section>
         
           <section id="segment">
                                  <div class="inventory-information">
                                      <div class="inventory-base">
                                           <div class="qr-code">
                                              <img class="qr-img" src="data:image/jpeg;base64,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" />
                                           </div>
                                           <p>19-04-2021</p>
                                           <p>"0</p>
                                           <p>012364</p>
                                      </div>
                                      <div class="inventory-extend">
                                      
                                      </div>
                                  </div>
            </section>
         
       </div>
    </body>
</html>`,
            }
        ];


        function date() {
            const x = new Date();

            const y = "0" + x.getHours();
            const z = "0" + x.getMinutes();
            const s = "0" + x.getSeconds();
            const h = "0" + x.getDate();
            const ano = x.getFullYear().toString().substr(-2);
            const ms = x.getMonth();
            const meses = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "June",
                "July",
                "Aug",
                "Sept",
                "Oct",
                "Nov",
                "Dec",
            ];

            return (
                y.substr(-2) +
                ":" +
                z.substr(-2) +
                ":" +
                s.substr(-2) +
                " -  " +
                h.substr(-2) +
                "/" +
                meses[ms]
            );
        }
        let printerName;
        let widthPage;

        console.log(printerName, widthPage);

        const options = {
            preview: false, // Preview in window or print
            width: widthPage, //  width of content body
            margin: "0 0 0 0", // margin of content body
            copies: 1, // Number of copies to print
            printerName: printerName, // printerName: string, check it at webContent.getPrinters()
            timeOutPerLine: 400,
            silent: true,
        };

        const now = {
            type: "text",
            value: "" + date(),
            style: `text-align:center;`,
            css: { "font-size": "12px", "font-family": "sans-serif" },
        };

        const d = [...data, now];

        if (printerName && widthPage) {
            PosPrinter.print(d, options)
                .then(() => { })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.log("Select the printer and the width");
        }

    } catch (error) {
        console.log(error)
    }
    res.render("index", { title: "Express" });
});

router.get('*/printer/list-printer', PrinterController.listPrinters);

module.exports = router;
