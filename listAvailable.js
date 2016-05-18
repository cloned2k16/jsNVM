'use strict';


var _APP = { 
        desc:           "ListAvailable (Node releases)"
       ,version:        "0.0.3"
    }
,   fs          =   require ('fs')
,   request     =   require ('request')
,   leftPad     =   require ('left_pad')
,   w4it        =   require ('w4it')

,   nodeVerURL  =   'https://nodejs.org/dist/index.json'
,   iojsVerURL  =   'https://iojs.org/dist/index.json' 

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

w4it.enableAnimation();

//                  ----------------------------------------------------------    
    _APP.ND                     = undefined;
    _APP.LOG_LEVELS             = 0xFF; // all enabled
    _APP.isND                   = function (a){ return a == _APP.ND };
    _APP.isDF                   = function (a){ return a != _APP.ND };
// Personal Logger  ----------------------------------------------------------    
    _APP.log            = function ()       { var my=_APP;
     var    a       =   [].slice.apply(arguments)
     ,      len     =   a.length
     ,      type    =   len>=1 ? a[a.length-1] : {}
     ;
     if ( _APP.isDF(type.logT)) { 
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
,   _log        = _.log    
;    
// ---------------------------------------------------------------------------    

    _log('remote servers\n look′up` ... '   );
    _log('-------------'                    );
    _log('             '                    );
    _log('.............'                    );
    _log("\r\x1b[3A"                        );
    
_.ND                = undefined;    
_.nodeList          = _.ND;
_.nodeError         = _.ND;
_.nodeReqInProgress = true;

_.iojsList          = _.ND;
_.iojsError         = _.ND;
_.iojsReqInProgress = true;

request.get(nodeVerURL, function (err, response, body) {
    _.nodeReqInProgress = false;
    
    if (!err && response.statusCode == 200) {
        fs.writeFile("node_dist.json", body, function(err) { if(err) { return _.log(err); } }); 
        
        var res     =   JSON.parse(body);
        _.nodeList  =   res;
        
        var vList   =   ""
        ,   stable  =   []
        ,   lts     =   []
        ;
        for (var v in res) { 
            var ver=res[v]; 
            if (!ver.lts) stable.push(ver);
            else          lts   .push(ver);
            vList+= strFormat('  %s\t\t[%s]\t\t%s\t\t%s\r\n',ver.version ,ver.lts?ver.lts:'',ver.date,ver.npm); 
        }
        
        fs.writeFile("node_dist.lst", vList, function(err) {
         if(err) { return _.log(err); }
        }); 
        
    }
    else { 
        _.log (response.statusCode,err,_.log.error); 
        _.nodeError = { 'RES' : response , 'ERR' : err };
    }   
});

request.get(iojsVerURL, function (err, response, body) {
    _.iojsReqInProgress = false;
    
    if (!err && response.statusCode == 200) {
        fs.writeFile("iojs_dist.json", body, function(err) {
         if(err) { return _.log(err); }
        }); 
        
        var res=JSON.parse(body);
        _.iojsList  =   res;
        
        var vList   =   ""
        ;
        for (var v in res) { 
            var ver=res[v]; 
            vList+= strFormat('  %s\t\t%s\t\t%s\r\n',ver.version, ver.date, ver.npm); 
        }
        
        fs.writeFile("iojs_dist.lst", vList, function(err) { if(err) { return _.log(err); } });

        
    }
    else { 
        _.log (response.statusCode,err ,_.log.error); 
        _.iojsError = { 'RES' : response , 'ERR' : err };
    }   
});

var rawStdout               = new fs.SyncWriteStream(1, { autoClose: false })
,   numeric                 = function  ( vs )      {
        vs = vs.substring(1);
        vs = vs.split('.');
        var len = vs.length;
        if (len!=3) return 0;
        var num= leftPad(vs[0],3,0) + leftPad(vs[1],3,0) + leftPad(vs[2],4,0) ;
        return num;
        
    }
,   compareVersion          = function  ( nV ,iV)   { return  numeric(nV) > numeric(iV); }
;

w4it.done(function done () { return !(_.nodeReqInProgress || _.iojsReqInProgress); },
            function then (){
                //_log('BOTH FINISHED!\n' );
        
                var total       =   0
                ,   nodeLen     =   _.nodeList? _.nodeList.length : 0
                ,   iojsLen     =   _.iojsList? _.iojsList.length : 0
                ,   i
                ,   j           =   0
                ,   k           =   0
                ,   merged      =   []
                ,   empty       =   'v'
                ,   mileStones  =   []
                ;
                
                
                if (_.nodeError) { _log(_.nodeError); }//showError('NODE:',nodeError); }
                else total += nodeLen;
                
                if (_.iojsError) { _log(_.iojsError); }//showError('IOJS:',iojsError); }
                else total += iojsLen;
                
                //_log (total,nodeLen,iojsLen);
                
                for (i=0; i < total; i++) {
                  var nodeVer = (_.nodeList && _.nodeList[j]) ?  _.nodeList[j].version : empty;
                  var iojsVer = (_.iojsList && _.iojsList[k]) ?  _.iojsList[k].version : empty;
                  if (compareVersion(nodeVer,iojsVer))  { merged[i]=_.nodeList[j++]; merged[i].origin='NODE'; }
                  else                                  { merged[i]=_.iojsList[k++]; merged[i].origin='IO.JS'; }
                }
                
                var len=merged.length;
               
                if (total != len) _log('merged size missmatch! expected:',total,' actual:',len);
                
                _log('num of releases found:\nNode: ',nodeLen,' IoJs: ',iojsLen);
                
                fs.writeFile('complete_'+total+'.json', merged, function(err) { if(err) { return _log(err);  } });
                var rel
                ,   curr
                ,   last
                ;
                j=0;
                
                for (i = 0; i < merged.length ; i++) {
                    rel     = merged[i];
                    curr    = numeric(rel.version).substring(0,3);
                    if (last!=curr) {
                        last=curr;
                        mileStones[j++]=rel;
                    }  
                }
                
                _log('\n\n\t_-== Version ==-_-== LTS ==-_-== ORIGIN ==-_\n');
                for (i=0 ; i < mileStones.length ;i++) {
                    rel =   mileStones[i];
                    _log('\t    ',rel.version ,'\t    ',rel.lts ? rel.lts : '\t','\t',rel.origin);
                } 
/*        
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
  */              
            });


