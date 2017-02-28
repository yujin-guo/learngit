define(['text!module/import/import.html','css!module/import/style/import.css'],function(tpl){
	var controller=function(){	
		appView.html(_.template(tpl));	
		eventBind();
		function eventBind(){
			$(".import-choose-btn").bind("click",function(){
				$(".import-file-upload").click();
			})
			$(".import-file-upload").change(function(){
				var txt=$(this).val();
				$(".import-choose-btn").text(txt)
			})
			//文件提交
			$(".import-btn").bind("click",function(){
				var url;
				var callback=function(r){
					if(r.code=="0000"){
						url=r.url;
						window.location.href="#importconfirm?path="+encodeURIComponent(url);
					}else{
						dialog({
							title:"提示",
							content:r.message,
							modal:true,
							ok:function(){},
							cancel:false
						}).width(320).show();
					}
				};
				common.fileUpload("form",callback);
			})
		}
	}
	return controller;
});