define(['text!module/approval/approvalDetails.html', 'text!module/approval/header.html', 'text!module/approval/common_nav.html', 'css!module/approval/style/supplyDetails.css'], function(tpl, header, nav) {
	var controller = function(id) {
		appView.html(_.template(header));
		var url = omsUrl + urls.allUrls.accreditationInfo; //供应商详情
		var callback = function(r) {
			if(r.resultCode == "0000") {
				if(r.licensePic == undefined) {
					r.licensePic == null;
				}
				r.nav = nav;
				$("#right-container").html(_.template(tpl, r));
				eventBind(r.suppacc.accid);
			} else if(r.resultCode == "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.msg,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		}
		common.postData(url + "/" + id, null, callback, true,false)

		function eventBind(addid) {
			//返回上一级
			$(".supply-details-back").bind("click", function() {
				window.location.href = "#approval";
			})
			window.scrollTo(0, 0);

			//子导航 跳转
			$(".secondary-title").bind("click", function() {
					var index = $(this).index()
					window.location.href = "#approval?index=" + index
				})
				//提交审核
			var updateUrl = omsUrl + urls.allUrls.accreditationApprove;
			$(".supply-details-submit").bind("click", function() {
				var chksupplyPass = document.getElementById("supplyPass");
				var chksupplyRejected = document.getElementById("supplyRejected");
				if(chksupplyPass.checked) {
					var data = {
						id: addid,
						status: 1,
						opinion: $.trim($("#myCheck").val())
					};
					common.postData(updateUrl, data, callback, true,false);
				}
				if(chksupplyRejected.checked) {
					var data = {
						id: addid,
						status: 2,
						opinion: $.trim($("#myCheck").val())
					};
					if(!$.trim($("#myCheck").val())) {
						dialog({
							title: '提示',
							modal: true,
							content: "请填写驳回理由",
							ok: function() {},
							cancel: false
						}).width(320).show();
					} else {
						common.postData(updateUrl, data, callback, true,false);
					}
				}

				function callback(r) {
					if($("input:checked").val() == "1") {
						content = "审核通过";
					}
					if($("input:checked").val() == "2") {
						content = "审核驳回";
					}
					if(r.resultCode == "0000") {
						dialog({
							title: '提示',
							modal: true,
							content: content,
							ok: function() {
								window.location.reload();
							},
							cancel: false
						}).width(320).show();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: r.msg,
							ok: function() {

							},
							cancel: false
						}).width(320).show();
					}
				};
			})

		}
	};
	return controller;
});