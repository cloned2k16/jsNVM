'use strict';

var fs          =   require('fs');
var request     =   require('request');

var nodeVerURL  =   'https://nodejs.org/download/release/index.json';

var strFormat   =   function    () {
    var args = arguments,
    string = args[0],
    i = 1;
    return string.replace(/%((%)|s|d|i)/g, function (m) {
        var val = args[i];
        switch (m) {
         case '%i':
              val = parseInt    (val);
              break;
         case '%d':
              val = parseFloat  (val);
              break;
        }
        i++;
     return val;
    });
}

request.get(nodeVerURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
    
        fs.writeFile("releases.json", body, function(err) {
         if(err) { return console.log(err); }
        }); 
        
        var res=JSON.parse(body);
        
        var vList  = "";
        var stable = [];
        var lts    = [];
        for (var v in res) { 
            var ver=res[v]; 
            if (!ver.lts) stable.push(ver);
            else          lts   .push(ver);
            vList+= strFormat('  %s\t\t[%s]\t\t%s\r\n',ver.version ,ver.lts,ver.date); 
        }
        
        fs.writeFile("releases.lst", vList, function(err) {
         if(err) { return console.log(err); }
        }); 
        
        
        var max=17, i=0;
        console.log(strFormat("\n\t====== List of %i most recent versions =",max));
        console.log("\tSTABLE\t\tLTS\n");
        do {
         var line;
         if (stable.length>i) line =(strFormat('\t%s',stable[i].version));
         else                 line =('\t\t');
         if (lts.length>i)    line+=(strFormat('\t\t%s\t( %s )',lts[i].version ,lts[i].lts));
         console.log(line);
         i++;
        } 
        while (max-- > 0);
    }
    else console. log (response.statusCode,error);
});



