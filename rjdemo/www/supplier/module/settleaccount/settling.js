define(['text!module/settleaccount/settling.html', 'text!module/settleaccount/loadsettle.html', 'css!module/settleaccount/style/settleaccount.css'], function(tpl, loadPage) {
	var controller = function(index) {
		var url = common.serverBaseUrl + urls.allUrls.getSummaries; //汇总单列表
		var pageSize = 20;
		var requestData = {
			pageNo: 1,
			pageSize: pageSize
		};
		var callback = function(r) {
			if(r.code == "0000") {
				var data = {
					data: r,
					s: r.organizations
				}
				if(r.organizations != undefined && r.organizations.length) {
					data.flag = true;
				} else {
					data.flag = false;
				}
				appView.html(_.template(tpl, data));
				
				
				//页码隐藏
				if(data.flag == false) {
					$(".page-wrap").css("display", "none");
				} else {
					$(".page-wrap").css("display", "block");
				}

				common.pageFun(r.totalPage * pageSize, 1, pageSize, page);
                //获取医院列表
                var getOrgsUrl = common.serverBaseUrl + urls.allUrls.getOrgs; //获取医院列表
                var getOrgsCallback=function(r){
                    if(r.code=="0000"){
                        $(".balance-hospital").prepend("<option>全部医院</option>");
                        var hospital_list="";
                        for(var i=0,l=r.organizations.length;i<l;i++){
                            hospital_list+="<option data-id='"+r.organizations[i].id+"'>"+r.organizations[i].organization+"</option>";
                        }
                        $(".balance-hospital").append(hospital_list);
                        getDeptList();
                    }else if(r.code == "1020"){
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
                common.postData(getOrgsUrl,{},getOrgsCallback,true);  
                
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
		};
		common.postData(url,requestData,callback,true);

		function getNowDate(){
			var date=new Date(),
				y=date.getFullYear(),
				m=(date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1),
				d=date.getDate();
			return y+'-'+m+'-'+d;
		}

		/*
		 * 分页回调函数设置
		 * 
		 * */
		function page(pageIndex) {
			requestData.pageNo = pageIndex + 1;
			common.postData(url, requestData, updateCallback, true);
		}

		function updateCallback(r) {
			if(r.code == "0000") {
				var result = {
					data: r,
					s: r.organizations
				}
				if(r.organizations != undefined && r.organizations.length) {
					result.flag = true;
				} else {
					result.flag = false;
				}
				$("#body-list").html(_.template(loadPage, result));
				$(".total-page-num").html(r.totalPage);

				//页码隐藏
				if(result.flag == false) {
					$(".page-wrap").css("display", "none");
				} else {
					$(".page-wrap").css("display", "block");
				}
				common.pageFun(r.totalPage * pageSize, requestData.pageNo, pageSize, page);
				window.scrollTo(0, 0);
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		}
        function getDeptList(){
            $(".balance-hospital").on("change",function(){
                //获取采购部门列表
                var getDeptUrl=common.serverBaseUrl + urls.allUrls.getPurchaseDepartments; //获取采购部门列表
                var orgId=$(this).children('option:selected').data('id');
                if($(this).val()=="全部医院"){
                    window.location.reload();
                }else{
                    var getDeptData={orgId:orgId};
                }
                var getDeptCallback=function(result){
                    if(result.code=="0000"){
                        var dept_list="";
                        for(var i=0,l=result.departments.length;i<l;i++){
                            dept_list+="<option data-id='"+result.departments[i].id+"'>"+result.departments[i].department+"</option>";
                        }
                        $(".balance-department").empty().html("<option>选择采购部门</option>"+dept_list);
                        var updateHospitalData={
                            pageNo: 1,
			                pageSize: 20,
                            orgId:orgId
                        };
                        common.postData(url,updateHospitalData,updateCallback,true);
                    }else if(result.code == "1020"){
                        common.getOutFun();
                    }else {
                        dialog({
                            title: '提示',
                            modal: true,
                            content: result.message,
                            ok: function() {},
                            cancel: false
                        }).width(320).show();
                    }
                }
                common.postData(getDeptUrl,getDeptData,getDeptCallback,true);  
            })
            eventBind();
        }
		function eventBind() {
			//checked
			$("#body-list").on("click",".supplier-account-check",function(){
				if($(this).hasClass("checked")){
					$(this).removeClass("checked");
				}else{
					$(this).addClass("checked");
				}
			});
			
			//tab状态（全部,准备中,审核中,付款中,已完成）
			$(".balance-header-search li").bind("click", function() {
				$(this).addClass("balance-header-selected").siblings().removeClass("balance-header-selected");
				var text = $(this).attr("data-flag");
				var status;
				if(text == "fillin") {
					status = 6;
				} else if(text == "check") {
					status = 1;
				} else if(text == "pay") {
					status = 2;
				} else if(text == "send") {
					status = 7;
				} else if(text == "finish") {
					status = 3;
				}else if(text == "all") {
					status = '';
				}
				requestData = {
					pageNo: 1,
					pageSize: pageSize,
				    status: status
				};
				common.postData(url, requestData, updateCallback, true);
			})
			//时间控件
			/* laydate({
				elem: '#balance-more-startdate'
			});
			laydate({
				elem: '#balance-more-enddate'
			}); */
			//首页和末页
			$(".balance .head").click(function() {
				$("#pagination .prev").next().click()
			});
			$(".balance .end").click(function() {
				$("#pagination .next").prev().click()
			});
            //根据课题组筛选汇总单
            $(".balance-department").on("change",function(){
                var updateDepartmentData={
                    pageNo: 1,
                    pageSize: 20,
                    departmentId:$(this).children('option:selected').data('id')
                };
                common.postData(url,updateDepartmentData,updateCallback,true);      
            });
            //修改发票号
            /* $('#body-list').on("click",".updateInvoice",function(){
            	var $invoiceNumber=$(this).parents('td').siblings('.balance-fapiao');
                var updateId=$(this).attr("data-id");
                var invoiceArray=$invoiceNumber.text();
                var p3  = new oPop();
                p3.init({
                    iNow : 0,
                    title:"",
                    w : 500,
                    h :250,
                    dir:"center"
                });
                var str='<h2 class="updateInvoice-title">修改发票号</h2><div class="updateInvoice-num"><input type="text" class="updateInvoice-num-input" value="'+invoiceArray+'" /></div><div class="updateInvoice-errorTip">请填写正确的发票号码,多个发票号用逗号隔开</div>';
                $(".pop-inner").html(str);
                $(".pop-sure").bind("click",function(){
                    var reg=/^([0-9]{8}(,|，|$))+$/;
                    var str=$(".updateInvoice-num-input").val();
                    if(reg.test(str)){
                        $(".updateInvoice-errorTip").hide();
                        var updateUrl=common.serverBaseUrl + urls.allUrls.addOrRemoveInvoice;//修改发票号提交
                        var invoiceData=str.match(/\d{8}/g); 
                        var updateData={
                            id:updateId,
                            invoices:invoiceData
                        };
                        var updateInvoiceCallback=function(r){
                            if(r.code == "0000") {
                                $invoiceNumber.text(str);
                                $('.login .popclose').click();
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
                        common.postData(updateUrl,updateData,updateInvoiceCallback, true);
                    }else{
                        $(".updateInvoice-errorTip").show();
                    }                    
                });
                
            });  */
            //打印汇总单
            $('#body-list').on("click",".printInvoice",function(){
                var printId=$(this).attr("data-id");
                var printUrl=common.serverBaseUrl + urls.allUrls.printSummary;//打印汇总单
                var printCallback=function(r){
                    if(r.code == "0000") {
                        window.open(common.serverBaseUrl+"/"+r.url);
                    }else if(r.code == "1020"){
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
                common.postData(printUrl, {summayNo:printId},printCallback, true);   
            });
            //确认付款
            $('#body-list').on("click",".sureNo",function(){
            	var $that=$(this);
            	var $status=$that.parents('td').siblings('.balance-status');
                var sureId=$(this).attr("data-id");
                dialog({
                    title: '提示',
                    modal: true,
                    content: "确认付款？",
                    ok: function(){
                        var sureUrl=common.serverBaseUrl + urls.allUrls.updateStatus;//更改汇总单状态
                        var updateCallback=function(r){
                            if(r.code == "0000") {
                                $status.text('已完成');
                                $that.remove();
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
                        common.postData(sureUrl, {id:sureId,status:3},updateCallback, true);   
                    },
                    cancel: function() {}
                }).width(320).show();
            });
            //移除结算单
            $('#body-list').on("click",".removeReceipt",function(){
            	var $that=$(this);
                var removeId=$(this).attr("data-id");
                var p2= new oPop();
                p2.init({
                    iNow : 0,
                    title:"",
                    w : 500,
                    h :250,
                    dir:"center"
                });
                
                var str='<h2 class="title-f1">移除提示</h2><p class="content-f1">将移除结算汇总单，您可以在待结算中显示找到移除的结算单，确认移除吗？</p>';
                $(".pop-inner").html(str);
                $(".pop-sure").bind("click",function(){
                    var removeUrl=common.serverBaseUrl + urls.allUrls.deleteSummary;//移除汇总单确认
                    var removeCallback=function(r){
                        if(r.code == "0000") {
                            $that.parents('tr').remove();
                            $('.login .popclose').click();
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
                    common.postData(removeUrl, {id:removeId},removeCallback, true);    
                });
            });
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


            oPop.prototype.close = function(){//右侧关闭按钮
                var aSpan = $('.popclose');
                var popCancel = $('.pop-cancel');
                var This = this;

                aSpan[0].onclick = function(){
                    document.body.removeChild(This.opoup);
                    This.json[This.settings.iNow] = true; //在关闭按钮的时候 变成true 然后下次可点击
                }
                popCancel[0].onclick = function(){
                    document.body.removeChild(This.opoup);
                    This.json[This.settings.iNow] = true; //在关闭按钮的时候 变成true 然后下次可点击
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
			//左边菜单tab选中
			common.tabFocus("结算中");
			//home页跳转
			if(index){
				if(index==1){
					$(".balance-header-search li").eq(index).click();
				}else if(index==3){
					$(".balance-header-search li").eq(index).click();
				}
			}
		}
	};
	return controller;
});
