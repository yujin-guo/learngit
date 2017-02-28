define(['text!module/department/department.html', 'text!module/department/header.html', 'text!module/department/nav.html', 'text!module/department/loadHtml.html', 'css!module/department/style/department.css'], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		$('#right-container').html(_.template(nav));
		var listData = {};
		var pageNum = 1;
		var pageSize = common.pageSize;
		var deleteDepart = testUrl + urls.allUrls.deleteDepartment;

		//初始回调函数
		function callbackFun(datas) {
			if(datas.code === "0000") {
				if(datas.departmentItems.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}

				//模块内容
				$('#right-container').append(_.template(tpl, datas));

				if($(".content").height() > 1200) {
					$(".nav-left,.nav-inner-left").css("height", $(".content").height() + "px");
				}

				$(".secondary-active a").click(function() {
					window.location.reload();
				});

				//状态改变回调函数
				function pageCallback(dataP) {
					if(dataP.departmentItems.length) {
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
						departmentItems: []
					};
					if(searchKeyWord) {
						$.each(datas.departmentItems, function(key, value) {
							if(value.managerName == undefined) {
								value.managerName = '';
							}

							if(value.name.indexOf(searchKeyWord) !== -1 || value.managerName.indexOf(searchKeyWord) !== -1) {
								arrLoad.departmentItems.push(datas.departmentItems[key]);
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

				$("#search-value").keydown(function(event) {
					if(event.keyCode == 13) {
						$("#search-btn").click();
					}
				});

				//删除部门
				function deleteCallback(d) {
					if(d.code == "0000") {
						window.location.reload();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: d.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				}
				$("#list").unbind().on("click", ".delete-department", function() {
					var $th = $(this);
					dialog({
						title: '提示',
						modal: true,
						content: "是否删除该部门？",
						ok: function() {
							common.postData(deleteDepart, {
								id: $th.attr("data-id")
							}, deleteCallback, true);
						},
						cancel: true
					}).width(320).show();

				});
			} else if(datas.code == "1020") {
				$("#out-login").click();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();

			}
		}
		common.postData(testUrl + urls.allUrls.getDepartmentList, listData, callbackFun, true);
	};
	return controller;
});