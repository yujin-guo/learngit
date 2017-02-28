define(['text!module/hospital/hospitalConfig.html', 'text!module/hospital/header.html', 'text!module/hospital/nav.html', 'text!module/hospital/loadHospitalConfig.html', 'css!module/hospital/style/hospital.css?'], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		appView.html(_.template(header));
		var hosConfigListUrl = omsUrl + urls.allUrls.hosConfigList,
			hospitalListUrl = omsUrl + urls.allUrls.hospitalList,
			hospitalEnable = omsUrl + urls.allUrls.hosEnabled,
			pageSize = common.pageSize,
			currentPage = 1,
			requestData = {
				pageSize: pageSize,
				currentPage: currentPage
			};

		function pageEventFun(pageIndex) {
			requestData.currentPage = pageIndex + 1;
			commonFun();
		}

		function updateCallbackFun(r) {
			if(r.resultCode == "0000") {
				(r.hasOwnProperty("entities") && r.entities.length) ? r.flag = true: r.flag = false;
				$("#list").html(_.template(loadHtml, r));
				common.pageFun(r.totalPage * r.pageSize, r.currentPage, r.pageSize, pageEventFun);
				common.leftHeightFun($(".nav-inner-left"), $(".nav-left"), $(".content-height"));
			} else if(r.resultCode == "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.msg,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		}

		function commonFun() {
			common.postData(hosConfigListUrl, requestData, updateCallbackFun, true, false);
		}

		common.postData(hosConfigListUrl, requestData, callback, true, false);

		function callback(r) {
			if(r.resultCode == "0000") {
				r.nav = nav;
				(r.hasOwnProperty("entities") && r.entities.length) ? r.flag = true: r.flag = false;
				appView.html(_.template(header));
				$("#right-container").html(_.template(tpl, r));
				$(".secondary-title").eq(1).addClass("secondary-active").siblings().removeClass("secondary-active");
				common.pageFun(r.totalPage * r.pageSize, r.currentPage, r.pageSize, pageEventFun);
				common.leftHeightFun($(".nav-inner-left"), $(".nav-left"), $(".content-height"));
				eventBind();
				common.postData(hospitalListUrl, null, function(p) {
					if(p.resultCode == "0000") {
						var selectDom = $("#status-select"),
							str = null;
						$.each(p.list, function(key, value) {
							str == null ? str = '<option value="' + value.id + '">' + value.name + '</option>' : str += '<option value="' + value.id + '">' + value.name + '</option>';
						});
						selectDom.append(str);

					} else if(p.resultCode == "1001") {
						common.getOutFun();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: p.msg,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				}, true, false);
			} else if(r.resultCode == "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.msg,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		}

		function eventBind() {
			//医院搜索
			$("#status-select").unbind().bind("change", function() {
				requestData = {
					pageSize: pageSize,
					currentPage: currentPage
				};
				$.trim($(this).val()) == "all" ? null : requestData.orgid = parseInt($.trim($(this).val()));
				$("#search-value").val(null);
				commonFun();
			});

			//btn搜索功能
			$(".search-btn").bind("click", function() {
				var search = $(".search-input").val().trim();
				requestData = {
					pageSize: pageSize,
					currentPage: currentPage,
					queryString: search
				};
				$.trim($("#status-select").val()) == "all" ? null : requestData.orgid = parseInt($.trim($("#status-select").val()));
				commonFun();
			});
			$("#search-value").keydown(function(e) {
				if(e.keyCode == 13) {
					$(".search-btn").click()
				}
			});

			//启用、禁用
			$("#list").unbind().on("click", ".hospital-config-enabled", function() {
				var dataFlag = $(this).attr("data-flag"),
					dataId = $(this).attr("data-id"),
					status = (dataFlag === "true" ? 0 : 1);
				common.postData(hospitalEnable + "/" + dataId + "/" + status, null, function(d) {
					if(d.resultCode == "0000") {
						dialog({
							title: '提示',
							modal: true,
							content: '操作成功',
							ok: function() {
								commonFun();
							},
							cancel: false,
						}).width(320).show();

					} else if(d.resultCode == "1001") {
						common.getOutFun();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: d.msg,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}

				}, true, false);

			});

			//首页和末页
			$(".endpoint").bind("click", function() {
				switch($(this).text()) {
					case "首页":
						$("#pagination .prev").next().click()
						break;
					case "尾页":
						$("#pagination .next").prev().click()
						break;
				}
			});

		}
	};
	return controller;
});