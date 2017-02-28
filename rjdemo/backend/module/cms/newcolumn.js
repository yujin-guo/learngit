define(['text!module/cms/newcolumn.html', 'text!module/cms/header.html', 'text!module/cms/common_nav.html', 'js/libs/jquery.validate.min', 'css!module/cms/style/cms.css'], function(tpl, header, nav) {
	var controller = function() {
		/*userPermissions = JSON.parse($.cookie("permissions"));*/
		appView.html(_.template(header));
		$('#right-container').html(nav + tpl);
		var key = common.getQueryString("key");
        var parentId="";
	//	var noticeId = common.getQueryString("id");
    
        $(".secondary-title").removeClass("secondary-active");
        $(".secondary-title").eq(1).addClass("secondary-active");

        //获取上级栏目列表
		var getColumnListCallback = function(r) {
			if(r.resultCode == "0000") {
				var columnStr = '<%_.each(volist,function(v){%><option value="<%=v.dto.id%>"><%=v.dto.columnName%></option><% if(v.size!=0) {_.each(v.list,function(L){%><option value="<%= L.column.id %>">&nbsp;&nbsp;&nbsp;&nbsp;<%= L.column.columnName %></option><%})}})%>';
				$("#right-select").html(_.template(columnStr, r));
				
				//编辑栏目
				if(key != "add") {
					var data = null;
					var callback = function(r) {
						if(r.resultCode == "0000") {
							parentId=r.parentId;
							$('#columnName').val(r.columnName);
		                    $('#sort').val(r.sort);
		                    if(parentId!=null){
		                    	$("#right-select").val(parentId);
		                       /*var options= $("#right-select option");
		                       options.each(function(){
			                       	if($(this).text()==r.columnName){
			                       		$(this).attr("selected",true)
			                       	}
		                       })*/
		                       // $('#right-select').attr("disabled","false");    
		                    }
						}
					}
					common.postData(cmsUrl + urls.allUrls.columnDetail + key, data, callback, true);
				}
			}
		}
		common.postData(cmsUrl + urls.allUrls.getColumnList, {}, getColumnListCallback, true);

		

		$("#my-form").validate({
			submitHandler: function() {
                var key = common.getQueryString("key");
                var column_name=$('#columnName').val();
                if(column_name==""){
                    dialog({
                        title: '提示',
                        modal: true,
                        content: "栏目名不能为空。",
                        ok: function() {},
                        cancel: false
                    }).width(320).show(); 
                }else{
                    var editData={
                        id:key,
                        columnName: $('#columnName').val(),
                        parentId:$('#right-select option:selected').val(),
                        sort: $('#sort').val()
                    }
                    var data = {
                        columnName: $('#columnName').val(),
                        parentId:$('#right-select option:selected').val(),
                        sort: $('#sort').val()
                    };
                    var callback = function(datas) {
                        if(datas.resultCode == "0000") {
                            window.location.href = "#column?key=column";
                        } else if(datas.resultCode == "0002") {
                            $("#old-pass").nextAll(".error-span").html("<label class='error'>" + datas.msg + "</label>");
                        } else {
                            dialog({
                                title: '提示',
                                modal: true,
                                content: datas.msg,
                                ok: function() {},
                                cancel: false
                            }).width(320).show();
                        }
                    };

                    if(key == "add") {
                        common.postData(cmsUrl + urls.allUrls.columnAdd, data, callback, true);
                    } else {
                        common.postData(cmsUrl + urls.allUrls.updateColumn, editData, callback, true);
                    }    
                }                
			}
		});
	};
	return controller;
});
