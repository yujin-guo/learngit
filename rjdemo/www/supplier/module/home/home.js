define(['text!module/home/home.html','css!module/home/style/style.css'],function(tpl){
	var controller=function(){
		var url=common.serverBaseUrl+urls.allUrls.homePageMessage;
		var callback=function(r){
            if(r.code=="0000"){
                data={
                    r:r,
                    brandlist:r.brandList
                };
                appView.html(_.template(tpl,data));
                checkStatus();
            }else if(r.code=="1020"){
                common.getOutFun();
            }else{
                dialog({
                    title:"提示",
                    modal:true,
                    content:r.message,
                    ok:function(){},
                    cancel:false
                }).width(320).show();
            }
        }
		common.postData(url,{},callback,true);
		common.tabFocus("我的商铺");
        function checkStatus(){
            var statusUrl=common.serverBaseUrl+urls.allUrls.accreditationStatus;
            var checkStatusCallback=function(result){
                if(result.code=="0000"){
                    if(result.accreditationStatus==0){
                        /* 弹出提示框start */
                        function oPop(){
                            this.opoup = null;
                            this.settings = {
                                id : "login",
                                w : 300,
                                h: 200
                            }
                        }
                        oPop.prototype.json = {}//为了防止多次点击,只能点击一次
                        oPop.prototype.init = function(opt){
                            extend(this.settings,opt);
                            if( this.json[opt.iNow]==undefined){
                               this.json[opt.iNow] = true;
                            }

                            if(this.json[opt.iNow]){
                              this.create();
                              this.close();
                              this.json[opt.iNow] = false;
                            }  
                        }

                          
                        oPop.prototype.create = function(){//创建弹框DOM
                            this.opoup = document.createElement("div");
                            this.opoup.className = "login";
                            this.opoup.innerHTML = '<div class="poptitle"><span>'+this.settings.title+'</span><span class="popclose">&nbsp;</span></div><div class="popcontent"><div class="pop-inner" style="height:'+(this.settings.h/2)+'px;"></div><div style="height:'+(this.settings.h/2)+'px;text-align:center;"><a href="#credential" class="pop-sure">进行认证</a><span class="pop-cancel">跳过&gt;</span></div></div>';
                          
                            document.body.appendChild(this.opoup);

                            this.opoup.style.width = this.settings.w + 'px';
                            this.opoup.style.height = this.settings.h + 'px';
                             

                            if(this.settings.dir =="center"){

                              this.opoup.style.left  = (viewWidth() - this.opoup.offsetWidth)/2 + 'px';
                              this.opoup.style.top  = (viewHeight() - this.opoup.offsetHeight)/2 + 'px';

                            }
                            else if( this.settings.dir == 'right' ){
                              this.opoup.style.left =  (viewWidth() - this.opoup.offsetWidth) + 'px';
                              this.opoup.style.top =  (viewHeight() - this.opoup.offsetHeight) + 'px';
                            }
                        }


                        oPop.prototype.close = function(){//关闭和跳转按钮
                            var aSpan = $('.popclose');
                            var popCancel = $('.pop-cancel');
                            var popSure = $('.pop-sure');
                            var This = this;

                            aSpan[0].onclick = function(){
                                document.body.removeChild(This.opoup);
                                This.json[This.settings.iNow] = true;
                            }
                            popCancel[0].onclick = function(){
                                document.body.removeChild(This.opoup);
                                This.json[This.settings.iNow] = true;
                            }
                            popSure[0].onclick = function(){
                                document.body.removeChild(This.opoup);
                                This.json[This.settings.iNow] = true;
                            }
                        }

                        function viewWidth(){
                            return document.documentElement.clientWidth;
                        }

                        function viewHeight(){
                            return document.documentElement.clientHeight;
                        }

                        function extend(obj1,obj2){
                            for(var attr in obj2){
                              obj1[attr] = obj2[attr];
                            }
                        }
                        var p= new oPop();
                        p.init({
                            iNow : 0,
                            title:"",
                            w : 500,
                            h :250,
                            dir:"center"
                        });
                        
                        var str='<h2 class="title-f1">您还没有进行企业认证</h2><p class="content-f1">企业认证通过后才能够进驻医院，售卖商品</p>';
                        $(".pop-inner").html(str);
                        /* 弹出提示框end */
                    }
                }else if(result.code=="1020"){
                    common.getOutFun();
                }else{
                    dialog({
                        title:"提示",
                        modal:true,
                        content:result.message,
                        ok:function(){},
                        cancel:false
                    }).width(320).show();
                }
            }
            common.postData(statusUrl,{},checkStatusCallback,true);
        }
	}
	return controller;
});