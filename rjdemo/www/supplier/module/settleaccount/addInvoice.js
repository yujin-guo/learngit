define(['text!module/settleaccount/addInvoice.html', 'css!module/settleaccount/style/accountDetail.css', 'css!module/settleaccount/style/settleaccount.css', 'js/libs/laydate.dev'], function(tpl) {
	var controller = function() {
        common.tabFocus("结算中");
        var initialInvoiceLength=0;
		var url = common.serverBaseUrl + urls.allUrls.getSummary; //汇总单详情
		var detailData = {
			id: common.getQueryString("id")
		};
		var callback = function(r) {
			if(r.code == "0000") {
				appView.html(_.template(tpl, r));
                initialInvoiceLength=r.invoices.length;
                animate();
			}else if(r.code=="1020"){
                common.getOutFun();
            }else{
                dialog({
                    title: '提示',
                    modal: true,
                    content: r.message,
                    ok: function() {},
                    cancel: false
                }).width(320).show();
            }
		};
		common.postData(url, detailData, callback, true);
        function animate(){
            //删除发票
            $(".invoice-tab-close").bind("click",function(){
                $(this).parent().parent(".settle-details-addInvoice").hide();
            });
            //添加发票
            $('.settle-details-addInvoice-btn').bind("click",function(){
                $('.settle-details-addInvoice-block').before("<div class='settle-details-addInvoice'>"+
                    "<div class='settle-details-addInvoice-info'>"+
                        "<span>"+
                            "<span class='invoice-title'>*发票号：</span><input type='text' class='invoice-num-input invoiceNum' /><span class='invoiceNumErrTip'>输入的发票格式不正确</span>"+
                        "</span><br />"+
                        "<span>"+
                            "<span class='invoice-title'>*发票金额：</span><input type='text' class='invoice-num-input invoiceAmount' />"+
                        "</span><br />"+
                        "<span>"+
                            "<span class='invoice-title'>*开票日期：</span><input type='text' class='invoice-num-input invoiceName' />"+
                        "</span><br />"+
                        "<span>"+
                            "<span class='invoice-title'>*摘要内容：</span><input type='text' class='invoice-num-input invoiceAbstract' />"+
                        "</span><br />"+
                        "<span>"+
                            "<span class='invoice-title'>*开票单位：</span><input type='text' class='invoice-num-input invoiceCompany' value='"+$.cookie('username1')+"' />"+
                        "</span><br />"+
                        "<span>"+
                            "<span class='invoice-title'>*开户行名称：</span>"+
                            "<select class='invoice-num-input invoiceBank'></select>"+
                            "<span class='invoiceAccount-add-btn'>添加新账号</span>"+
                        "</span><br />"+
                        "<span>"+
                            "<span class='invoice-title'>*银行账号：</span>"+
                            "<span class='invoice-accountNum'></span>"+
                        "</span><br />"+
                    "</div>"+
                    "<div class='invoice-tab'>"+
                        "<span class='invoice-tab-info'>发票</span>"+
                        "<span class='invoice-tab-close'>&nbsp;</span>"+
                    "</div>"+
                "</div>");
                //初始化开户行列表
                var initialGetSuppBankUrl=common.serverBaseUrl + urls.allUrls.getSuppBank;
                var initialGetSuppBankCallback=function(result){
                    if(result.code=="0000"){
                        $('.invoiceBank').empty();
                        for(var i=0,j=result.list.length;i<j;i++){
                            $('.invoiceBank').append("<option>"+result.list[i].bankName+"&nbsp;&nbsp;&nbsp;&nbsp;"+result.list[i].bankNum+"</option>");
                        }
                    }else if(result.code=="1020"){
                        common.getOutFun();
                    }else{
                        dialog({
                            title: '提示',
                            modal: true,
                            content: r.message,
                            ok: function() {},
                            cancel: false
                        }).width(320).show();
                    }
                }
                common.postData(initialGetSuppBankUrl,{},initialGetSuppBankCallback, true);
                //验证发票号的规则
                $(".invoiceNum").bind('input propertychange',function(){
                    if(common.isInvoiceNum($(this).val())){
                        $(this).next().hide();
                    }else{
                        $(this).next().show();
                    }
                });
                //删除发票
                $(".invoice-tab-close").bind("click",function(){
                    $(this).parent().parent(".settle-details-addInvoice").remove();
                });
                /*时间控件*/
               setTimeout(function(){
	               	laydate({
	                    elem: '#settle-details-invoice .invoiceName',
	                }); 
               },1000);
               function addPop(){
                    this.addpoup = null;
                    this.settings = {
                        id : "login",
                        w : 300,
                        h: 200
                    }
                }
                addPop.prototype.json = {}//为了防止多次点击,只能点击一次
                addPop.prototype.init = function(opt){
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

                  
                addPop.prototype.create = function(){//创建弹框DOM
                    this.addpoup = document.createElement("div");
                    this.addpoup.className = "login";
                    this.addpoup.innerHTML = '<div class="poptitle"><span>'+this.settings.title+'</span><span class="popclose">&nbsp;</span></div><div class="popcontent"><div class="pop-inner" style="height:'+(this.settings.h/3)*2+'px;"></div><div style="height:'+(this.settings.h/3)*1+'px;text-align:center;"><a href="javascript:void(0);" class="pop-sure">确定</a><a href="javascript:void(0);" class="pop-cancel">取消</a></div></div>';
                  
                    document.body.appendChild(this.addpoup);

                    this.addpoup.style.width = this.settings.w + 'px';
                    this.addpoup.style.height = this.settings.h + 'px';
                     

                    if(this.settings.dir =="center"){

                      this.addpoup.style.left  = (viewWidth() - this.addpoup.offsetWidth)/2 + 'px';
                      this.addpoup.style.top  = (viewHeight() - this.addpoup.offsetHeight)/2 + 'px';

                    }
                    else if( this.settings.dir == 'right' ){
                      this.addpoup.style.left =  (viewWidth() - this.addpoup.offsetWidth) + 'px';
                      this.addpoup.style.top =  (viewHeight() - this.addpoup.offsetHeight) + 'px';
                    }
                }


                addPop.prototype.close = function(){//close window on right side
                    var aSpan = $('.popclose');
                    var popCancel = $('.pop-cancel');
                    var This = this;

                    aSpan[0].onclick = function(){
                        document.body.removeChild(This.addpoup);
                        This.json[This.settings.iNow] = true; //在关闭按钮的时候 变成true 然后下次可点击
                    }
                    popCancel[0].onclick = function(){
                        document.body.removeChild(This.addpoup);
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
                //添加银行信息
                $('#settle-details-invoice').unbind("click").on("click",".invoiceAccount-add-btn",function(){
                    var bankAccountList=[];
                    var $that=$(this);
                    var p= new addPop();
                    p.init({
                        iNow : 0,
                        title:"",
                        w : 500,
                        h :250,
                        dir:"center"
                    });
                    
                    var str='<h2 class="title-f1">请填写新账号信息</h2><span class="bank-title">*开户行名称：</span><input type="text" placeholder="请输入开户行名称" class="bank-inputValue" /><br /><span class="account-title">*银行账号：</span><input type="text" placeholder="请输入银行卡号码" class="account-inputValue" /><br /><span class="account-ErrInput">号码格式错误，请输入数字</span>';
                    $(".pop-inner").html(str);
                    $(".pop-sure").bind("click",function(){
                        var addSuppBankUrl=common.serverBaseUrl + urls.allUrls.addSuppBank;
                        var addSuppBankData={
                            bankName:$('.bank-inputValue').val(),
                            bankNum:$('.account-inputValue').val()                            
                        };
                        var addSuppBankCallback=function(r){
                            
                            if(addSuppBankData.bankNum==""){
                                $(".account-ErrInput").show();
                            }else if(r.code == "0000") {
                                /* $that.parent().next().next().find('.invoice-accountNum').text(addSuppBankData.bankNum); */
                                //获取开户行列表
                                var getSuppBankUrl=common.serverBaseUrl + urls.allUrls.getSuppBank;
                                var getSuppBankCallback=function(result){
                                    if(result.code=="0000"){
                                        $that.siblings('.invoiceBank').empty();
                                        for(var i=0,j=result.list.length;i<j;i++){
                                            $that.siblings('.invoiceBank').append("<option>"+result.list[i].bankName+"&nbsp;&nbsp;&nbsp;&nbsp;"+result.list[i].bankNum+"</option>");
                                        }
                                    }else if(result.code=="1020"){
                                        common.getOutFun();
                                    }else{
                                        dialog({
                                            title: '提示',
                                            modal: true,
                                            content: r.message,
                                            ok: function() {},
                                            cancel: false
                                        }).width(320).show();
                                    }
                                }
                                common.postData(getSuppBankUrl,{},getSuppBankCallback, true);
                                $('.login .popclose').click();
                            }else if(r.code=="0002"){
                                $(".account-ErrInput").show();
                            } else if(r.code == "1020"){
                                common.getOutFun();
                            }else {
                                dialog({
                                    title: '提示',
                                    modal: true,
                                    content: r.message,
                                    ok: function() {},
                                    cancel: false
                                }).width(320).show();
                            }    
                        }
                        common.postData(addSuppBankUrl, addSuppBankData,addSuppBankCallback, true);    
                    });
                });
            }); 
            //修改发票详情
             //初始化开户行列表
            var initialGetSuppBankUrl=common.serverBaseUrl + urls.allUrls.getSuppBank;
            var initialGetSuppBankCallback=function(result){
                if(result.code=="0000"){
                    $('.invoiceBank').empty();
                    for(var i=0,j=result.list.length;i<j;i++){
                        $('.invoiceBank').append("<option>"+result.list[i].bankName+"&nbsp;&nbsp;&nbsp;&nbsp;"+result.list[i].bankNum+"</option>");
                    }
                }else if(result.code=="1020"){
                    common.getOutFun();
                }else{
                    dialog({
                        title: '提示',
                        modal: true,
                        content: r.message,
                        ok: function() {},
                        cancel: false
                    }).width(320).show();
                }
            }
            common.postData(initialGetSuppBankUrl,{},initialGetSuppBankCallback, true);
            //验证发票号的规则
            $(".invoiceNum").bind('input propertychange',function(){
                if(common.isInvoiceNum($(this).val())){
                    $(this).next().hide();
                }else{
                    $(this).next().show();
                }
            });
            //删除发票
            $(".invoice-tab-close").bind("click",function(){
                $(this).parent().parent(".settle-details-addInvoice").remove();
            });
            /*时间控件*/
           setTimeout(function(){
                laydate({
                    elem: '#settle-details-invoice .invoiceName',
                }); 
           },1000);
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
                this.opoup.innerHTML = '<div class="poptitle"><span>'+this.settings.title+'</span><span class="popclose">&nbsp;</span></div><div class="popcontent"><div class="pop-inner" style="height:'+(this.settings.h/3)*2+'px;"></div><div style="height:'+(this.settings.h/3)*1+'px;text-align:center;"><a href="javascript:void(0);" class="pop-sure">确定</a><a href="javascript:void(0);" class="pop-cancel">取消</a></div></div>';
              
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


            oPop.prototype.close = function(){//close window on right side
                var aSpan = $('.popclose');
                var popCancel = $('.pop-cancel');
                var This = this;

                aSpan[0].onclick = function(){
                    document.body.removeChild(This.opoup);
                    This.json[This.settings.iNow] = true; //在关闭按钮的时候 变成true 然后下次可点击
                }
                popCancel[0].onclick = function(){
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
            //添加银行信息
            $('#settle-details-invoice').on("click",".invoiceAccount-add-btn",function(){
                var bankAccountList=[];
                var $that=$(this);
                var p1= new oPop();
                p1.init({
                    iNow : 0,
                    title:"",
                    w : 500,
                    h :250,
                    dir:"center"
                });
                
                var str='<h2 class="title-f1">请填写新账号信息</h2><span class="bank-title">*开户行名称：</span><input type="text" placeholder="请输入开户行名称" class="bank-inputValue" /><br /><span class="account-title">*银行账号：</span><input type="text" placeholder="请输入银行卡号码" class="account-inputValue" /><br /><span class="account-ErrInput">号码格式错误，请输入数字</span>';
                $(".pop-inner").html(str);
                $(".pop-sure").bind("click",function(){
                    var modifySuppBankUrl=common.serverBaseUrl + urls.allUrls.addSuppBank;
                    var modifySuppBankData={
                        bankName:$('.bank-inputValue').val(),
                        bankNum:$('.account-inputValue').val()                            
                    };
                    var modifySuppBankCallback=function(r){
                        if(modifySuppBankData.bankNum==""){
                            $(".account-ErrInput").show();
                        }else if(r.code == "0000") {
                            /* $that.parent().next().next().find('.invoice-accountNum').text(addSuppBankData.bankNum); */
                            //获取开户行列表
                            var getSuppBankUrl=common.serverBaseUrl + urls.allUrls.getSuppBank;
                            var getSuppBankCallback=function(result){
                                if(result.code=="0000"){
                                    $that.siblings('.invoiceBank').empty();
                                    for(var i=0,j=result.list.length;i<j;i++){
                                        $that.siblings('.invoiceBank').append("<option>"+result.list[i].bankName+"&nbsp;&nbsp;&nbsp;&nbsp;"+result.list[i].bankNum+"</option>");
                                    }
                                }else if(result.code=="1020"){
                                    common.getOutFun();
                                }else{
                                    dialog({
                                        title: '提示',
                                        modal: true,
                                        content: r.message,
                                        ok: function() {},
                                        cancel: false
                                    }).width(320).show();
                                }
                            }
                            common.postData(getSuppBankUrl,{},getSuppBankCallback, true);
                            $('.login .popclose').click();
                        }else if(r.code=="0002"){
                            $(".account-ErrInput").show();
                        } else if(r.code == "1020"){
                            common.getOutFun();
                        }else {
                            dialog({
                                title: '提示',
                                modal: true,
                                content: r.message,
                                ok: function() {},
                                cancel: false
                            }).width(320).show();
                        }    
                    }
                    common.postData(modifySuppBankUrl, modifySuppBankData,modifySuppBankCallback, true);    
                });
            });
            //保存发票信息
            $(".settle-details-save-btn").bind("click",function(){
                if($(".settle-details-addInvoice").length==0){
                    var saveData={
                        summaryId:common.getQueryString("id"),
                        invoices:[]
                    };
                    saveInvoice(saveData);
                }else{
                    var invoiceList=[];
                    for(var i=0,l=$(".settle-details-addInvoice").length;i<l;i++){
                        if(i<initialInvoiceLength){
                            var invoiceObj={
                                invoiceNo:$(".settle-details-addInvoice").eq(i).find(".invoiceNum").val(),
                                amount:$(".settle-details-addInvoice").eq(i).find(".invoiceAmount").val(),
                                operTime:$(".settle-details-addInvoice").eq(i).find(".invoiceName").val(),
                                remark:$(".settle-details-addInvoice").eq(i).find(".invoiceAbstract").val(),
                                drawer:$(".settle-details-addInvoice").eq(i).find(".invoiceCompany").val(),
                                bankName:$(".settle-details-addInvoice").eq(i).find(".invoiceBank option:selected").val().split(/\s+/)[0],
                                bankNum:$(".settle-details-addInvoice").eq(i).find(".invoiceBank option:selected").val().split(/\s+/)[1]
                            }
                        }else{
                            var invoiceObj={
                                /*id: common.getQueryString("id"),*/
                                invoiceNo:$(".settle-details-addInvoice").eq(i).find(".invoiceNum").val(),
                                amount:$(".settle-details-addInvoice").eq(i).find(".invoiceAmount").val(),
                                operTime:$(".settle-details-addInvoice").eq(i).find(".invoiceName").val(),
                                remark:$(".settle-details-addInvoice").eq(i).find(".invoiceAbstract").val(),
                                drawer:$(".settle-details-addInvoice").eq(i).find(".invoiceCompany").val(),
                                bankName:$(".settle-details-addInvoice").eq(i).find(".invoiceBank option:selected").val().split(/\s+/)[0],
                                bankNum:$(".settle-details-addInvoice").eq(i).find(".invoiceBank option:selected").val().split(/\s+/)[1]
                            }
                        }
                        invoiceList.push(invoiceObj);
                    }
                    var saveData={
                        summaryId:common.getQueryString("id"),
                        invoices:invoiceList
                    };
                    saveInvoice(saveData);
                }
            });
            //取消回到上一个页面
            $(".settle-details-cancel-btn").bind("click",function(){
                window.location.href="#settling";
            });
        }
        function saveInvoice(saveInvoiceData){
            var saveInvoiceCallback=function(result){
                if(result.code=="0000"){
                    window.location.href="#settling";                    
                }else if(result.code=="1020"){
                    common.getOutFun();
                }else{
                    dialog({
                        title: '提示',
                        modal: true,
                        content: result.message,
                        ok: function() {},
                        cancel: false
                    }).width(320).show();
                }
            }
            var saveUrl=common.serverBaseUrl + urls.allUrls.addOrRemoveInvoice;
            common.postData(saveUrl, saveInvoiceData, saveInvoiceCallback, true);
        }
	}
	return controller;
});
