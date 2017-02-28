define(['text!module/department/dDetail.html', 'text!module/department/header.html', 'text!module/department/nav.html', 'text!module/department/loadDepartDetail.html', 'css!module/department/style/department.css?'], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		//$('#right-container').html(_.template(nav));
		
		var departmentId = parseInt(decodeURIComponent(common.getQueryString("id")));
		var type = common.getQueryString("type");
		var level = common.getQueryString("level");

		var listData = {
			id: departmentId
		};
		var pageNum = 1;
		var pageSize = common.pageSize;

		//初始回调函数
		function callbackFun(datas) {
			if(datas.code === "0000") {
				datas.type = type;
				datas.level = level;
				if(datas.departmentItem.members.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				
				if(datas.departmentItem.managerId==undefined||!datas.departmentItem.managerId){
					datas.departmentItem.managerId=null;
				}
				
				//查询负责人
				$.each(datas.departmentItem.members,function(name,key){
					if(key.departmentItem.managerName!=undefined && key.departmentItem.managerName){
						datas.managerId=key.id;
						return false;
					}
				});
				
				//模块内容
				$('#right-container').html(_.template(nav+tpl, datas));
				
				if($(".content").height()>1200){
					console.log($(".nav-left").height(),$(".nav-inner-left").height())
					$(".nav-left,.nav-inner-left").css("height",$(".content").height()+"px");
				}
				
				//状态改变回调函数
				function pageCallback(dataP) {
					if(dataP.members.length > 0) {
						dataP.flag = true;
					} else {
						dataP.flag = false;
					}
			
					$("#list").html(_.template(loadHtml, dataP));
				}

				//查询
				$("#search-btn").unbind().bind("click", function() {
					var searchKeyWord = $.trim($("#search-value").val());
					var arrLoad = {
						members: []
					};
					if(searchKeyWord) {
						$.each(datas.departmentItem.members, function(key, value) {
							if(value.realName.indexOf(searchKeyWord) !== -1) {
								arrLoad.members.push(datas.departmentItem.members[key]);
							}
						});
						pageCallback(arrLoad);
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: '请输入关键字',
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				});
				
				$("#search-value").keydown(function(event){
					if(event.keyCode == 13) {
						$("#search-btn").click();
					}
				});

				//从部门中删除成员
				$("#list").unbind().on("click", ".delete", function() {
					var userIds = [];
					userIds.push(parseInt($(this).attr("data-id")));
					var deleteMemData = {
						id: departmentId,
						userIds: userIds
					};
				
					dialog({
						title: '提示',
						modal: true,
						content: "是否移除该成员？",
						ok: function() {
							common.postData(testUrl + urls.allUrls.deleteMember, deleteMemData, callbackDeleteFun, true);
						},
						cancel:function(){}
					}).width(320).show();

					//删除成员回调函数
					function callbackDeleteFun(dataD) {
						if(dataD.code === "0000") {
							common.postData(testUrl + urls.allUrls.getDepartmentDetail, listData, callbackFun, true);
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: dataD.message,
								ok: function() {},
								cancel: false
							}).width(320).show();
						}
					}
				});
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		}
		common.postData(testUrl + urls.allUrls.getDepartmentDetail, listData, callbackFun, true);
	};
	return controller;
});