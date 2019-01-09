// BASH logging system - extremely basic.

var exec = require("child_process").exec;

function logit(logdata) {

    console.log("-[logit.js]- 'LOGGING PROCESS' called.");

     exec("./bashiplog.sh " + logdata ,
        { timeout: 3000, maxBuffer: 20000*1024 },
        function (error, stdout, stderr) {
         //   console.log("Logdata:" + logdata);
            console.log("Script Console: \n" + stdout);        //shows console readout.
         //   console.log("stderr:" + stderr);
         //   console.log("error:" + error);
        });

}

exports.logit = logit;