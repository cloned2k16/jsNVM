    var // 
        _               = _ || {}
    ,   _W              = window        
    ,   _D              = document
    ,   _O              = Object
    ,   _C              = console
    ,   _B              = _D.body
    ,   _FN             = Function.apply
    ,   _ById           = function  (id)                    { return _D.getElementById (id);        }
    ,   _ByQs           = function  (id)                    { return _D.querySelector  (id);        }
    ,   _setAttr        = function  (e,a,v)                 { e.setAttribute(a,v); return e;        }
    ,   _Ajax           = function  (req , cb , err, sts )  {
        var     xhttp;
        
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
            
        } 
        else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        
        xhttp.onreadystatechange = function() {
            if (sts) sts(xhttp);
            if (xhttp.readyState == 1 ) {
                xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
            }    
            else if (xhttp.readyState == 4 ) {
             switch(xhttp.status) {
                case 200: 
                        cb    (xhttp.responseText); 
                        break;
                 default: 
                        log(xhttp);
                        err   ({'sts' : xhttp.status ,'txt' : xhttp.responseText}); 
                        break;
             }
            }
            else log(xhttp.readyState,xhttp.status);
        };
       
        if ("withCredentials" in xhttp) {  // xhttp for Chrome/Firefox/Opera/Safari.
            xhttp.open('GET', url, true);
        } 
        else if (typeof XDomainRequest != "undefined") { // XDomainRequest for IE.
            xhttp = new XDomainRequest();
            xhttp.open('GET', url);
        } 
        else { // CORS not supported.
            //xhttp = null;
        }
        
        //        xhttp.open("GET", req, true);
        
        try {
         xhttp.send();
        }
        catch (e) { log (e); }    
    }
    ,   _newHtmlEl      = function  (el)                { return _D.createElementNS  ('http://www.w3.org/1999/xhtml', el);   }
    ,    log            = function  ()                  { _FN.call(console.log, console, arguments); }
    ,   _OrEmpty        = function  (v)                 { return v?v:''; } 
    ,   showError       = function  (lbl, err)          {
            var tbl=_ById('list');
                  
                  tbl.innerHTML+='<TR><TD colspan=10>'+lbl+'ERROR: ' + err.sts+'&nbsp;'+ (err.txt?err.txt:'') +'</TD></TR>';
    }
    ,   showList        = function  (list)              {
            var tbl=_ById('list');
                 for (v in list){
                  var ver=list[v];
                  tbl.innerHTML+='<TR><TD>' +ver.version
                                +'</TD><TD>'+_OrEmpty(ver.origin    )
                                +'</TD><TD>'+_OrEmpty(ver.date      )
                                +'</TD><TD>'+_OrEmpty(ver.lts       )
                                +'</TD><TD>'+_OrEmpty(ver.npm       )
                                +'</TD><TD>'+_OrEmpty(ver.v8        )
                                +'</TD><TD>'+_OrEmpty(ver.openssl   )
                                +'</TD><TD>'+_OrEmpty(ver.zlib      )
                                +'</TD><TD>'+_OrEmpty(ver.uv        )
                                +'</TD></TR>';
                 }
    }
    ,   getNodeListInProgress   = true
    ,   getIoJsListInProgress   = true
    ,   nodeList
    ,   nodeError
    ,   iojsList
    ,   iojsError
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
    
    
    
            _Ajax ('http://nodejs.org/dist/index.jsonn' //'https://nodejs.org/download/release/index.json'      
            , function (res) { log('success:');
                var list        =   JSON.parse(res);
                    nodeList    =   list;
                    log('got Node list');
            }
            , function (err) { nodeError=err; log('ERR:',err)}
            , function (xhttp) {
                if (xhttp.readyState == 4) {
                   getNodeListInProgress=false;
                }
            });
            
            _Ajax ('https://iojs.org/dist/index.jsonn'
            , function (res) { log('success:');
                var list        =   JSON.parse(res);
                    iojsList    =   list;
                    log('got IoJs list');
            }
            , function (err) { iojsError=err; log('ERR:',err); }
            , function (xhttp) {
                if (xhttp.readyState == 4) {
                    getIoJsListInProgress=false;
                }
            });
            
            
            W4it.done ( function done () {   return !getIoJsListInProgress && !getIoJsListInProgress; }       
            ,           function then () {
                
                log ('both finished right now',getIoJsListInProgress,getIoJsListInProgress);
                var total   =   0
                ,   nodeLen =   nodeList? nodeList.length : 0
                ,   iojsLen =   iojsList? iojsList.length : 0
                ,   i
                ,   j       =   0
                ,   k       =   0
                ,   merged  =   []
                ,   empty   =   'v'
                ;
                
                
                if (nodeError) { log(nodeError); showError('NODE:',nodeError); }
                else total += nodeLen;
                
                if (iojsError) { log(iojsError); showError('IOJS:',iojsError); }
                else total += iojsLen;
                
                log (total,nodeLen,iojsLen);
                
                for (i=0; i < total; i++) {
                  var nodeVer = (nodeList && nodeList[j]) ?  nodeList[j].version : empty;
                  var iojsVer = (iojsList && iojsList[k]) ?  iojsList[k].version : empty;
                  //merged[i] = compareVersion(nodeVer,iojsVer) ? nodeList[j++] : iojsList[k++];
                  if (compareVersion(nodeVer,iojsVer))  { merged[i]=nodeList[j++]; merged[i].origin='NODE'; }
                  else                                  { merged[i]=iojsList[k++]; merged[i].origin='IO.JS'; }
                }
                log (j,k, merged.length);
                
                
                showList(merged);
                  
            });
