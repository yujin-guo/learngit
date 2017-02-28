define(['js/libs/jquery.validate.min'], function(validate) {
	var controller = function() {
		var departmentId = common.getQueryString("departmentId");
		$("#add-member-form").validate({
			rules: {
				member: {
					required: true,
					minlength: 1
				},
				roles: {
					required: true,
					minlength: 1
				}
			},
			messages: {
				member: {
					required: "必须选择其中一个",
					minlength: "必须选择其中一个"
				},
				roles: {
					required: "必须选择其中一个",
					minlength: "必须选择其中一个"
				}
			},
			errorPlacement: function(error, element) {
				if($(element).hasClass("member-checkbox")) {
					$(".member-error-div").html($(error));
				} else if($(element).hasClass("roles-checkbox")) {
					$(".roles-error-div").html($(error));
				}
			},
			submitHandler: function() {
				var memberInput = $(".add-member-info-wrap input:checked");
				var rolesInput = $(".role-span input:checked");
				var dataSubmit = [];
				for(var x = 0; x < memberInput.length; x++) {
					for(var y = 0; y < rolesInput.length; y++) {
						var obj = {
							"userId": parseInt($(memberInput[x]).val()),
							"roleId": parseInt($(rolesInput[y]).val())
						}
						dataSubmit.push(obj);
						continue;
					}
				}
				
				//新增成员数据
				var addMemberData = {
					id: departmentId,
					assignments: dataSubmit,
					append: false
				};

				var callbackApp = function(datasA) {
					if(datasA.code == "0000") {
						window.history.back();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: datasA.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				};
				common.postData(testUrl + urls.allUrls.addDepMember, addMemberData, callbackApp, true);
			}
		});
	};
	return controller;
});