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
            if (xhttp.readyState == 4 ) {
             switch(xhttp.status) {
                case 200: cb    (xhttp.responseText); 
                        break;
                 default: err   (xhttp.responseText); 
                        break;
             }
            }
            //else log('readyState:',xhttp.readyState);
        };
        xhttp.open("GET", req, true);
        xhttp.send();
    }
    ,   _newHtmlEl      = function  (el)                { return _D.createElementNS  ('http://www.w3.org/1999/xhtml', el);   }
    ,    log            = function  ()                  { _FN.call(console.log, console, arguments); }
    ,   _OrEmpty        = function  (v)                 { return v?v:''; } 
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
    
    
    
            _Ajax ('http://nodejs.org/dist/index.json' //'https://nodejs.org/download/release/index.json'      
            , function (res) { log('success:');
                var list        =   JSON.parse(res);
                    nodeList    =   list;
            }
            , function (err) { log(err); nodeError=err; }
            , function (xhttp) {
                if (xhttp.readyState == 4) {
                    getNodeListInProgress=false;
                    log('got Node list');
                }
            });
            
            _Ajax ('https://iojs.org/dist/index.json'
            , function (res) { log('success:');
                var list        =   JSON.parse(res);
                    iojsList    =   list;
            }
            , function (err) { log(err); iojsError=err; }
            , function (xhttp) {
                if (xhttp.readyState == 4) {
                    getIoJsListInProgress=false;
                    log('got IoJs list');
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
                
                
                if (nodeError) log(nodeError);
                else total += nodeLen;
                if (nodeError) log(nodeError);
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
