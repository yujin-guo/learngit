/*create by lijinhua*/
define(['text!module/validateSupp/mobile.html', 'module/validateSupp/mv', 'text!module/header/nav.html', 'css!module/validateSupp/style/procurment.css', 'css!module/validateSupp/style/provider.css'], function(tpl, deal, nav) {
	var controller = function() {
		appView.html(nav + tpl);
		deal();

		//时时监听高亮提交按钮
		$('.common').on('input', function() {
			var inputL = $(".common");
			var num = 0;
			//console.log(inputL[1])
			for(var i = 0; i < inputL.length; i++) {
				if(!$(inputL[i]).val()) {
					num++;
				}
			}
			if(num === 0) {
				$("#confirm").addClass("active-input").removeAttr("disabled");

			} else {
				$("#confirm").removeClass("active-input").prop("disabled", true);;
			}
		});

		//for ie
		if(document.all) {
			$('.common').each(function() {
				var that = this;
				if(this.attachEvent) {
					this.attachEvent('onpropertychange', function(e) {
						if(e.propertyName != 'value') return;
						$(that).trigger('input');
					});
				}
			})
		}
	};
	return controller;
});