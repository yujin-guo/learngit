define(['text!module/settleaccount/account.html', 'text!module/settleaccount/loadbalanceList.html', 'css!module/settleaccount/style/settleaccount.css'], function(tpl, loadPage) {
	var controller = function(index) {
		var url = common.serverBaseUrl + urls.allUrls.getStatement; //查询结算单
		var pageSize = 10;
		var requestData = {
			pageNo: 1,
			pageSize: pageSize,
			querySet: {
				status: 0
			}
		};
		var callback = function(r) {
			if(r.code == "0000") {
				var data = {
					data: r,
					s: reEncapsulate(r.orgs)
				}
				if(r.orgs != undefined && r.orgs.length) {
					data.flag = true;
				} else {
					data.flag = false;
				}
				appView.html(_.template(tpl, data));

				//页面隐藏
				if(data.flag == false) {
					$(".page-wrap").css("display", "none");
				} else {
					$(".page-wrap").css("display", "block");
				}

				common.pageFun(r.totalPages * pageSize, 1, pageSize, page);
				//获取医院列表
				var getOrgsUrl = common.serverBaseUrl + urls.allUrls.getOrgs; //获取医院列表
				var getOrgsCallback = function(r) {
					if(r.code == "0000") {
                        $(".balance-hospital").prepend("<option>全部医院</option>");
						var hospital_list = "";
						for(var i = 0, l = r.organizations.length; i < l; i++) {
							hospital_list += "<option data-id='" + r.organizations[i].id + "' data-org='" + r.organizations[i].organization + "'>" + r.organizations[i].organization + "</option>";
						}
						$(".balance-hospital").append(hospital_list);
						getDeptList();
					} else if(r.code == "1020") {
						common.getOutFun();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: r.message,
							ok: function() {},
							cancel: false
						}).width(320).show();
					}
				}
				common.postData(getOrgsUrl, {}, getOrgsCallback, true);
			} else if(r.code == "1020") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.message,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		};
		common.postData(url, requestData, callback, true);
		
		//对返回数据中孙逸仙医院数据重新封装，data为返回数据的orgs数组,封装后数据格式不变。
		function reEncapsulate(data){
			var newData=[];
		    var departments=[];
		    var hasDept=false;
		    for(var i=0;i<data.length;i++){
		        if(data[i].organization!=="中山大学附属第二医院"&&data[i].organization!=="中山大学孙逸仙纪念医院"){
		            newData.push(data[i]);
		        }else{
		            for(var j=0;j<data[i].statements.length;j++){
		                for(var k=0;k<departments.length;k++){
		                    if(data[i].statements[j].department==departments[k].department){
		                        departments[k].statements.push(data[i].statements[j]);
		                        hasDept=true;
		                        break;
		                    }
		                    hasDept=false;
		                }
		                if(!hasDept){
		                    var a={};
		                    a.department=data[i].statements[j].department;
		                    a.statements=[];
		                    a.statements.push(data[i].statements[j]);
		                    departments[departments.length]=a;
		                    hasDept=true;
		                }
		            }
		            for(var m=0;m<departments.length;m++){
		                var b={};
		                b.organization=data[i].organization;
		                b.statements=departments[m].statements;
		                newData.push(b);
		            } 
		        }
		    }
		    return newData;
		}
		
		/*
		 * 分页回调函数设置
		 * 
		 * */
		function page(pageIndex) {
			requestData.pageNo = pageIndex + 1;
			common.postData(url, requestData, updateCallback, true);
		}

		function updateCallback(r) {
			if(r.code == "0000") {
				var result = {
					data: r,
					s: reEncapsulate(r.orgs)
				}
				if(r.orgs != undefined && r.orgs.length) {
					result.flag = true;
				} else {
					result.flag = false;
				}
				$("#body-list").html(_.template(loadPage, result));
				$(".total-page-num").html(r.totalPages);

				//页面隐藏
				if(result.flag == false) {
					$(".page-wrap").css("display", "none");
				} else {
					$(".page-wrap").css("display", "block");
				}
				common.pageFun(r.totalPages * pageSize, requestData.pageNo, pageSize, page);
				checkedFun();

				window.scrollTo(0, 0);
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.message,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		}

		function getDeptList() {
			$(".balance-hospital").on("change", function() {
				//获取采购部门列表
				var getDeptUrl = common.serverBaseUrl + urls.allUrls.getPurchaseDepartments; //获取采购部门列表
				var orgId = $(this).children('option:selected').data('id');
				var orgName = $(this).children('option:selected').data('org');
				if($(this).val()=="全部医院"){
                    window.location.reload();
                }else{
                    var getDeptData={orgId:orgId};
                }
				var getDeptCallback = function(result) {
					if(result.code == "0000") {
						var dept_list = "";
						for(var i = 0, l = result.departments.length; i < l; i++) {
							dept_list += "<option data-id='" + result.departments[i].department + "'>" + result.departments[i].department + "</option>";
						}
						$(".balance-department").empty().html("<option>选择采购部门</option>"+dept_list);
						var updateHospitalData = {
							pageNo: 1,
							pageSize: 20,
							querySet: {
								purchaser: orgName,
								status: 0
							}
						};
						common.postData(url, updateHospitalData, updateCallback, true);
					} else if(result.code == "1020") {
						common.getOutFun();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: result.message,
							ok: function() {},
							cancel: false
						}).width(320).show();
					}
				}
				common.postData(getDeptUrl, getDeptData, getDeptCallback, true);
			})
			eventBind();
			checkedFun();
		}

		var totalMoney = 0; //待开票金额
		var preId = []; //待结算单id列表
		var preSettleMoney = function(index) {
			totalMoney = 0; //计算前清零
			$(".balance-item" + index + " .checked").each(function() {
				var itemMoney = parseFloat($(this).parents("td").siblings(".balance-kaipiao").text().trim().slice(1));
				totalMoney += itemMoney;
			});
			var $presettle = $(this).parents(".balance-listgroup").find(".forbilling-money-amount"); //待开票金额
			var submitbtn = $(this).parents(".balance-listgroup").find(".balance-listgroup-collect-btn"); //生成汇总单按钮
			//待结算金额为零则隐藏
			$presettle.text("￥" + totalMoney.toFixed(2));
			if(totalMoney > 0) {
				$presettle.parent().show();
				submitbtn.css({
					"color": "#fff",
					"background-color": "#008cd0"
				});
			} else {
				$presettle.parent().hide();
				submitbtn.css({
					"color": "#000",
					"background-color": "#ccc"
				});
			}
		};

		//checked
		function checkedFun() {
			var $checkAll = $(".balance-listgroup .supplier-account-check"); //所有全选按钮
			$checkAll.each(function(index) {
				var $that = $(this);
				var $checkbox = $that.parents(".balance-listgroup").nextAll(".balance-item" + index).find(".supplier-account-check"); //同个课题组的所有结算单按钮
				$checkbox.unbind().bind("click", function() {
					$(this).toggleClass("checked");
					if($checkbox.length == $(".balance-item" + index + " .checked").length) {
						$that.addClass("checked");
					} else {
						$that.removeClass("checked");
					}
					//已选结算金额计算
					preSettleMoney.call($that, index);
					//待结算单id列表
					/*preSettleId.call($that,index);*/
					//生成汇总单
					/*if($(".balance-item"+index+" .checked").length>0){
					    $(this).parents("tr").prev(".balance-listgroup").find('.balance-listgroup-collect-btn').unbind().bind("click",function(){
					        var submitUrl=common.serverBaseUrl+urls.allUrls.submitSummary;
					        var submitData={idList:preId};
					        var submitCallback=function(r){
					            console.log(r);
					        }
					        common.postData(submitUrl,submitData,submitCallback, true);
					    });
					}else{
					    $(this).parents("tr").prev(".balance-listgroup").find('.balance-listgroup-collect-btn').unbind();
					}*/
				});
				$that.unbind().bind("click", function() {
					$(this).toggleClass("checked");
					if($(this).hasClass("checked")) {
						$checkbox.addClass("checked");
					} else {
						$checkbox.removeClass("checked");
					}
					preSettleMoney.call(this, index);
				});
				//生成汇总单事件
				$that.parents("td").next().find(".balance-listgroup-collect-btn").unbind().bind("click", function() {
					var $checkedBalance = $(".balance-item" + index + " .checked"); //选中的结算单
					if($checkedBalance.length > 0) {
						preId = [];
						$checkedBalance.each(function() {
							var itemId = $(this).parents("td").siblings(".balance-name").attr("data-id");
							preId.push(itemId);
						})
						var submitUrl = common.serverBaseUrl + urls.allUrls.submitSummary;
						var submitData = {
							idList: preId
						};
						var submitCallback = function(r) {
							if(r.code == "0000") {
								dialog({
									title: '提示',
									modal: true,
									content: "生成汇总单成功",
									ok: function() {
										window.location.reload();
									},
									cancel: false
								}).width(320).show();
							} else {
								dialog({
									title: '提示',
									modal: true,
									content: r.message,
									ok: function() {},
									cancel: false
								}).width(320).show();
							}
						}
						common.postData(submitUrl, submitData, submitCallback, true);
					} else {
						return false; //若无结算单勾选，点击按钮无动作
					}
				});
			});
		}

		function eventBind() {

			/*var preSettleId=function(index){
				preId=[];
				$(".balance-item"+index+" .checked").each(function(){
               		var itemId=$(this).parents("td").siblings(".balance-name").attr("data-id");
               		preId.push(itemId);
                });
			};*/

			//tab状态（全部,准备中,审核中,付款中,已完成）
			$(".balance-header-search li").bind("click", function() {
				$(this).addClass("balance-header-selected").siblings().removeClass("balance-header-selected");
				var text = $(this).attr("data-flag");
				var status;
				if(text == "ready") {
					status = 0;
				} else if(text == "apply") {
					status = 1;
				} else if(text == "account") {
					status = 2;
				} else if(text == "done") {
					status = 3;
				} else if(text == "all") {
					status = '';
				}
				requestData = {
					pageNo: 1,
					pageSize: pageSize,
					querySet: {
						status: status
					}
				};
				common.postData(url, requestData, updateCallback, true);
			})

			//头部搜索
			$(".balance-search-text").bind("click", function() {
				var key = $.trim($(".balance-search-box").val());
				if(key == '' || key == undefined) {
					return false;
				} else {
					var text = $('.balance-header-search .balance-header-selected').attr("data-flag");
					var status;
					if(text == "ready") {
						status = 0;
					} else if(text == "apply") {
						status = 1;
					} else if(text == "account") {
						status = 2;
					} else if(text == "done") {
						status = 3;
					} else if(text == "all") {
						status = '';
					}
					requestData.pageNo = 1;
					requestData.querySet.queryTerm = key;
					requestData.querySet.status = status;
				}

				common.postData(url, requestData, updateCallback, true);
			});
			//回车搜索
			$(".balance-search-box").keydown(function(e) {
					if(e.keyCode == 13) {
						$(".balance-search-text").click();
					}
				})
				//更多搜索
				/* $(".balance-more-submit").bind("click", function() {
					var name = $.trim($(".balance-more-name").val());
					var num = $.trim($(".balance-more-number").val());
					var brand = $.trim($(".balance-more-brand").val());
					var startdate = $.trim($(".balance-more-startdate").val());
					var enddate = $.trim($(".balance-more-enddate").val());
					requestData = {
						pageNo: 1,
						pageSize: pageSize,
						querySet: {}
					};
					if(name !== "") {
						requestData.querySet.statementNo = name;
					}
					if(num !== "") {
						requestData.querySet.buyer = num;
					}
					if(brand !== "") {
						requestData.querySet.purchaser = brand;
					}
					if(startdate !== "") {
						requestData.querySet.startTime = startdate;
					}
					if(enddate !== "") {
						requestData.querySet.endTime = enddate;
					}
					var text = $('.balance-header-search .balance-header-selected').attr("data-flag");
					var status;
					if(text == "ready") {
						status = 0;
					} else if(text == "apply") {
						status = 1;
					} else if(text == "account") {
						status = 2;
					} else if(text == "done") {
						status = 3;
					} else if(text == "all") {
						status = '';
					}
					requestData.querySet.status = status;
					common.postData(url, requestData, updateCallback, true);
				}); */
				//重置
				/* $(".balance-more-reset").bind("click", function() {
					var name = $(".balance-more-name").val("");
					var num = $(".balance-more-number").val("");
					var brand = $(".balance-more-brand").val("");
					var startdate = $(".balance-more-startdate").val("");
					var enddate = $(".balance-more-enddate").val("");
				}); */

			//更多搜索条件显示与隐藏
			/* $(".balance-search-more").bind("click", function() {
				var txt = $(this).text();
				if(txt == "更多") {
					$(this).text("收起");
					$(".balance-more").show();
				} else {
					$(this).text("更多");
					$(".balance-more").hide();
				}
			}); */
			//时间控件
			/* laydate({
				elem: '#balance-more-startdate'
			});
			laydate({
				elem: '#balance-more-enddate'
			}); */
			//首页和末页
			$(".balance .head").click(function() {
				$("#pagination .prev").next().click();
			});
			$(".balance .end").click(function() {
				$("#pagination .next").prev().click();
			});
			//根据课题组筛选汇总单
			$(".balance-department").on("change", function() {
				var updateDepartmentData = {
					pageNo: 1,
					pageSize: 20,
					querySet: {
						queryTerm: $(this).children('option:selected').data('id'),
						status: 0
					}
				};
				common.postData(url, updateDepartmentData, updateCallback, true);
			});
			//左边菜单tab选中
			common.tabFocus("待结算");
			//home页跳转
			if(index) {
				if(index == 1) {
					$(".balance-header-search li").eq(index).click();
				} else if(index == 3) {
					$(".balance-header-search li").eq(index).click();
				}
			}
		}
	};
	return controller;
});