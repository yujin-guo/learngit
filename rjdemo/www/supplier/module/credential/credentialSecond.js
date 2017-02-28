define(['text!module/credential/credentialSecond.html', 'js/libs/area', 'css!module/credential/style/credential.css?'], function(tpl, area) {
	var controller = function() {
		var versionFlag = common.getQueryString("key");
		var accreditationInfoUrl = baseUrl + urls.allUrls.getAccreditationInfo;
		appView.html(tpl);

		common.tabFocus("资质认证");
		_init_area();

		/* 图片上传的回调函数 */
		var logocallback = function(data) {
			//var newdata = JSON.parse(data);
			var newdata = data;
			$("#logofile").css("background-image", "url('" + newdata.url + "')");
			$("#logofile").css("background-size", "102px 102px");
			$("#logofile p").hide();
			if($("#logofile .credential-close-photo").length == 0) {
				$("#logofile").append('<span class="credential-close-photo">X</span>');
				$(".credential-close-photo").bind("click", function(e) {
					$("#logofile").css("background", "none");
					$(this).remove();
					$("#logofile p").show();
					e.stopPropagation();
				})
			}
		};
		var licencecallback = function(data) {
			//var newdata = JSON.parse(data);
			var newdata = data;
			$("#licencefile").css("background-image", "url('" + newdata.url + "')");
			$("#licencefile").css("background-size", "102px 102px");
			$("#licencefile p").hide();
			if($("#licencefile .credential-close-photo").length == 0) {
				$("#licencefile").append('<span class="credential-close-photo">X</span>');
				$(".credential-close-photo").bind("click", function(e) {
					$("#licencefile").css("background", "none");
					$(this).remove();
					$("#licencefile p").show();
					e.stopPropagation();
				})
			}
		};
		var orgcallback = function(data) {
			//var newdata = JSON.parse(data);
			var newdata = data;
			$("#orgfile").css("background-image", "url('" + newdata.url + "')");
			$("#orgfile").css("background-size", "102px 102px");
			$("#orgfile p").hide();
			if($("#orgfile .credential-close-photo").length == 0) {
				$("#orgfile").append('<span class="credential-close-photo">X</span>');
				$(".credential-close-photo").bind("click", function(e) {
					$("#orgfile").css("background", "none");
					$(this).remove();
					$("#orgfile p").show();
					e.stopPropagation();
				})
			}
		};
		/* 三证合一和非三证合一页面元素的转换 */
		$(".version-same").bind("click", function() {
			$("#reg,#organize,#codefile").hide();
			$("#service").show();
		});
		$(".version-non").bind("click", function() {
			$("#service").hide();
			$("#reg,#organize,#codefile").show();
		});
		//企业logo图片提交
		$("#logofile").click(function() {
			$(".add-file-upload1").click();
		});
		$(".add-file-upload1").change(function() {
			//图片格式判断
			var picPath = $(this).val();
			if(/.+\.(jpeg|jpg|png||JPEG|JPG|PNG)$/.test(picPath) == false) {
				dialog({
					title: '提示',
					modal: true,
					content: "请上传jpg/png/jpeg格式的图片。",
					ok: function() {},
					cancel: false,
				}).width(320).show();
				return false;
			};
			common.fileUpload("form2", logocallback);
		});
		//工商营业执照图片提交
		$("#licencefile").click(function() {
			$(".add-file-upload").click();
		});
		$(".add-file-upload").change(function() {
			//图片格式判断
			var picPath = $(this).val();
			if(/.+\.(jpeg|jpg|png||JPEG|JPG|PNG)$/.test(picPath) == false) {
				dialog({
					title: '提示',
					modal: true,
					content: "请上传jpg/png/jpeg格式的图片。",
					ok: function() {},
					cancel: false,
				}).width(320).show();
				return false;
			};
			common.fileUpload("form", licencecallback);
		});
		//组织结构代码证图片提交
		$("#orgfile").click(function() {
			$(".add-file-upload2").click();
		});
		$(".add-file-upload2").change(function() {
			//图片格式判断
			var picPath = $(this).val();
			if(/.+\.(jpeg|jpg|png||JPEG|JPG|PNG)$/.test(picPath) == false) {
				dialog({
					title: '提示',
					modal: true,
					content: "请上传jpg/png/jpeg格式的图片。",
					ok: function() {},
					cancel: false,
				}).width(320).show();
				return false;
			};
			common.fileUpload("form1", orgcallback);
		});

		if(!versionFlag) {
			$("#s_province").val("广东省");
			change(1);
			$("#s_city").val("广州市");
			change(2);
			$("#s_county").val("市、县级市");
		} else {
			function callback(r) {
				if(r.code == "0000") {
					/*地址*/
					r.hasOwnProperty('province')?(function(){
						$("#s_province").val(r.province);
						change(1);
					})():(function(){
						$("#s_province").val("广东省");
						change(1);
					})();
					r.hasOwnProperty('city')?(function(){
						$("#s_city").val(r.city);
						change(2);
					})():(function(){
						$("#s_city").val("广州市");
						change(2);
					})();
					r.hasOwnProperty('district')?(function(){
						$("#s_county").val(r.district);
					})():(function(){
						$("#s_county").val("市、县级市");
					})();

					$(".c-credential-name").val(r.company);
					if(r.hasOwnProperty('legalPerson')) {
						$(".c-credential-person").val(r.legalPerson);
					}
					if(r.hasOwnProperty('address')) {
						$(".c-credential-address").val(r.address);
					}
					if(r.hasOwnProperty('mobile')) {
						$(".c-credential-phone").val(r.mobile);
					}
					if(r.unify == false) {
						$(".version-non").click();
						if(r.hasOwnProperty('regNumber')) {
							$(".c-credential-reg").val(r.regNumber);
						}
						if(r.hasOwnProperty('orgCode')) {
							$(".c-credential-organize").val(r.orgCode);
						}

					} else {
						$(".version-same").click();
						if(r.hasOwnProperty('unifyCode')) {
							$(".c-credential-service").val(r.unifyCode);
						}
					}

				} else if(r.code == "1020") {
					common.getOutFun();
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: r.message,
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}
			}
			common.postData(accreditationInfoUrl, {}, callback, true);
		}

		/* 提交审核 */
		$(".c-credential-submit").bind("click", function() {
			var val = $('input:radio[name="c-credential-version"]:checked').val();
			if(val == "三证合一") {
				var credentialData = {
					"unify": true,
					"company": $(".c-credential-name").val(),
					"legalPerson": $(".c-credential-person").val(),
					"unifyCode": $(".c-credential-service").val(),
					"address": $(".c-credential-address").val(),
					"province":$("#s_province").val(),
					"city":$("#s_city").val(),
					"district":$("#s_county").val(),
					"mobile": $(".c-credential-phone").val(),
					"licensePic": $("#licencefile").css("backgroundImage").replace(/"/g, "").slice(4, -1),
					"logo": $("#logofile").css("backgroundImage").replace(/"/g, "").slice(4, -1)
				};
				var callbacksame = function(datas) {
					if(datas.code == "0000") {
						window.location.href = "#credentialThird";
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: datas.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				};
				if($(".c-credential-name").val() == "" || $(".c-credential-person").val() == "" || $(".c-credential-service").val() == "" || $(".c-credential-address").val() == "" || $(".c-credential-phone").val() == "" || $("#licencefile").css("backgroundImage").substring(4) == "" || $("#logofile").css("backgroundImage").substring(4) == '') {
					dialog({
						title: '提示',
						modal: true,
						content: "请补全信息",
						ok: function() {},
						cancel: false,
					}).width(320).show();
				} else {
					common.postData(baseUrl + "/api/user/accreditationApp", credentialData, callbacksame, true);
				}
			} else if(val == "非三证合一") {
				var detailData = {
					"unify": false,
					"company": $(".c-credential-name").val(),
					"legalPerson": $(".c-credential-person").val(),
					"regNumber": $(".c-credential-reg").val(),
					"orgCode": $(".c-credential-organize").val(),
					"address": $(".c-credential-address").val(),
					"province":$("#s_province").val(),
					"city":$("#s_city").val(),
					"district":$("#s_county").val(),
					"mobile": $(".c-credential-phone").val(),
					"logo": $("#logofile").css("backgroundImage").replace(/"/g, "").slice(4, -1),
					"licensePic": $("#licencefile").css("backgroundImage").replace(/"/g, "").slice(4, -1),
					"orgCodePic": $("#orgfile").css("backgroundImage").replace(/"/g, "").slice(4, -1)
				};
				var callbackHosFun = function(datas) {
					if(datas.code == "0000") {
						window.location.href = "#credentialThird";
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: datas.message,
							ok: function() {},
							cancel: false
						}).width(320).show();
					}
				};
				if($(".c-credential-name").val() == "" || $(".c-credential-person").val() == "" || $(".c-credential-reg").val() == "" || $(".c-credential-organize").val() == "" || $(".c-credential-address").val() == "" || $(".c-credential-phone").val() == "" || $("#logofile").css("backgroundImage").substring(4) == '' || $("#licencefile").css("backgroundImage").substring(4) == "" || $("#orgfile").css("backgroundImage").substring(4) == "") {
					dialog({
						title: '提示',
						modal: true,
						content: "请补全信息",
						ok: function() {},
						cancel: false,
					}).width(320).show();
				} else {
					common.postData(baseUrl + "/api/user/accreditationApp", detailData, callbackHosFun, true);
				}
			}
		});
	}
	return controller;
});