define(['text!module/department/mainPerson.html', 'text!module/department/header.html', 'text!module/department/nav.html', 'text!module/department/loadHtmlmain.html', 'js/libs/jquery.validate.min', 'css!module/department/style/department.css?'], function(tpl, header, nav, loadHtmlmain) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		$('#right-container').html(_.template(nav));

		var keyWord = decodeURIComponent(common.getQueryString("key"));
		var departmentId = parseInt(decodeURIComponent(common.getQueryString("id")));
		var department = decodeURIComponent(common.getQueryString("seq"));
		var parentId = parseInt(decodeURIComponent(common.getQueryString("parentId")));
		var managerId = parseInt(decodeURIComponent(common.getQueryString("managerId")));

		//新增负责人数据
		var listDataNew = {
			orgUserListQuerySet: {
				queryTerm: null,
				status: 1
			},
			pageSize: 10000,
			sort: 1
		};

		//更换负责人数据
		var listDataEdit = {
			id: departmentId
		};

		//初始回调函数
		function callbackFun(datas) {
			if(datas.code === "0000") {
				datas.flag = keyWord;
				datas.department = department;
				datas.managerId = managerId;

				//模块内容
				$('#right-container').append(_.template(tpl, datas));

				//页面回调函数
				var callbackPageFun = function(datasP) {
					if(datasP.code === "0000") {
						if(datasP.userList) {
							datasP.flag = 'addMain';
						} else {
							datasP.flag = 'editMain';
						}
						$("#add-member-info-wrap").html(_.template(loadHtmlmain, datasP));
					}
				};

				//查询条件
				$("#search-btn").on("click", function() {
					///if($("#search-value").val()) {
						if(keyWord == "addMain") {
							listDataNew.orgUserListQuerySet.status = 1;
							listDataNew.orgUserListQuerySet.queryTerm = $("#search-value").val();
							common.postData(testUrl + urls.allUrls.getMemberList, listDataNew, callbackPageFun, true);

						} else {
							listDataNew.orgUserListQuerySet.status = 1;
							listDataNew.orgUserListQuerySet.queryTerm = $("#search-value").val();
							/*listDataEdit.query = $.trim($("#search-value").val());*/
							common.postData(testUrl + urls.allUrls.getMemberList, listDataNew, callbackPageFun, true);
						}

					/*} else {
						dialog({
							title: '提示',
							modal: true,
							content: "请输入查询条件",
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}*/
				});

				$("#search-value").keydown(function(event) {
					if(event.keyCode == 13) {
						$("#search-btn").click();
					}
				});

				$("#main-form").validate({
					rules: {
						mainperson: {
							required: true
						}
					},
					messages: {
						mainperson: {
							required: "请选择负责人"
						}
					},
					errorPlacement: function(error, element) {
						$(".edit-error-place").html($(error));
					},
					submitHandler: function() {

						//更换/新增负责人
						var dataEdit = {
							id: departmentId,
							name: department,
							parentId: parentId,
							managerId: parseInt($("input:checked").val())
						};

						function callbackStatusFun(datas) {
							if(datas.code === "0000") {
								window.location.href = "#dDetail?id=" + departmentId;
							}
						}

						switch(keyWord) {
							case "addMain":
								common.postData(testUrl + urls.allUrls.editDepartment, dataEdit, callbackStatusFun, true);
								break;
							case "editMain":
								common.postData(testUrl + urls.allUrls.editDepartment, dataEdit, callbackStatusFun, true);
								break;
						}

					}

				});

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

		switch(keyWord) {
			case "addMain":
				common.postData(testUrl + urls.allUrls.getMemberList, listDataNew, callbackFun, true);
				break;
			case "editMain":
				common.postData(testUrl + urls.allUrls.getMemberList, listDataNew, callbackFun, true);
				break;
		}

	};
	return controller;
});