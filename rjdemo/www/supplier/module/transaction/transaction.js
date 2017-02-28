define(function() {
	var controller = function() {

		//交易管理“更多”
		$(".more-content").attr("flag", "true").hide();
		$(".transaction-header-more").click(function() {
			if($(".more-content").attr("flag") == "true") {
				$(this).text("收起").nextAll(".direction-icon").css("background-position", "-343px -29px");
				$(".more-content").attr("flag", "false").show();
			} else {
				$(this).text("更多").nextAll(".direction-icon").css("background-position", "-300px -29px");
				$(".more-content").attr("flag", "true").hide();
			}
		});

		$(".reason-control input[type='button'],.cancel-address").click(function() {
			$(this).parents(".info-content-inner").find("img,.del-pic").remove();
			$("#refuse-textarea").val(null);
			//$(this).parents(".info-content-inner").find(".file-upload").prop('outerHTML', '<input class="file-upload" type="file" multiple="multiple" />');
			$(".info-wrap").removeClass("show");
		});

		$(".info-wrap").on("click", ".del-pic", function() {
			$(this).prev("img").remove();
			$(this).remove();
			//$(this).parents(".info-content-inner").find(".file-upload").prop('outerHTML', '<input class="file-upload" type="file" multiple="multiple" />');
		});

		//上传图片
		$(".pic").on("change", ".file-upload", function() {
			//图片格式判断
			if(!/image\/\w+/.test(this.files[0].type)) {
				dialog({
					title: '提示',
					modal: true,
					content: "请上传jpg/png/jpeg格式的图片。",
					ok: function() {},
					cancel: false,
				}).width(320).show();
				return false;
			};
			//图片大小判断
			if(this.files[0].size / 1024 / 1024 > 10) {
				dialog({
					title: '提示',
					modal: true,
					content: "文件大小超过10M，请重新上传。",
					ok: function() {},
					cancel: false,
				}).width(320).show();
				this.value = "";
				return false;
			}
			common.fileUpload("return-form", callbackPic);

			function callbackPic(datas) {
				//var datas = JSON.parse(datas);
				var str = '<img src="' + datas.url + '" /><span class="del-pic">X</span>';
				$(".refuse-pic-select").append(str);
			}
		});
		/*$(".pic").on("change", ".file-upload", function() {
			if(typeof FileReader == 'undefined') {
                dialog({
                    title: '提示',
                    modal: true,
                    content: "对不起，您的浏览器不支持filereader对象",
                    ok: function() {},
                    cancel: false,
                }).width(320).show();
				
			} else {
				var files = this.files;
				if(!/image\/\w+/.test(files[0].type)) {
					dialog({
						title: '提示',
						modal: true,
						content: "请确保文件类型为图像",
						ok: function() {},
						cancel: false,
					}).width(320).show();
					return false;
				}
				var reader = new FileReader();
				//将文件以data  url形式进入页面
				reader.readAsDataURL(files[0]);
				if($(this).parent().attr("class") == "pic-select") {
					reader.onload = function() { //文件读取成功完成时触发
						$(".pic-select").append('<img src="' + this.result + '" /><span class="del-pic">X</span>');
						$(".pic").append(' <span class="pic-select">'+
							'+<input class="file-upload" type="file" multiple="multiple" />'+
							'<div class="pic-select-desc">选择图片</div></span>');
					}
				} else {
					reader.onload = function() { //文件读取成功完成时触发
						$(".refuse-pic-select").append('<img src="' + this.result + '" /><span class="del-pic">X</span>');
					}
				}
			}
		});*/

	};
	return controller;
});