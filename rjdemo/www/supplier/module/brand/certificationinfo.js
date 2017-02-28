define(['text!module/brand/certificationInfo.html','css!module/brand/style/certificationBrand.css',"js/libs/laydate.dev"],function(tpl){
	var controller=function(){
		//self=1则为自有品牌
		var self=common.getQueryString("self");
		/*有id则为重新提交*/
		if(common.getQueryString("id")){
			var detailsUrl=baseUrl+"/api/brand/brandInfo",
			data={id:common.getQueryString("id")},
			callback=function(r){
				if(r.code=="0000"){
					appView.html(_.template(tpl,r));
					eventsBind();
					$(".c-brand-cname").val(r.brand.cName);
					$(".c-brand-ename").val(r.brand.eName);
					$(".c-brand-manufacture").val(r.brand.manufacture);
					//logo图
					var string='<a href="<%=brand.logo%>" target="_blank" style="position:relative"><img src="<%=brand.logo%>" class="add-column-img" style="margin-right:10px;width:100px;height:100px" ><span class="close-photo">X</span></a>';
					//商标资料图
					var strings='<%_.each(arr,function(i){%><a href="<%=i%>" target="_blank" style="position:relative"><img src="<%=i%>" class="add-column-img" style="margin-right:10px;width:100px;height:100px" ><span class="close-photo">X</span></a><%})%>';
					if(self=="1"){
						$("#selfLogo").html(_.template(string,r));
						$("#selfCertifications").html(_.template(strings,{arr:r.brandAuthDetail.authPic.split(",")}));
					}else{
						$("#agentLogo").html(_.template(string,r));
						switch(r.brandAuthDetail.level){
							case 1:$(".c-brand-info-authorize").text("一级代理");
							break;
							case 2:$(".c-brand-info-authorize").text("二级代理");
							break;
							case 3:$(".c-brand-info-authorize").text("三级代理");
							break;
						};
						if(r.brandAuthDetail.hasOwnProperty("isLongAuth") && r.brandAuthDetail.isLongAuth ){
							return false;
						}else{
							$("#startTime").val(r.brandAuthDetail.endDate.split(" ")[0]);
						}
						$("#agentCertifications").html(_.template(strings,{arr:r.brandAuthDetail.authPic.split(",")}))
					};
					checkImg();
					$(".close-photo").bind("click",function(e){
						$(this).parent("a").remove();
						e.preventDefault();
						checkImg();
					});
				}else if(r.code=="1020"){
					common.getOutFun();
				}
			}
			common.postData(detailsUrl,data,callback,true)
		}else{
			appView.html(_.template(tpl));
			eventsBind();
		}
		function checkImg(){
			/*
			 *检测文件是否达到一定数量，达到 则隐藏“选择文件”按钮
			 * @param [String] selector1 图片容器，按css选择器命名
			 * @param [String] selector2 "选择文件"按钮
			 * @param [String] num 图片限制数量
			 * 
			 * */
			function checkImgNum(selector1,selector2,num){
				if($(selector1).find(".add-column-img").length==num){
					$(selector2).hide();
				}else{
					$(selector2).show();
				};
			}
			if(self==1){
				checkImgNum("#selfLogo","#selfLogoSelect",1);
				checkImgNum("#selfCertifications","#selfCertificationsSelect",5);
			}else{
				checkImgNum("#agentLogo","#agentLogoSelect",1);
				checkImgNum("#agentCertifications","#agentCertificationsSelect",5);
			};
		};
		
		function eventsBind(){
			//品牌类型判定		
			if(self==0){
				$(".c-brand-private").hide();
				$(".c-brand-agent").show();
			}else{
				$(".c-brand-private").show();
				$(".c-brand-agent").hide();
			}	
			//代理级别选择动态效果
			$(".c-brand-info-authorize").bind("click",function(e){
				$(this).toggleClass("c-brand-info-authorize-clicked").next("ul").slideToggle();
				e.stopPropagation();
				
			});
			$(".c-brand-info-right ul li").bind("click",function(){
				var txt=$(this).text();
				$(this).parent().siblings("p").text(txt);
				
			});
			$(document).bind("click",function(){
				$(".c-brand-info-authorize").removeClass("c-brand-info-authorize-clicked").next("ul").slideUp();	
			});
			//文件选取
			var $fileBtn=$(".c-brand-file-select").next("form").children(":file");
			var formId=$(".c-brand-file-select").next("form").eq(0).attr("id");
			var $imgContainer=$(".c-brand-file-select").prev(".c-brand-img-container");
			$(".c-brand-file-select").bind("click",function(){
				/*var $imgWrapper=$(this).siblings(".c-brand-img-container");*/
				/*if($imgWrapper.hasClass("c-brand-logo")){
					if($imgWrapper.find(".add-column-img").length==1){
						dialog({
			                title: '提示',
			                modal:true,
			                content: '只能上传一张logo图。',
			                ok: function () {},
			                cancel: false,
			            }).width(320).show();
			            return false;
					}
				}else if($imgWrapper.hasClass("c-brand-auth-pic")){
					if($imgWrapper.find(".add-column-img").length==5){
						dialog({
			                title: '提示',
			                modal:true,
			                content: '图片上传不能超过5张。',
			                ok: function () {},
			                cancel: false,
			            }).width(320).show();
			            return false;
					}
				};*/
				
				$fileBtn=$(this).next("form").children(":file");
				formId=$(this).next("form").attr("id");
				$imgContainer=$(this).prev(".c-brand-img-container");
				$fileBtn.click();
			})
			$fileBtn.change(function(){
				var callback=function(data){
						var img='<a href="<%=data.url%>" target="_blank" style="position:relative"><img src="<%=data.url%>" class="add-column-img" style="margin-right:10px;width:100px;height:100px" ><span class="close-photo">X</span></a>';
						$imgContainer.append(_.template(img,{data:data}));
						checkImg();
						$(".close-photo").bind("click",function(e){
							$(this).parent("a").remove();
							e.preventDefault();
							checkImg();
						})
					}
				common.fileUpload(formId,callback);
			})
			//提交审核
			var base=common.serverBaseUrl;
			var url=base+"/api/brand/brandApp";//品牌认证地址
			//授权时间
			var isLongAuth=true;
			$("#startTime").click(function(){
				isLongAuth=false;
			});
			$(".c-brand-long-term").click(function(){
				isLongAuth=true;
				$("#startTime").val("");
				dialog({
	                title: '提示',
	                modal:true,
	                content: '您已选择长期授权。',
	                ok: function () {},
	                cancel: false,
	            }).width(320).show();
	
			})
			$(".c-brand-submit").bind("click",function(){
				//填写资料检查
				var $elem=$(this).parents(".c-brand");
				var cName=$.trim($elem.find(".c-brand-cname").val()),
					eName=$.trim($elem.find(".c-brand-ename").val()),
					manufacture=$.trim($elem.find(".c-brand-manufacture").val());
				//授权资料
				var selfAuth=[],agentAuth=[];
				$("#selfCertifications img").each(function(){
					selfAuth.push(this.src);
				});
				$("#agentCertifications img").each(function(){
					agentAuth.push(this.src);
				});
				selfAuth=selfAuth.join(",");
				agentAuth=agentAuth.join(",");
				
				var level=$(".c-brand-info-authorize").text();
				switch(level)
				{
					case "一级代理":level=1;
					break;
					case "二级代理":level=2;
					break;
					case "三级代理":level=3;
					break;	
					default:level=0;
				};
				
				//自有品牌请求数据
				var privateData={
					cName:cName,
					eName:eName,
					manufacture:manufacture,
					logo:$("#selfLogo img").attr("src"),
					authPic:selfAuth,
					level:0,
					isLongAuth:true,
				};
				
				//代理品牌请求数据
				var agentData={
					cName:cName,
					eName:eName,
					manufacture:$.trim($elem.find(".c-brand-manufacture").val()),
					logo:$("#agentLogo img").attr("src"),
					level:level,
					authPic:agentAuth,
				};
				if($("#startTime").val()){
					var mydate=new Date($("#startTime").val());
					agentData.endDate=new Date($("#startTime").val()).getTime();
					agentData.isLongAuth=false;
				}else{
					agentData.isLongAuth=isLongAuth;
				}
				var callback=function(r){
					if(r.code=="0000"){
						window.location.href="#certificationsuccess";
					}else{
						dialog({
			                title: '提示',
			                modal:true,
			                content: r.message,
			                ok: function () {},
			                cancel: false,
			            }).width(320).show();
					}
				}
				if(self==1){
					common.postData(url,privateData,callback,true)
				}else{
					common.postData(url,agentData,callback,true)
				}
			})
			//日期控件
			laydate({
				elem:"#startTime",
				min:laydate.now(),
			});
			common.tabFocus("品牌管理");
		}
	}
	return controller;
});