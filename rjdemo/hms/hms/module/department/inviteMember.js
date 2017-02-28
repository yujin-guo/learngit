define(['text!module/department/inviteMember.html', 'text!module/department/header.html', 'text!module/department/nav.html', 'css!module/department/style/department.css?'], function(tpl, header, nav) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		$('#right-container').html(_.template(nav));
		var departmentId=common.getQueryString("departmentId");
		var data={
			nav:nav
		};
		$('#right-container').append(_.template(tpl,data));

		$(".save-value").on("click", function() {
			var emails = $(".invite-textarea").val();
			var hh = emails.split("\n");
			
			var data={
				emails:hh,
				departmentId:departmentId
			};
			function callbackFun(datas){
				if(datas.code=="0000"){
					window.location.href="#inviteSuccess";
				}else{
					dialog({
                        title: '提示',
                        modal: true,
                        content: datas.message,
                        ok: function() {},
                        cancel: false,
                    }).width(320).show();
				}
			}
			common.postData(testUrl + urls.allUrls.inviteEmial, data, callbackFun, true);
		});
	};
	return controller;
});