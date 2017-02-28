define(['text!module/cms/new.html', 'text!module/cms/header.html', 'text!module/cms/common_nav.html', 'js/libs/jquery.validate.min', 'css!module/cms/style/cms.css','ckeditor/ckeditor.js'], function(tpl, header, nav) {
	var controller = function() {
		appView.html(_.template(header));
		$('#right-container').html(nav + tpl);
		var key = common.getQueryString("key");
		var editor;
		var contentId = "";
		//	var noticeId = common.getQueryString("id");

		//获取上级栏目列表
		var getColumnListCallback = function(r) {
			if(r.resultCode == "0000") {
				var columnStr = '<%_.each(volist,function(v){%><option value="<%=v.dto.id%>"><%=v.dto.columnName%></option><% if(v.size!=0) {_.each(v.list,function(L){%><option value="<%= L.column.id %>">&nbsp;&nbsp;&nbsp;&nbsp;<%= L.column.columnName %></option><% if(L.size!=0) {_.each(L.list,function(r){%><option value="<%= r.id %>">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<%= r.columnName %></option><%})}})}})%>';
				$("#cms-new-select").html(_.template(columnStr, r));
				editor=CKEDITOR.replace("cms-new-textarea");
				//编辑公告
				if(key != "add") {
					var data = null;
					var callback = function(data) {
						contentId = data.contentId;
						if(data.resultCode == "0000") {
							$('#title').val(data.title);
							var options=$('.cms-new-select option');
							options.each(function(){
								if($(this).text().trim()==data.columnName){
		                       		$(this).attr("selected",true)
		                       	}
							})
							setTimeout(function(){
								editor.setData(data.content);
							},500)
						}
					}
					common.postData(cmsUrl + urls.allUrls.noticeDetail + key, data, callback, true);
				}
			}
		}
		common.postData(cmsUrl + urls.allUrls.getColumnList, {}, getColumnListCallback, true);

		

		$("#my-form").validate({
			rules: {
				title: {
					required: true
				},
				content: {
					required: true
				}
			},
			messages: {
				title: {
					required: null
				},
				content: {
					required: null
				}
			},
			submitHandler: function() {
				var key = common.getQueryString("key");
				var editData = {
					id: key,
					title: $('#title').val(),
					contentId: contentId,
					columnId: $('.cms-new-select option:selected').val(),
					status: parseInt($("input:checked").val()),
					content: editor.getData()
				}
				var data = {
					title: $('#title').val(),
					columnId: $('.cms-new-select option:selected').val(),
					status: parseInt($("input:checked").val()),
					content: editor.getData()
				};
				var callback = function(datas) {
					if(datas.resultCode == "0000") {
						window.location.href = "#cms?key=cont";
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
					common.postData(cmsUrl + urls.allUrls.newNotice, data, callback, true);
				} else {
					//		data.id = noticeId;
					common.postData(cmsUrl + urls.allUrls.updateNotice, editData, callback, true);
				}

			}
		});
	};
	return controller;
});