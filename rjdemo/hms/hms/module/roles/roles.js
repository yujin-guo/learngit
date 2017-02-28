define(['text!module/roles/roles.html', 'text!module/roles/header.html', 'text!module/roles/nav.html', 'text!module/roles/loadHtml.html', 'css!module/roles/style/roles.css?'], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		userPermissions=JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		var pageIndex = 1;
		var pageSize = common.pageSize;
		var roleData = {};

		var callbackRoleFun = function(datas) {
         
			if(datas.code === "0000") {
				datas.nav = nav;
                datas.common=common;
				if(datas.roles.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}

				//模块内容
				$('#right-container').html(_.template(tpl, datas));
				
				$(".secondary-active a").click(function(){
					window.location.reload();
				});

				//页面回调函数
				var callbackPageFun = function(datasP) {
          
					if(datasP.code === "0000") {
						if(datasP.roles.length) {
							datasP.flag = true;
						} else {
							datasP.flag = false;
						}
						$("#list").html(_.template(loadHtml, datasP));
						common.pageFun(datasP.pageSize * datasP.totalPages, datasP.pageNo, datasP.pageSize, pageEvent);
					}
				};
                
                //删除角色回调函数
                var callbackDelFun = function(datas) {
               
					if(datas.code === "0000") {
                        common.postData(testUrl + urls.allUrls.getRoles, roleData, callbackRoleFun, true);
					}
				};

				//页码触发事件
				var pageEvent = function(pageIndexs) {
					roleData.pageNo = pageIndexs + 1;
					common.postData(testUrl + urls.allUrls.getRoles, roleData, callbackPageFun, true);
				};

				//页码
				common.pageFun(datas.pageSize * datas.totalPages, datas.pageNo, datas.pageSize, pageEvent);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPages, pageEvent);

				//删除角色
				$("#list").on("click", ".del-role", function() {
                    var delData={
                        roleId:$(this).attr("data-id")
                    };
                    dialog({
                        title: '提示',
                        modal:true,
                        content:'确定删除该角色？',
                        ok: function () {
                            common.postData(testUrl + urls.allUrls.deleteRoles, delData, callbackDelFun, true);
                        },
                        cancel: function () {}
                    }).width(320).show();
				});
			}
		};
		common.postData(testUrl + urls.allUrls.getRoles, roleData, callbackRoleFun, true);
	};
	return controller;
});