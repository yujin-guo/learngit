define(['text!module/bid_list/newBidSecond.html', 'css!module/bid_list/style/newBid.css'], function(tpl) {
	var controller = function() {
		$('#right-container').html(tpl);
		var bidId = common.getQueryString("id");
		var depId = common.getQueryString("deptId");
		var fileId = "";

		var orgId = JSON.parse($.cookie("orgId"));
		$("input[name='orgId']").val(orgId);
		$("input[name='depId']").val(depId);
		//上传附件
		var uploadcallback = function(datas) {
			if(datas.resultCode == "0000") {
				$('.bid-haven-upload').text(datas.fileName).css({border:"1px solid #00ac8f",marginRight:"10px",padding:"0px 5px",paddingRight:"30px"});
				fileId = datas.id;
				$("#fujian").text("上传成功");
                $(".bid-haven-upload").show();
                $(".bid-upload-cancel-img").show();
                $(".bid-upload-cancel-img").bind("click",function(){
                    $(this).hide();
                    $(".bid-haven-upload").hide();
                    $("#fujian").text("上传附件");            
                });
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
		$("#fujian").unbind().bind("click", function() {
			$(".file-upload").click();
		});
		$(".file-upload").change(function() {
			common.UploadFile("form", uploadcallback);
		});
		var requestData = {
			id: bidId
		};

		var addCallback = function(datas) {
			if(datas.resultCode == "0000") {
				window.location.reload();
			} else if(datas.resultCode == "1001") {
				common.getOutFun();
			}
		};
		var submitCheckCallback = function(datas) {
			if(datas.resultCode == "0000") {
				window.location.href = "#newbidthird?id=" + bidId;
			}
		};
		var delCheckCallback = function(datas) {
			if(datas.resultCode == "0000") {
				dialog({
					title: '提示',
					modal: true,
					content: "删除商品成功",
					ok: function() {
						window.location.reload();
					},
					cancel: false
				}).width(320).show();
			}
		};
		var productCallback = function(datas) {
			if(fileId == "") {
				fileId = datas.fileId;
			}
			if(datas.resultCode == "0000") {
				$('#list-content').hide();
				$('.bid-content').show();
				$("input[name='orgId']").val(orgId);
				$("input[name='depId']").val(depId);
				$('#p_name').val(datas.itemName);
				$('#p_num').val(datas.count);
				$("#p_special").val(datas.specifications);
				$('#brand_name').val(datas.brand);
				$('#pro_num').val(datas.itemNo);
				$('#bid-beizhu').val(datas.information);
				if(datas.fileName != "") {
					$('.bid-haven-upload').text(datas.fileName);
                    $('.bid-haven-upload').text(datas.fileName).css({border:"1px solid #00ac8f",marginRight:"10px",padding:"0px 5px",paddingRight:"30px"});
                    $('.bid-haven-upload,.bid-upload-cancel-img').show();
                    $(".bid-upload-cancel-img").bind("click",function(){
                        $(this).hide();
                        $(".bid-haven-upload").hide();
                        $("#fujian").text("上传附件");            
                    });
				}
				$('.bid-back-btn').bind("click", function() {
					window.location.href = "#newbit?id=" + bidId;
				});
				$('.bid-save-product').unbind().bind("click", function() {
                    if($(".bid-upload-cancel-img").css("display")=="none"){
                        var editProductData = {
                            id: datas.id,
                            procurementId: bidId,
                            itemName: $.trim($('#p_name').val()),
                            count: $.trim($('#p_num').val()),
                            brand: $.trim($('#brand_name').val()),
                            itemNo: $.trim($('#pro_num').val()),
                            information: $.trim($('#bid-beizhu').val()),
                            specifications: $.trim($('#p_special').val())
                        };        
                    }else{
                        var editProductData = {
                            id: datas.id,
                            procurementId: bidId,
                            itemName: $.trim($('#p_name').val()),
                            count: $.trim($('#p_num').val()),
                            brand: $.trim($('#brand_name').val()),
                            itemNo: $.trim($('#pro_num').val()),
                            information: $.trim($('#bid-beizhu').val()),
                            fileUrl: fileId,
                            specifications: $.trim($('#p_special').val())
                        };       
                    }
					common.postData(bidUrl + urls.allUrls.bidaddOrUpdateItem, editProductData, addCallback, true);
				});
				$("#fujian").unbind().bind("click", function() {
					$(".file-upload").click();
				});
				$(".file-upload").change(function() {
					common.UploadFile("form", uploadcallback);
				});
			}
		};
		var checkCallback = function(datas) {
			if(datas.resultCode == "0000") {
				//无商品时
				if(datas.results.length == "0") {
					$('.bid-save-product').bind("click", bidSave);
					$('.bid-back-btn').bind("click", function() {
						window.location.href = "#newbit?id=" + bidId;
					});
				}
				//有商品时
				else {
					$("#right-container").html(_.template(tpl, datas));
					$('.bid-content').hide();
					$('#list-content').show();
					common.wordlimitFun("cname",24);
					//删除商品
					$('.del_product').bind("click", function() {
						var delData = {
							id: $(this).attr("data-id")
						}
						common.postData(bidUrl + urls.allUrls.delBid, delData, delCheckCallback, true);
					});
					//查看商品
					$('.check_product').bind("click", function() {
						var productData = {
							id: $(this).attr("data-id")
						}
						common.postData(bidUrl + urls.allUrls.getItemInfo, productData, productCallback, true);
					});
					//继续添加商品
					$(".bid-add-product").bind("click", function() {
						$('#list-content').hide();
						$('.bid-content').show();
						$("input[name='orgId']").val(orgId);
						$("input[name='depId']").val(depId);
						$("#fujian").unbind().bind("click", function() {
							$(".file-upload").click();
						});
						$(".file-upload").change(function() {
							common.UploadFile("form", uploadcallback);
						});
						$('.bid-back-btn').bind("click", function() {
							window.location.href = "#newbit?id=" + bidId;
						});
						$('.bid-save-product').bind("click", bidSave);
					});
					//提交初审
					$(".bid-check").bind("click", function() {
						common.postData(bidUrl + urls.allUrls.submitBid + bidId, requestData, submitCheckCallback, true);
					});
					//返回上一步
					$(".bid-have-product").bind("click", function() {
						window.history.go(-1);
					});
				}
			}
		};
		var bidSave = function() {
            if($(".bid-upload-cancel-img").css("display")=="none"){
                var addProductData = {
                    procurementId: bidId,
                    itemName: $.trim($('#p_name').val()),
                    count: $.trim($('#p_num').val()),
                    brand: $.trim($('#brand_name').val()),
                    itemNo: $.trim($('#pro_num').val()),
                    information: $.trim($('#bid-beizhu').val()),
                    specifications: $.trim($('#p_special').val())
                };      
            }else{
                var addProductData = {
                    procurementId: bidId,
                    itemName: $.trim($('#p_name').val()),
                    count: $.trim($('#p_num').val()),
                    brand: $.trim($('#brand_name').val()),
                    itemNo: $.trim($('#pro_num').val()),
                    information: $.trim($('#bid-beizhu').val()),
                    fileUrl: fileId,
                    specifications: $.trim($('#p_special').val())
                };    
            }
			if($('#p_name').val() == '' || $('#p_num').val() == '') {
				dialog({
					title: '提示',
					modal: true,
					content: "请填写商品名称或采购数量",
					ok: function() {},
					cancel: false
				}).width(320).show();
			} else {
				common.postData(bidUrl + urls.allUrls.bidaddOrUpdateItem, addProductData, addCallback, true);
			}

		};
		common.postData(bidUrl + urls.allUrls.getBid, requestData, checkCallback, true);
		common.tabFocus("新建竞价");
	}
	return controller;
});