define(['text!module/cms/column.html', 'text!module/cms/header.html', 'text!module/cms/common_nav.html', 'css!module/cms/style/cms.css'], function(tpl, header, nav) {
	var controller = function() {
		/*userPermissions = JSON.parse($.cookie("permissions"));*/
		appView.html(_.template(header));
        var data={
            currentPage:1,
            pageSize:20            
        };
		//$('#right-container').html(nav + tpl); //未联调页面加载

		//获取标志
		var flag = common.getQueryString("key");

		function callback(data) {
			if(data.resultCode == "0000") {
                if(data.list != undefined && data.list.length) {
					data.flag = true;
				} else {
					data.flag = false;
				}
				data.nav = nav;
				$("#right-container").html(_.template(tpl, data));
                

				//判断导航active
				$(".secondary-title").removeClass("secondary-active");
				var len = $(".secondary-title").length;
				for(var i = 0; i < len; i++) {
					var _d = $(".secondary-title")[i];
					if($(_d).attr("data-flag") == flag) {
						$(_d).addClass("secondary-active");
					}
				}
				var totalP = data.totalPage * 20;
				common.pageFun(totalP, data.currentPage, 20, page); //页码初始化
				eventBind();
            }else {
				dialog({
					title: '提示',
					modal: true,
					content: data.msg,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		}
		common.postData(cmsUrl + urls.allUrls.columnlistNotPage, data, callback, true);
        /**
		 * 分页回调函数设置
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * return {Function} 分页回调函数
		 * 
		 * */
		function page(pageIndex) {
			requestData.page = pageIndex + 1;
			common.postData(url, requestData, updatecallback, true);
		}
		/*
		 * 搜索页面更新
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * */
		function updatecallback(data) {
			if(data.resultCode == "0000") {
				if(data.list != undefined && data.list.length) {
					data.flag = true;
				} else {
					data.flag = false;
				}

				var totalP = data.totalPage * data.pageSize;
				$("#list").html(_.template(loadHtml, data)); //列表更新
				common.pageFun(totalP, data.currentPage, data.pageSize, page); //页码初始化
			}
		}
        function eventBind(){
        	//二级菜单点击刷新
			$(".secondary-title").eq(1).bind("click",function(){
				window.location.reload()
			})
            //删除栏目
            $(".del").bind("click",function(){
                var delId = $(this).attr("data-id");
                var callback=function(data){
                    if(data.resultCode == "0000") {
                        dialog({
                            title: '提示',
                            modal: true,
                            content:"您确定删除该栏目吗？" ,
                            ok: function() {
                                window.location.reload();
                            },
                            cancel: function(){}
                        }).width(320).show();        
                    }else {
                        dialog({
                            title: '提示',
                            modal: true,
                            content: data.msg,
                            ok: function() {},
                            cancel: false
                        }).width(320).show();
                    }
                }
                

                common.postData(cmsUrl + urls.allUrls.deleteColumn+delId, {}, callback, true);    

            });
        }
	};
	return controller;
});
