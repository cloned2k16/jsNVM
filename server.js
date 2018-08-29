'use strict';

//  ----------------------------------- --------------------------- ---------------------------------
    const   ND              	=   undefined
    ,       info            	=   {}                                                                      //  to keep in sync, we now fill this from package.json
    ,       _APP            	=   {}                                                                      //  storing global references here ..
    ,       Fs             		=   require ('fs')
    ,       Url             	=   require ('url')
    ,       Path            	=   require ('path')
    ,       w4it            	=   require ('w4it')
    ,       Http            	=   require ('https')
    ,       HttpD           	=   require ('http-d')
    ,       LeftPad         	=   require ('left_pad')
	,       request             =   require ("sync-request")
	,		ChildProc       	=   require ('child_process')
    ,       Exec            	=   ChildProc.execFileSync 
    ,       NIM             	=   'nim'
    ,       _CON            	=   console
    ,       pathSep         	=   Path.sep
    ,       strFormat       	=   ()					=>  {
                var s   = arguments[0]
                ,   i   = 1
                ;
                return s.replace(/%((%)|s|d|i)/g, function (m) {
                    var val = arguments[i];
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
    ,       qtd             	=   (s)                 =>  { return "'"+s+"'"; }
    ,       _cout           	=   (t,...a)            =>  { Function.apply.call(t ,_CON,a); }
    ,       _log            	=   (...a)              =>  { _cout(_CON.log    ,...a); }
    ,       _wrn            	=   (...a)              =>  { _cout(_CON.warn   ,...a); }
    ,       _err            	=   (...a)              =>  { _cout(_CON.error  ,...a); }
    ,       toLocal         	=   (s)                 =>  { return s.replace(new RegExp('/', 'g'),'\\'); }
	,       getResult           =   async prms          =>  {
				let data=await prms;
				return data;
	}
	, 	 	getPage 			=	 url 				=> 	{
				try {
					const	res 	= request('GET',url)  
					,		data	= res.getBody('utf8')
					_.log('$',data);
					;
					return data;	
				} 
				catch (err) { _.log(err); }
	}
	;
	
			_APP.PUBLIC_HTML    =   '/'; 
            _APP.BOWER_DIR      =   '/bower_components';
            _APP.LISTEN_PORT    =   process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080 ;
            _APP.URL_BASE       =   'http://0.0.0.0';
            _APP.out            =   _log
            _APP.log            =   _log
            _APP.wrn            =   _wrn
            _APP.err            =   _err
            _APP.timeSt         =   (name)  => { return timers[name]= (new Date()).getTime();};
            _APP.timeEn         =   (name)  => { return (new Date()).valueOf() - timers[name];};
            _APP.full_list      =   ND
            
    let 	_                   =   _APP
    ,   	me                  =   process
    ,   	isOS                =   me.arch
    ,   	args                =   me.argv
    ,   	cmdLn               =   args[0]
    ,   	myName              =   args[1]
    ;

	
	        Http.head       	=   (url, cb)           =>  {                                               
                var options=Url.parse(url);
                options.method='HEAD';
                var req=Http.request(options,cb);
                    req.end();
                return req;    
            }
			
		
            try{   
                _.log(HttpD.Name,HttpD.Version);
                
                HttpD.setStaticFolders  ([__dirname + _.PUBLIC_HTML,__dirname + _.BOWER_DIR]);
                HttpD.map               ('/do'     ,  (req,res,query) => {
					var uri	=("http://"+query).replace(/\&/,"?")
					,	data=  getPage(uri)
					;
					
					return data;
                });  
                
                HttpD.listen(_.LISTEN_PORT );
                
                //_.log('http-d server listening on '+_.URL_BASE+':'+_.LISTEN_PORT+'/');

            }
            catch (ex) {
                 _.err(ex);
                 me.exit(-123);
            }       
			

	
