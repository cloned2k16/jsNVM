//  --------------------------- --------------------------------------------------- -----------------------------------------------------------------------------    
    var ND 
    ,   urlNodeDist             =   'https://nodejs.org/dist/'                      //  'https://nodejs.org/download/release/'      
    ,   urlNodeDB               =   urlNodeDist+'/index.json'                       
    ,   urlIoJsDist             =   'https://iojs.org/dist'                         //  any alternative ?
    ,   urlIoJsDB               =   urlIoJsDist+'/index.json'               
    ,   urlNodeDocs             =   'https://nodejs.org/docs/'
    ,   urlIoJsDocs             =   'https://iojs.org/docs/'
    ,   _                       =   _ || {}
    ,   leftPad                 =   _padLeft.func
    ,   _W                      =   window        
    ,   _D                      =   document
    ,   _O                      =   Object
    ,   _C                      =   console
    ,   _B                      =   _D.body
    ,   _FN                     =   Function.apply
    ,   _ById                   =   function  (id)                                  { return _D.getElementById      (id);                                       }
    ,   _ByQs                   =   function  (id)                                  { return _D.querySelector       (id);                                       }
    ,   _newHtmlEl              =   function  (el)                                  { return _D.createElement       (el);                                       }
    ,   _newSvgEl               =   function  (el)                                  { return _D.createElementNS     ('http://www.w3.org/2000/svg'  , el);       }
    ,   _newEL                  =   function  (elm,id)                              { var el=_D.createElement       (elm); if (id) el.id=id; return el;         }
    ,   _newTXT                 =   function  (txt)                                 { var el=_D.createTextNode   (txt); return el;                              }
    ,   _setAttr                =   function  (e,a,v)                               { e.setAttribute(a,v); return e;                                            }
    ,   _log                    =   function  ()                                    { _FN.call(console.log  , console, arguments);                              }
    ,   _err                    =   function  ()                                    { _FN.call(console.error, console, arguments);                              }
    ,   Tmr                     =   function  (lbl)                                 {
        this.lbl    =   lbl;
        this.st     =   new Date    ();
        this.stop   =   function    ()  {
            this.en = new Date();
            _log('time for',this.lbl,this.en-this.st,'ms');
        }
    }
    ,   _OrEmpty                =   function  (v)                                   { return v?v:'';                                                            }            
    ,   getLang                 =   function  ()                                    {
        if (navigator.languages !== ND) return navigator.languages[0]; 
        else return navigator.language;
    }
    ,   toLocale                =   function  (ds)                                  { 
            var da      = ds.split("-")
            ,   date    = new Date(da[0], da[1]-1,da[2])
            ;
            return date.toLocaleDateString(getLang(),{ 'month' : 'short','year':'numeric','day':'numeric'})
        }
    ,   showError               =   function  (lbl, err)                            {
            var tbl=_ById('list');
                  
                  tbl.innerHTML+='<TR><TD colspan=10>'+lbl+'ERROR: ' + err.sts+'&nbsp;'+ (err.txt?err.txt:'') +'</TD></TR>';
    }
    ,   xStrm                   =   function  (mthd
                                              , reQ, cbErr, cbEnd, cbPrgss, cbSts ) {
            var     xhttp;
        
            if (window.XMLHttpRequest) {
                xhttp           = new XMLHttpRequest();
                xhttp.timeout   = 12000;
            } 
            else { _err('your browser miss XMLHttpRequest Object'); return null; }
            
            this._      = xhttp;
             
            var _=this._;
                _.seen  = 0;
                _.rcvd  = 0; 
                _.onprogress            = function  () {
                        data        =   _.response.substr(_.seen);
                        len         =   data.length;
                        _.seen     +=   len;
                        
                        cbPrgss(data);
                };
                
                _.onreadystatechange    = function  () {
                    var sts         =   _.readyState;
                    if (cbSts) cbSts(sts);
                    if (sts==4) cbEnd(_.response);
                };
                
                _.addEventListener("error", cbErr);   
                
            this.start= function ()  { 
                _.open(mthd,reQ); 
                _.send(); 
            }
    }
    

    ,   httpStrm                =   function  (reQ, cbErr, cbEnd, cbPrgss, cbSts)   {
        var rq=new xStrm               ('GET', reQ, cbErr, cbEnd, cbPrgss, cbSts);
            rq.start();
    }       
    ,   numMainVersions
    ,   onlyMainVersions        =   function  (list)                                {
        var vi = {}
        ,   vl = []
        ,   v
        ,   i
        ,   hiv
        ,   n
        ;
        for (i in list){
            v = list[i];
            n = numeric(v.version);
            hiv = n.substring(0,3);
            vo  = vi[hiv];
            if (vo==ND || (vo.version - v.version)>0)   vi[hiv]=v;  
            
        }
        for (i in vi) vl.push(vi[i]);
    numMainVersions = vl.length;
        return vl;
    }
    ,   getNodeListInProgress   = true
    ,   getIoJsListInProgress   = true
    ,   nodeList
    ,   nodeError
    ,   iojsList
    ,   iojsError
    ,   numeric                 =   function  ( vs )                                {
        vs = vs.substring(1);
        vs = vs.split('.');
        var len = vs.length;
        if (len!=3) return 0;
        var num= leftPad(vs[0],3,0) + leftPad(vs[1],3,0) + leftPad(vs[2],4,0) ;
        return num;
        
    }
    ,   compareVersion          =   function  ( nV ,iV)                             { return  numeric(nV) > numeric(iV);                                        }
    ,   raimbowCol              =   function  (i, ofMax, r, ph)                     {
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
    ,   addYearMark             =   function  (dv, date,start,step)                 {
        var mrk = _newHtmlEl('div')
            mrk.setAttribute('class','yearMark');
            
        var x= (date.getTime()-start) * step;
            mrk.innerHTML=date.getFullYear();
            mrk.setAttribute('style','left: '+(x>>0)+'px; top:0px; height:100%;');
            dv.appendChild(mrk);
    }
    ,   showGraph               =   function  (values,col)                          {
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
        ,   yy      = 2012
        ,   YY      = (new Date()).getFullYear() 
        ;
        
        // let the computer do the math , that's why we bought it in first place ;)     
        for (;yy<=YY;yy++) addYearMark(dv,new Date('1-1-'+yy),min,step);
        
        
        var alt     = _newHtmlEl('div')
        ,   altTxt  = null
        ,   lblLink = function (val,url) { return '<a target=docs href="'+url+val.version+'/api/">'+val.version+'</a>'; }
        ;
            alt.setAttribute('class','altLabl');
            document.body.appendChild(alt);
        
        for (i=0; i<len; i++) {
         var val =   values[len-i-1];
         y = H-numeric(val.version)   / 100000000*H *(8.8/numMainVersions);
         x = (new Date(val.date).getTime()-min) * step;
         
         
         var    col     = raimbowCol(i,len/2).toString(16);
                col     = '0'.repeat(6-col.length)+col;
         var    el     = _newHtmlEl('div');    
                el.setAttribute('class','verLab');
                el.setAttribute('style','left: '+((x>>0))+'px; top:'+((y>>0)-32)+'px; color:#'+col+';');
                
                
                el.innerHTML= (val.origin=='NODE') ? lblLink(val,urlNodeDocs) : lblLink(val,urlIoJsDocs) ;
                
                el.addEventListener('mouseenter', function (e){
                   if (!altTxt) { 
                    alt.innerHTML= altTxt = this.innerHTML; 
                    alt.style.visibility = 'visible';
                   }
                   this.xx=e.clientX;
                   this.yy=e.clientY;
                });
                
                el.addEventListener('mousemove', function (e){
                   alt.style.top  = ''+ (e.clientY -48)  +'px';
                   alt.style.left = ''+ (e.clientX -48)   +'px';
                   
                });
                
                el.addEventListener('mouseout', function (e){
                   alt.style.visibility = 'hidden';
                   altTxt = null;
                   alt.innerHTML = '';
                });
                
                dv.appendChild(el);
        } 
        
        
    }
    ,   showList                =   function  (list)                                {
        
            var ver 
            ,   tr
            ,   td
            ,   tbl     = _ById('list')
            ,   appndTD = function (txt) { var td=_newHtmlEl('TD'); td.innerHTML=txt; tr.appendChild(td); }
            ;
            
                 for (v in list){
                    ver=list[v];
                  
                  tr = _newHtmlEl('TR');
                  appndTD ('<A target=dist href="'+(ver.origin=='NODE'? urlNodeDist: urlIoJsDist)  +ver.version+'/">'+ver.version+'</A>');
                  appndTD ( _OrEmpty(ver.origin        ) );
                  appndTD ( _OrEmpty(toLocale(ver.date)) );
                  appndTD ( _OrEmpty(ver.lts           ) );
                  appndTD ( _OrEmpty(ver.npm           ) );
                  appndTD ( _OrEmpty(ver.v8            ) );
                  appndTD ( _OrEmpty(ver.openssl       ) );
                  appndTD ( _OrEmpty(ver.zlib          ) );
                  appndTD ( _OrEmpty(ver.uv            ) );
                  tbl.appendChild(tr);  
                 }
    }
    ,   addTableSeparator       =   function  ()                                    {       
            var tr
            ,   td
            ,   tbl     = _ById('list')
            ;
            tr = _newHtmlEl('TR');
            td = _newHtmlEl('TD');
            td.innerHTML='FULL LIST';
            tr.appendChild(td);
            tbl.appendChild(tr);
    }
    ;
//  --------------------------- --------------------------------------------------- -----------------------------------------------------------------------------    
//  --------------------------- --------------------------------------------------- -----------------------------------------------------------------------------    
//  --------------------------- --------------------------------------------------- -----------------------------------------------------------------------------    
    httpStrm    (   urlNodeDB
                ,   function (err)      {   _log    ('ERR:',err);
                    nodeError               =   err; 
                    getNodeListInProgress   =   false;
                }
                ,   function (data)     {   _log ('Done',urlNodeDB);
                    nodeList                =   JSON.parse(data);
                    getNodeListInProgress   =   false;
                }
                ,   function (chunk)    {   _log ('got',chunk.length,'bytes from',urlNodeDB);
                }
                );
            
    httpStrm    (   urlIoJsDB
                ,   function (err)      {   _log    ('ERR:',err);
                    nodeError               =   err; 
                    getIoJsListInProgress   =   false;
                }
                ,   function (data)     {   _log ('Done',urlIoJsDB);
                    iojsList                =   JSON.parse(data);
                    getIoJsListInProgress   =   false;
                }
                ,   function (chunk)    {   _log ('got',chunk.length,'bytes from',urlIoJsDB);
                }
                );
//  --------------------------- --------------------------------------------------- -----------------------------------------------------------------------------    
    W4it.done   (   function done ()    {   return !getNodeListInProgress && !getIoJsListInProgress; }       
    ,               function then ()    {   _log('W4it.done->then');
                
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
                
                
                if (nodeError)  { _log(nodeError); showError('NODE:',nodeError); }
                else            total += nodeLen;
                
                if (iojsError)  { _log(iojsError); showError('IOJS:',iojsError); }
                else            total += iojsLen;
                
                for (i=0; i < total; i++) {
                  var nodeVer = (nodeList && nodeList[j]) ?  nodeList[j].version : empty;
                  var iojsVer = (iojsList && iojsList[k]) ?  iojsList[k].version : empty;
                 
                  if (compareVersion(nodeVer,iojsVer))  { merged[i]=nodeList[j++]; merged[i].origin='NODE'; }
                  else                                  { merged[i]=iojsList[k++]; merged[i].origin='IO.JS'; }
                }
                
                _log (j,k, merged.length);
                
                smmry.innerHTML = "Found <b>"+merged.length+"</b> releases ..<br>  ("+j+") from NODE and ("+k+") from IO.JS";

                var //T
                T=new Tmr('filter branches');
                onlyMjr =   onlyMainVersions(merged);
                T.stop();
                
                T=new Tmr('show graph');
                showGraph(merged);
                T.stop();

                T=new Tmr('create short list');
                showList(onlyMjr);
                T.stop();
                
                addTableSeparator();
                
                T=new Tmr('create full list');
                showList(merged);
                T.stop();
                
                  
    });
//  --------------------------- --------------------------------------------------- -----------------------------------------------------------------------------    
