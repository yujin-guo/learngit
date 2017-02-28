define(['text!module/sms/test.html'], function(tpl) {
	var controller = function() {
		appView.html(_.template(tpl));

		
	};
	return controller;
});