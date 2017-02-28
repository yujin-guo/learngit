define(['text!module/department/inviteSuccess.html', 'text!module/department/header.html', 'text!module/department/nav.html','css!module/department/style/department.css?'], function(tpl, header, nav) {
	var controller = function() {
		userPermissions=JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		$('#right-container').html(_.template(nav));
		$('#right-container').append(tpl);
	};
	return controller;
});