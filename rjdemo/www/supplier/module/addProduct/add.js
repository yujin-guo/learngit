define(['text!module/addProduct/add.html','css!module/addProduct/style/add.css',"ckeditor/ckeditor.js"],function(tpl){
	var controller=function(sn){
		var url=common.serverBaseUrl+urls.allUrls.findCategory;//商品类别
		var hospitalsUrl=common.serverBaseUrl+urls.allUrls.findOrg;//供应商入驻医院
		var categoryUrl=urls.allUrls.findAllCategories;//一二级分类
		var data={};//模板数据
		var arr=[];//二级目录数组
		var brandList=[];//品牌数组
		var firstId,secondId,brandId;//一级类别id和二级类别id，品牌id
		var requestData={
			findModel:{}
		};//一级目录
		var bidFlag=common.getQueryString("id");  //竞价标志
		var callback=function(r){
			if(r.code=="0000"){
				data.category=r.list;
				_.each(r.list,function(i){
					arr.push(i.subList);
				});
				data.arr=arr;
				brands();
			}else{
				dialog({
                    title: '提示',
                    modal: true,
                    content: r.message,
                    ok: function() {history.back()},
                    cancel: false
                }).width(320).show();
				return false;
			}
		};
		common.postData(categoryUrl,{},callback,false);		
		//品牌申请
		var editor;
		function brands(){
			var url=common.serverBaseUrl+urls.allUrls.getBrandList;
			var callback=function(r){
				if(r.code=="0000"){
					var list=r.brands;
					data.list=list;
					hospitals();
				}
			}
			common.postData(url,{},callback,true);
		}
		//供应商入驻医院
		function hospitals(){
			var callback=function(r){
				if(r.code=="0000"){
					data.hospitals=r.orgs;
					reviseProduct();
				}
			}
			common.postData(hospitalsUrl,{},callback,true);
		}
		//若为修改商品，则请求 商品详情
		function reviseProduct(){
			if(sn){
				var detailsUrl=common.serverBaseUrl+urls.allUrls.getProductInfo;//商品详情
				var detailsCallback=function(r){
					if(r.code=="0000"){
						data.product=r.product;
						appView.html(_.template(tpl,data));
						editor=CKEDITOR.replace("add-editor");//add页面富文本编辑器
						eventBind();
						//设置分类和品牌、商品详情、差异销售价
						$(".add-first-level").text(r.product.category[0].name);
						firstId=r.product.category[0].id;
						$(".add-second-level").text(r.product.category[1].name);
						secondId=r.product.category[1].id;
						if(r.product.brand!=undefined){
							$(".add-brand").text(r.product.brand.name);
							brandId=r.product.brand.id;
						}
						editor.setData(r.product.desc);
						_.each(r.product.priceDifferents,function(i){
							$(".add-hospital-differ .add-checkbox").each(function(){
								if($(this).next(".add-hospital-name").text()==i.org.name){
									$(this).click();
									$(this).siblings(".add-hospital-price").val(i.price);
								}
							})
						});
						//图片删除功能
						$(".close-photo").bind("click",function(e){
						$(this).parent("a").remove();
						e.preventDefault();
					});
					checkImgNum("#addImg2","add-column-img2",1);
					checkImgNum("#addImg1","add-column-img1",5);
					}
				}
				common.postData(detailsUrl,{sn:sn},detailsCallback,true);
			}else{
				data.product={}
				appView.html(_.template(tpl,data));
				editor=CKEDITOR.replace("add-editor");//add页面富文本编辑器
				eventBind();
			}
		}
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
			}
		};
		function eventBind(){
			//菜单下拉效果公共部分
			$(document).bind("click",function(){
				$(".add .add-column-set ul").hide();
				$(".add .add-column-set").removeClass("add-column-set-clicked");
			});
			$(".add .add-column-set li").bind("click",function(){
				var txt=$(this).text();
				$(this).parent("ul").siblings("p").text(txt);
			})

			var index;//一级目录下标
			
			$(".add .add-column-first").bind("click",function(e){
				$(this).toggleClass("add-column-set-clicked").find("ul").slideToggle();
				e.stopPropagation()				
			})
			$(".add .add-column-first li").bind("click",function(){
				index=$(this).index();
				firstId=$(this).find(".add-first-id").val()
				$(".add .add-second-level").text("设置二级分类");//二级类别重置
				$(".add .add-column-second ul").hide();
				$(".add .add-column-second").removeClass("add-column-set-clicked");
			})
			$(".add .add-column-second li").bind("click",function(e){
				secondId=$(this).find(".add-second-id").val();
			});
			$(".add .add-column-brand li").bind("click",function(e){
				brandId=$(this).find("input").val();
			});
			$(".add .add-column-second").bind("click",function(e){
				$(this).toggleClass("add-column-set-clicked").find("ul").eq(index).slideToggle();
				e.stopPropagation();
			});
			$(".add .add-column-brand").bind("click",function(e){
				$(this).toggleClass("add-column-set-clicked").find("ul").slideToggle();
				e.stopPropagation();
			});

			//医院勾选效果
			$(".add .add-checkbox").bind("click",function(){
				$(this).toggleClass("add-checkbox-checkd").siblings(".add-hospital-price").toggle();
			})
			
			//保存并上架
			$(".add-save-push").bind("click",addProduct(3));
			$(".add-save-btn").bind("click",addProduct(2));
			function addProduct(status){//true则为保存并上架，
				return function(){
					var url=common.serverBaseUrl+urls.allUrls.saveProduct,
						firstLevel=$(".add-first-level").text(),
						secondLevel=$(".add-second-level").text(),
						name=$(".add-name").val(),
						specification=$(".add-spec").val(),
						sku=$(".add-stock").val(),
						unit=$(".add-unit").val(),
						price=$(".add-price").val(),
						desc=editor.getData(),
						photoNum=$("#addImage2 .add-column-img").length,
						photosNum=$("#addImage1 .add-column-img").length,
						productNum=$(".add-product-num").val().trim(),
						brand=$(".add-column-brand .add-brand").text();
					//表格验证
					if((url&&name&&specification&&sku&&unit&&price&&productNum&&desc&&photoNum&&photosNum&&(firstLevel!="设置一级分类")&&(secondLevel!="设置二级分类"))==false){
						dialog({
	                        title: '提示',
	                        modal: true,
	                        content: "带'*'为必填项，请将资料补充完整。",
	                        ok: function() {},
	                        cancel: false
		                }).width(320).show();
						return false;
					};
					if(isNaN(sku)||isNaN(price)){
						dialog({
	                        title: '提示',
	                        modal: true,
	                        content: "库存和售价必须为数字。",
	                        ok: function() {},
	                        cancel: false
		                }).width(320).show();
						return false;
					};
					//价格验证
					if(/^\d+(\.\d+)?$/.test(price)==false){
						dialog({
	                        title: '提示',
	                        modal: true,
	                        content: "请正确填写商品价格。",
	                        ok: function() {},
	                        cancel: false
		                }).width(320).show();
						return false;
					};
					//详情图数组
					var photos=[];
					$("#addImage1 .add-column-img").each(function(){
						var arr={
							photo:$(this).prop("src")
						};
						photos.push(arr);
					})
					var requestData={
						product:{
							category:[{id:firstId,name:firstLevel.trim()},{id:secondId,name:secondLevel.trim()}],
							name:name,
							specification:specification,
							sku:sku,
							unit:unit,
							status:status,
							price:price,
							desc:desc,
							photo:$("#addImage2 .add-column-img").eq(0).prop("src"),
							productNum:$(".add-product-num").val().trim(),
							photos:photos,
							brand:{
								id:brandId,
								name:$(".add-column-brand .add-brand").text()
							}
						}
					};
					//有商品编号则为修改商品
					if(sn){
						requestData.product.sn=sn;
					};
					//供应商入驻医院差价检测及相应参数
					var $elem=$(".add-checkbox-checkd");
					var priceDifferents=[];
					if($elem.length>0){
						$elem.each(function(){
							var $that=$(this);
							var arr={
								org:{
									id:$that.siblings(".add-hospital-id").val(),
									name:$that.siblings(".add-hospital-name").text()
								},
								price:$that.siblings(".add-hospital-price").val()
							};
							priceDifferents.push(arr);
						});
						requestData.product.priceDifferents=priceDifferents;
					};
					var callback=function(r){
						if(r.code=="0000"){
							if(sn){
								window.location.href="#productlist";
							}else if(status==3 && bidFlag){
								window.location.href="../purchaser/index.html#biddetail?id="+bidFlag;
							}else{
								window.location.href="#success";
							}
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
					common.postData(url,requestData,callback,true);
				}
			}
			//图片提交
			$(".add-column-img1").click(function(){
				$(".add-file-upload1").click();
			})
			$(".add-file-upload1").change(function(){
				var callback=function(data){
					//var data=JSON.parse(data)
					var img='<a href="<%=data.url%>" target="_blank" style="position:relative"><img src="<%=data.url%>" class="add-column-img" style="margin-right:10px" ><span class="close-photo">X</span></a>';
					$("#addImage1").append(_.template(img,{data:data}));
					$(".close-photo").bind("click",function(e){
						$(this).parent("a").remove();
						e.preventDefault();
						checkImgNum("#addImg1",".add-column-img1",5)
					});
					checkImgNum("#addImage1",".add-column-img1",5);
				}
				common.fileUpload("form1",callback);
			})
			
			$(".add-column-img2").click(function(){
				$(".add-file-upload2").click();
			})
			$(".add-file-upload2").change(function(){
				var callback=function(data){
					//var data=JSON.parse(data)
					var img='<a href="<%=data.url%>" target="_blank" style="position:relative"><img src="<%=data.url%>" class="add-column-img" style="margin-right:10px" ><span class="close-photo">X</span></a>';
					$("#addImage2").append(_.template(img,{data:data}));
					$(".close-photo").bind("click",function(e){
						$(this).parent("a").remove();
						e.preventDefault();
						checkImgNum("#addImage2",".add-column-img2",1);
					});
					checkImgNum("#addImage2",".add-column-img2",1);
				}
				common.fileUpload("form2",callback);
			})
		}	
	}
	return controller;
});