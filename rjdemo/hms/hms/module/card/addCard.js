define(['text!module/card/addCard.html', 'text!module/card/header.html', 'text!module/card/nav.html', 'js/libs/jquery.validate.min', 'css!module/my/style/my.css?', 'css!module/card/style/card.css?'], function(tpl, header, nav) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		$('#right-container').html(_.template(nav));
		
		var keyFlag = common.getQueryString("key");
		var id = parseInt(common.getQueryString("id"));
		var editCardData = {
			id: id
		};

		//回调函数
		var callbackCardFun = function(datas) {
			if(datas.code === "0000") {
				datas.flag = keyFlag;

				//模块内容
				$('#right-container').append(_.template(tpl, datas));

				$("#card-form").validate({
					rules: {
						cardno: {
							required: true,
							maxlength: 50

						},
						cardname: {
							required: true,
							maxlength: 8
						}
					},
					messages: {
						cardno: {
							required: "此项为必填项",
							maxlength: "请输入少于50个字符"
						},
						cardname: {
							required: "此项为必填项",
							maxlength: "请输入少于8个字符"
						}
					},
					submitHandler: function() {
						var callbackFun = function(datas) {
							if(datas.code == "0000") {
								window.history.back();
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
						switch(keyFlag) {
							case "addCard":
								var addCardData = {
									cardNo: $.trim($("#cardno").val()),
									name: $.trim($("#cardname").val()),
									departmentId: id
								};

								common.postData(testUrl + urls.allUrls.addCard, addCardData, callbackFun, true);
								break;
							case "editCard":
								var updateCardData = {
									departmentId: datas.departmentId,
									cardNo: $.trim($("#cardno").val()),
									name: $.trim($("#cardname").val()),
									id:datas.id
								};
								common.postData(testUrl + urls.allUrls.addCard, updateCardData, callbackFun, true);
								break;
							default:
								return false;
						}

					}
				});

			}
		};

		//判断新增/编辑角色
		switch(keyFlag) {
			case "addCard":
				var datas = {
					code: "0000"
				};
				//模块内容
				callbackCardFun(datas);
				break;
			case "editCard":
				common.postData(testUrl + urls.allUrls.cardDetail, editCardData, callbackCardFun, true);
				break;
			default:
				return false;
		}

	};
	return controller;
});