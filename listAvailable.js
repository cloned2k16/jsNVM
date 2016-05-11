'use strict';


var _APP = { 
        desc:           "ListAvailable (Node releases)"
       ,version:        "0.0.1"
    }
,   fs          =   require ('fs')
,   request     =   require ('request-promise')
,   w4it        =   require ('w4it')

,   nodeVerURL  =   'https://nodejs.org/download/release/index.json'
,   strFormat   =   function    () {
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
;//var end//    


//                  ----------------------------------------------------------    
    _APP.ND                     = 'undefined';
    _APP.LOG_LEVELS             = 0xFF; // all enabled
    _APP.isND                   = function (a){ return typeof a === _APP.ND };
    _APP.isDF                   = function (a){ return typeof a !== _APP.ND };
// Personal Logger  ----------------------------------------------------------    
    _APP.log            = function ()       { var my=_APP;
     var a = [].slice.apply(arguments);
     //Array.prototype.push.apply( a, arguments );
     var type   =a[a.length-1];
     if (type && _APP.isDF(type.logT)) { 
      type=type.logT; 
      a.pop(); 
      var 
            v=my.log.verbose  .logT
        ,   d=my.log.debug    .logT
        ,   i=my.log.info     .logT
        ,   w=my.log.warning  .logT
        ,   e=my.log.error    .logT
        ,   p=my.log.panic    .logT
        ;
      var mask =  my.LOG_LEVELS;
      if (!(type &  mask)) return;// level is disabled!!
      
      switch (type) { //do some specific
        default:
            
      }   
     
     }
     Function.apply.call(console.log, console, a);
    };

{ //LOG levels
                    _APP.log.verbose    ={logT: 1};
                    _APP.log.debug      ={logT: 2};
                    _APP.log.info       ={logT: 4};
                    _APP.log.warn       ={logT: 8};
                    _APP.log.warning    ={logT: 8};
                    _APP.log.error      ={logT:16};
                    _APP.log.panic      ={logT:32};
}

    _APP.isLOGDebugEn   = function () { return this.LOG_LEVELS & this.log.debug    .logT; }
    

var _           =   _APP
,   _out        =   process.stdout
,   _log        =   _.log
;    
// ---------------------------------------------------------------------------    

    _log('look up to remote server...'  , _log.info);
    _log('-------------'                , _log.info);
    
_.RequestInProgress = true;

request.get(nodeVerURL, function (err, response, body) {
    _.RequestInProgress = false;
    
    if (!err && response.statusCode == 200) {
        fs.writeFile("releases.json", body, function(err) {
         if(err) { return _.log(err); }
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
         if(err) { return _.log(err); }
        }); 
        
        
        var max=17, i=0;
        _out.write(strFormat("\n\t====== List of %i most recent versions =\n",max));
        _out.write("\tSTABLE\t\tLTS\n\n");
        do {
         var line;
         if (stable.length>i) line =(strFormat('\t%s',stable[i].version));
         else                 line =('\t\t');
         if (lts.length>i)    line+=(strFormat('\t\t%s\t( %s )',lts[i].version ,lts[i].lts));
         _out.write(line+'\n');
         i++;
        } 
        while (max-- > 0);
    }
    else { _log.error (response.statusCode,err); }   
});

var rawStdout = new fs.SyncWriteStream(1, { autoClose: false });



//w4it.done(function () { return !_RequestInProgress; });
w4it.done('RequestInProgress',_);


