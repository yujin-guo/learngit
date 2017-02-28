define(['text!module/department/addMember.html', 'text!module/department/header.html', 'text!module/department/nav.html', 'text!module/department/loadHtmlAdd.html', 'module/department/validate', 'css!module/department/style/department.css?'], function(tpl, header, nav, loadHtmlAdd, validate) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		$('#right-container').html(_.template(nav));

		var keyWord = parseInt(decodeURIComponent(common.getQueryString("key")));
		var department = decodeURIComponent(common.getQueryString("seq"));
		var departmentId = common.getQueryString("departmentId");
		var listData = {
			orgUserListQuerySet: {
				queryTerm: null,
				status: 1
			},
			sort: 1,
			pageSize: 10000
		};

		//初始回调函数
		function callbackFun(dataC) {
			if(dataC.code === "0000") {
				common.postData(testUrl + urls.allUrls.getRoles, {
					pageSize: 999999999
				}, callbackRoleFun, true);

				function callbackRoleFun(datas) {
					if(datas.code == "0000") {
						datas.memberData = dataC;
						datas.flag = keyWord;
						datas.department = department;
						datas.departmentId = departmentId;

						//模块内容
						$('#right-container').append(_.template(tpl, datas));

						//提交
						validate();

						//页面回调函数
						var callbackPageFun = function(datasP) {
							if(datasP.code === "0000") {
								if(datasP.userList.length) {
									datasP.flag = true;
								} else {
									datasP.flag = false;
									datasP.p = keyWord;
									datasP.departmentId = departmentId;
								}
								$("#add-member-info-wrap").html(_.template(loadHtmlAdd, datasP));

								if(datasP.flag == false) {
									$(".role-addMember").css("display", "none");
								} else {
									$(".role-addMember").css("display", "block");

								}
							}
						};

						//查询条件
						$("#search-btn").on("click", function() {
							//if($("#search-value").val()) {
								listData.orgUserListQuerySet.status = 1;
								listData.orgUserListQuerySet.queryTerm = $("#search-value").val();
								common.postData(testUrl + urls.allUrls.getMemberList, listData, callbackPageFun, true);
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

			} else {
				dialog({
					title: '提示',
					modal: true,
					content: dataC.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		}
		common.postData(testUrl + urls.allUrls.getMemberList, listData, callbackFun, true);
	};
	return controller;
});