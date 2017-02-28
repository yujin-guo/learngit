/*create by lijinhua*/
define(function(){
	var supplie=function(){
		
		//供应商店铺导航
		$(".supplie-nav a").bind("click",function(){
			$(".supplie-nav a").attr("class","");
			$(this).attr("class","supplie-active");
		});
		//供应商店铺商品分类操作
		$(".classify-hide").hide();
		var classifyC=$(".classify-control");
		classifyC.attr("flag","true");
		classifyC.bind("click",function(){
			if($(this).attr("flag")=="true"){
				$(this).children(".triangle01").css("background-position","-233px -569px")
				$(this).next(".classify-hide").show();
				$(this).attr("flag","false");
			}else{
				$(this).children(".triangle01").css("background-position","-139px -569px")
				$(this).next(".classify-hide").hide();
				$(this).attr("flag","true");
			}
		});
	}
	return supplie;
});