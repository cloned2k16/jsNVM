    var // 
        _               =   _ || {}
    ,   leftPad         =   _padLeft.func
    ,   _W              =   window        
    ,   _D              =   document
    ,   _O              =   Object
    ,   _C              =   console
    ,   _B              =   _D.body
    ,   _FN             =   Function.apply
    ,   _ById           =   function  (id)                      { return _D.getElementById (id);        }
    ,   _ByQs           =   function  (id)                      { return _D.querySelector  (id);        }
    ,   _newHtmlEl      =   function  (el)                      { return _D.createElementNS  ('http://www.w3.org/1999/xhtml', el);   }
    ,   _newSvgEl       =   function  (el)                      { return _D.createElementNS  ('http://www.w3.org/2000/svg'  , el);   }
    ,   _newEL          =   function  (elm,id)                  { var el=_D.createElement    (elm); if (id) el.id=id; return el;     }
    ,   _newTXT         =   function  (txt)                     { var el=_D.createTextNode   (txt); return el;                       }
    ,   _setAttr        =   function  (e,a,v)                   { e.setAttribute(a,v); return e;        }
    ,   _Ajax           =   function  (req , cb , err, sts )    {
        var     xhttp;
        
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
            xhttp.timeout = 12000;
        } 
        else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        
        xhttp.onreadystatechange = function() {
            if (sts) sts(xhttp);
            switch (xhttp.readyState ) {
            
             case 4: {
              switch(xhttp.status) {
                case 200: 
                        cb    (xhttp.responseText); 
                        break;
                 default: 
                        err   ({'sts' : xhttp.status ,'txt' : xhttp.responseText}); 
                        break;
              }
             }
             default:
               //log(xhttp.readyState,xhttp.status);
            }   
        };
       
        xhttp.open("GET", req, true);
        
        try {
         xhttp.send();
        }
        catch (e) { log (e); }    
    }
    ,   _newHtmlEl      =   function  (el)                      { return _D.createElementNS  ('http://www.w3.org/1999/xhtml', el);   }
    ,    log            =   function  ()                        { _FN.call(console.log, console, arguments); }
    ,   _OrEmpty        =   function  (v)                       { return v?v:''; } 
    ,   showError       =   function  (lbl, err)                {
            var tbl=_ById('list');
                  
                  tbl.innerHTML+='<TR><TD colspan=10>'+lbl+'ERROR: ' + err.sts+'&nbsp;'+ (err.txt?err.txt:'') +'</TD></TR>';
    }
    ,   showList        =   function    (list)                  {
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
    ,   numeric         =   function    ( vs )                  {
        vs = vs.substring(1);
        vs = vs.split('.');
        var len = vs.length;
        if (len!=3) return 0;
        var num= leftPad(vs[0],3,0) + leftPad(vs[1],3,0) + leftPad(vs[2],4,0) ;
        return num;
        
    }
    ,   compareVersion  =   function    ( nV ,iV)               { return  numeric(nV) > numeric(iV); }
    ,   raimbowCol      =   function    (i, ofMax, r, ph)       {
     var    
            f   = 360 / ofMax
     ,      rd  = Math.PI / 180
     ,      mid = 128
     ,      ph  = (ph ||  40) % 360
     ,      r   = (r  || 127) 
     ,      R   = Math.round(Math.sin((f*i-  0+ph)*rd) * r + mid)
     ,      G   = Math.round(Math.sin((f*i-120+ph)*rd) * r + mid)
     ,      B   = Math.round(Math.sin((f*i-240+ph)*rd) * r + mid)
     ,      c   
     ;
      R= R>160?255:R>96?127:0;
      G= G>160?255:G>96?127:0;
      B= B>160?255:B>96?127:0;
      c = (R*0x10000+G*0x100+B)
      return c;
    }
    ,   addYearMark     =   function    (dv, date,start,step)     {
        var mrk = _newHtmlEl('div')
            mrk.setAttribute('class','yearMark');
            
        var x= (date.getTime()-start) * step;
            mrk.innerHTML=date.getFullYear();
            mrk.setAttribute('style','left: '+(x>>0)+'px; top:0px; height:100%;');
            dv.appendChild(mrk);
    }
    ,   showGraph       =   function    (values,col)            {
        var my      = this
        ,   dv      = _ById('svgDiv')
        ,   bound   = dv.getBoundingClientRect()
        ,   W       = bound.width
        ,   H       = bound.height
        ,   len     = values.length
        ,   min     = new Date(values[len-1].date).getTime()
        ,   max     = new Date(values[0]    .date).getTime()
        ,   step    = (W-64)/(max-min)
        ,   i       = 0
        ,   x       = 0
        ,   y       = 0
        ;
        
        addYearMark(dv,new Date('1-1-2012'),min,step);
        addYearMark(dv,new Date('1-1-2013'),min,step);
        addYearMark(dv,new Date('1-1-2014'),min,step);
        addYearMark(dv,new Date('1-1-2015'),min,step);
        addYearMark(dv,new Date('1-1-2016'),min,step);
        
        for (i=0; i<len; i++) {
         var val =   values[len-i-1];
         y = H-numeric(val.version)   / 100000000*H
         x = (new Date(val.date).getTime()-min) * step
         
         var    col     = raimbowCol(i,len/2).toString(16)
                col     = '0'.repeat(6-col.length)+col;
         var    el     = _newHtmlEl('div')        
                el.setAttribute('class','verLab');
                el.setAttribute('style','left: '+((x>>0))+'px; top:'+((y>>0)-32)+'px; color:#'+col+';');
                el.innerHTML=val.version;
                dv.appendChild(el);
        } 
        
        
    }
    ;
    
    
    
            _Ajax ('http://nodejs.org/dist/index.json' //'https://nodejs.org/download/release/index.json'      
            , function (res) { 
                var list        =   JSON.parse(res);
                    nodeList    =   list;
                    log('got Node list');
                    getNodeListInProgress=false;
            }
            , function (err) { nodeError=err; log('ERR:',err)}
            );
            
            _Ajax ('https://iojs.org/dist/index.json'
            , function (res) { 
                var list        =   JSON.parse(res);
                    iojsList    =   list;
                    log('got IoJs list');
                    getIoJsListInProgress=false;
            }
            , function (err) { iojsError=err; log('ERR:',err); }
            );
            
            
            W4it.done ( function done () {   return !getNodeListInProgress && !getIoJsListInProgress; }       
            ,           function then () {
                
                var total   =   0
                ,   nodeLen =   nodeList? nodeList.length : 0
                ,   iojsLen =   iojsList? iojsList.length : 0
                ,   i
                ,   j       =   0
                ,   k       =   0
                ,   merged  =   []
                ,   empty   =   'v'
                ,   smmry   =   _ById('smmry');
                ;
                
                
                if (nodeError) { log(nodeError); showError('NODE:',nodeError); }
                else total += nodeLen;
                
                if (iojsError) { log(iojsError); showError('IOJS:',iojsError); }
                else total += iojsLen;
                
                for (i=0; i < total; i++) {
                  var nodeVer = (nodeList && nodeList[j]) ?  nodeList[j].version : empty;
                  var iojsVer = (iojsList && iojsList[k]) ?  iojsList[k].version : empty;
                  //merged[i] = compareVersion(nodeVer,iojsVer) ? nodeList[j++] : iojsList[k++];
                  if (compareVersion(nodeVer,iojsVer))  { merged[i]=nodeList[j++]; merged[i].origin='NODE'; }
                  else                                  { merged[i]=iojsList[k++]; merged[i].origin='IO.JS'; }
                }
                log (j,k, merged.length);
                
                smmry.innerHTML = "Found <b>"+merged.length+"</b> releases ..<br>  ("+j+") from NODE and ("+k+") from IO.JS"
                                ;
                
                
                showList(merged);
                
                showGraph(merged);
                  
            });
