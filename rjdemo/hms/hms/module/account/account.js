define(['text!module/account/account.html', 'text!module/account/header.html', 'text!module/account/common_nav.html', 'text!module/account/loadAccount.html', 'text!module/account/scanHtml.html', 'text!module/account/scanAppendHtml.html', 'css!module/account/style/account.css', "js/libs/laydate.dev"], function(tpl, header, nav, loadHtml, scanHtml, scanAppendHtml) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		var url = testUrl + urls.allUrls.getStatement; //结算单列表地址
		var checkListUrl = testUrl + urls.allUrls.getStatementDetail; //添加扫描清单
		var excelUrl = testUrl + urls.allUrls.checkoutList; //导出验收汇总表
		var updateStatusUrl = testUrl + urls.allUrls.updateAccountStatus; //验收单更新状态
		var updateInvoiceUrl = testUrl + urls.allUrls.updateInvoiceStatus; //发票清单（汇总单）更新状态
		var getInvoiceDetailUrl = testUrl + urls.allUrls.getInvoiceDetail; //发票清单（汇总单）详情
		var index = $.cookie("accountIndex");
		var pageSize = 20;
		var pageNo = 1;
		var requestData = {
			pageNo: 1,
			pageSize: pageSize,
			querySet: {
				status: (index && index != "all") ? index : null
			}
		}; //请求参数
		if(index && index != "all") {
			requestData.querySet.status = index;
		}

		var callback = function(r) {
			$.cookie("accountIndex", '', { //清掉从结算详情点击导航的状态cookie
				path: "/"
			});
			if(r.code == "0000") {
				if(r.statementList.length > 0) {
					r.flag = true;
				} else {
					r.flag = false;
				}
				$("#right-container").html(_.template(nav));
				$("#right-container").append(_.template(tpl, r));
				var totalP = r.totalPages * pageSize;
				common.pageFun(totalP, pageNo, pageSize, pageEventFun); //页码初始化
				eventBind();
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
		common.postData(url, requestData, callback, true);

		//页码触发事件
		function pageEventFun(pageIndex) {
			requestData.pageNo = pageIndex + 1;
			common.postData(url, requestData, callbackCommonFun, true);
		}

		//公共回调函数
		function callbackCommonFun(r) {
			if(r.code == "0000") {
				if(r.statementList.length > 0) {
					r.flag = true;
				} else {
					r.flag = false;
				}
				$("#accountList").html(_.template(loadHtml, r));
				common.pageFun(r.totalPages * pageSize, requestData.pageNo, pageSize, pageEventFun);
				$('.account-checkbox-all').removeClass('all-selected').prop('checked', false);
				window.scrollTo(0, 0);
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

		function eventBind() {
			$(".secondary-title").each(function() {
				var $th = $(this);
				var dataFlag = $th.attr("data-flag");
				if(dataFlag == index) {
					$th.addClass("secondary-active").siblings(".secondary-title").removeClass("secondary-active");
				}
			});

			//弹窗
			$(".checker").on("click", function(e) {
				var scanFlag = $(this).attr("data-flag");
				$(".scan-background,.scan-wrap").show();
				scanFlag == "scan-check" ? (function() {
					$(".scan-title").html("扫描验收单");
					$(".scan-add-input").prop("placeholder", "输入结算单号手动添加验收单");
					$(".scan-finance").hide();
					$(".scan-supplier").show();
					$(".scan-save-result,.scan-add-btn").attr("data-flag", "checker");
					$(".scan-save-result").show();
				})() : (function() {
					$(".scan-title").html("扫描发票清单");
					$(".scan-add-input").prop("placeholder", "输入结算汇总单号或者发票清单号");
					$(".scan-supplier").hide();
					$(".scan-finance").show();
					$(".scan-save-result,.scan-add-btn").attr("data-flag", "invoice");
					$(".scan-save-result").hide();
				})();
				
				e=e||window.event;
				if(e.stopPropagation){
					e.stopPropagation();
				}else{
					e.cancelable=true;
				}
				
			});

			//关闭弹窗
			$(".scan-close-icon,.scan-cancel").on("click", function() {
				var scanStr = '<p class="scan-empty">请扫描发票清单或验收汇总单上的编码，或手动输入添加</p>';
				$("#scan-content-list").html(scanStr);
				$(".scan-add-input").val(null);
				$(".scan-background,.scan-wrap").hide();
				allScanData = [];
			});

			//单批结算单收缩、展开
			$("#scan-content-list").on("click", ".scan-triangle-icon", function(e) {
				if(!$(this).hasClass("scan-triangle-icon-active")) {
					$(this).parent().nextAll(".scan-content-body").hide("normal");
					$(this).addClass("scan-triangle-icon-active");
				} else {
					$(this).parent().nextAll(".scan-content-body").show("normal");
					$(this).removeClass("scan-triangle-icon-active");
				}

				var al = $(".scan-triangle-icon-active").length;
				var cl = $(".scan-triangle-icon").length;

				//头图标状态
				if(al == cl) {
					$(".scan-all-hidden").addClass("scan-all-hidden-active");
					$(".scan-all-show").removeClass("scan-all-show-active");

				} else {
					$(".scan-all-hidden").removeClass("scan-all-hidden-active");
					$(".scan-all-show").addClass("scan-all-show-active");
				}
				
				e=e||window.event;
				if(e.stopPropagation){
					e.stopPropagation();
				}else{
					e.cancelable=true;
				}
			});

			var allScanData = []; //存储验收单数据

			//所有结算单展开/收缩
			$(".scan-all-hidden,.scan-all-show").on("click", function(e) {
				var f = $(this).attr("data-flag");
				if(f == "hidden") {
					if($(this).hasClass("scan-all-hidden-active")) {
						return false;
					} else {
						$(".scan-content-body").hide("normal");
						$(".scan-triangle-icon").addClass("scan-triangle-icon-active");
						$(".scan-all-hidden").addClass("scan-all-hidden-active");
						$(".scan-all-show").removeClass("scan-all-show-active");
					}
				} else if(f == "show") {
					if($(this).hasClass("scan-all-show-active")) {
						return false;
					} else {
						$(".scan-content-body").show("normal");
						$(".scan-triangle-icon").removeClass("scan-triangle-icon-active");
						$(".scan-all-hidden").removeClass("scan-all-hidden-active");
						$(".scan-all-show").addClass("scan-all-show-active");
					}
				}
				e=e||window.event;
				if(e.stopPropagation){
					e.stopPropagation();
				}else{
					e.cancelable=true;
				}
			});

			//添加单据回调
			function callbackCheckFun(r) {
				if(r.code == "0000") {
					var i = 0,j = 0,suppName = null;
                    ctrFlag = $(".scan-add-btn").attr("data-flag");
					r.flag = ctrFlag;
					$.each(allScanData, function(key, value) {
						if(ctrFlag == "checker") {
							if(value.banlanceNo == r.banlanceNo) {
								i++;
							}
						} else {
							if(value.summaryModel.summaryNo == r.summaryModel.summaryNo) {
								i++;
							}
						}
						/*if(value.banlanceNo == r.banlanceNo) {
							i++;
						}*/
						/*if((value.supplierName == r.supplierName)&&(value.banlanceNo != r.banlanceNo)) {
							j++;
							suppName = value.supplierName;
						}*/

					});

					//重复验收单判断
					i == 0 ? (function() {
						$("#scan-content-list").append(_.template(scanHtml, r));
						$(".scan-empty").remove();
						$(".scan-all-show").addClass("scan-all-show-active");
						allScanData.push(r);
						//同一个供应商
						/*j == 0 ? (function() {
							$("#scan-content-list").append(_.template(scanHtml, r));
							$(".scan-empty").remove();
						})() : (function() {
							var $suppTitle = $(".scan-content-title");
							$suppTitle.each(function() {
								if($.trim($(this).attr("data-supp")) == suppName) {
									var $t = $(this).parent(".scan-content-ul");
									$t.append(_.template(scanAppendHtml,r));
									var d=parseInt($.trim($t.find(".scan-num").html()));
									d=d+r.orders.length;
									$t.find(".scan-num").html(d);
								}
							});
						})();*/
					})() : (function() {
						$(".scan-error").html("您搜索的单据重复，请重新添加");
						timeClearFun();
					})();

					function timeClearFun() {
						setTimeout(function() {
							$(".scan-error").html(null);
						}, 5000);
					}
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
				$(".scan-add-input").val(null);
				$(".scan-add-input").focus();
			}

			//扫描：添加验收单/添加发票清单
			$(".scan-add-btn").on("click", function(e) {
				var addFlag = $(this).attr("data-flag");
				var scanValue = $.trim($(".scan-add-input").val());
				if(scanValue) {
					addFlag == "checker" ? (function() {
						var statementData = {
							statementNo: scanValue
						};
						common.postData(checkListUrl, statementData, callbackCheckFun, true);
					})() : (function() {
						var summaryData = {
							summaryNo: scanValue
						}
						common.postData(getInvoiceDetailUrl, summaryData, callbackCheckFun, true);
					})();
				}
				e=e||window.event;
				if(e.stopPropagation){
					e.stopPropagation();
				}else{
					e.cancelable=true;
				}
				
			});

			$(".scan-add-input").on("keyup", function(e) {
				if(e.keyCode == 13) {
					$(".scan-add-btn").click();
				}
			});

			//移除扫描
			$("#scan-content-list").on("click", ".scan-remove", function(e) {
				var $th = $(this);
				var banlanceNo = $th.attr("data-id");
				var banlanceFlag = $th.attr("data-flag");
				banlanceFlag == "checker" ? (function() {
					$.each(allScanData, function(key, value) {
						value.banlanceNo == banlanceNo ? (function() {
							allScanData.splice(key, 1);
						})() : null;
					});
				})() : (function() {
					$.each(allScanData, function(key, value) {
						$.each(value.summaryModel.statement, function(key1, value1) {
							value1.banlanceNumber == banlanceNo ? (function() {
								allScanData[key].summaryModel.statement.splice(key1, 1);
								!allScanData[key].summaryModel.statement.length ? (function() {
									allScanData.splice(key, 1);
									$th.parent().parent().parent().parent().remove();
								})() : null;
							})() : null;
						});
						value.banlanceNo == banlanceNo ? (function() {
							allScanData.splice(key, 1);
						})() : null;
					});
				})();

				//console.table(allScanData);

				$th.parent().parent().parent().remove();
				e=e||window.event;
				if(e.stopPropagation){
					e.stopPropagation();
				}else{
					e.cancelable=true;
				}

			});

			//保存扫描验收单结果/提交供应商/保存发票清单结果/提交给财务
			$("#accountList,.scan-content-footer,.account-btn").on("click", ".ctrl-common", function(e) {
				var resultFlag = $(this).attr("data-flag");
				var $this = $(this);
				var statementNos = [];
				$(".scan-hidden-value").each(function() {
					statementNos.push($.trim($(this).val()));
				});
				switch(resultFlag) {
					case "checker":
						var scan = {
							statementNos: statementNos,
							status: 5
						};
						common.postData(updateStatusUrl, scan, updateFun, true);
						break;
					case "invoice":
						var invoice = {
							summaryNos: statementNos,
							summaryType: "WaitingToReview"
						};
						common.postData(updateInvoiceUrl, invoice, updateFun, true);
						break;
					case "supplier":
						var scanSupplier = {
							statementNos: statementNos,
							status: 0
						};
						common.postData(updateStatusUrl, scanSupplier, updateFun, true);
						break;
					case "finance":
						var invoiceFinance = {
							summaryNos: statementNos,
							summaryType: "WaitingToPay"
						};
						common.postData(updateInvoiceUrl, invoiceFinance, updateFun, true);
						break;
					case "single":
						var singleData = {
							statementNo: $this.attr("data-id"),
							status: parseInt($this.attr("data-status"))
						};
						common.postData(updateStatusUrl, singleData, updateFun, true);
						break;
					case "sinInvoice":
						var singleData = {
							SummaryNo: $this.attr("data-id"),
							summaryType: $this.attr("data-status")
						};
						common.postData(updateInvoiceUrl, singleData, updateFun, true);
						break;
					case "batch-supplier":
						var batchSupplier = [];
						$(".account-checkbox:checked").each(function() {
							var No = $(this).next().attr("data-No");
							batchSupplier.push(No);
						});
						var batchSupplierData = {
							statementNos: batchSupplier,
							status: 0
						};
						batchSupplier.length > 0 ? (function() {
							common.postData(updateStatusUrl, batchSupplierData, updateFun, true);
						})() : (function() {
							dialog({
								title: '提示',
								modal: true,
								content: '请选择需要操作的数据',
								ok: function() {},
								cancel: false,
							}).width(320).show();
						})();
						break;
					case "batch-invoice":
						var batchInvoice = [];
						$(".account-checkbox:checked").each(function() {
							var No = $(this).next().attr("data-No");
							batchInvoice.push(No);
						});
						var batchInvoiceData = {
							summaryNos: batchInvoice,
							summaryType: "WaitingToPay"
						};
						batchInvoice.length > 0 ? (function() {
							common.postData(updateInvoiceUrl, batchInvoiceData, updateFun, true);
						})() : (function() {
							dialog({
								title: '提示',
								modal: true,
								content: '请选择需要操作的数据',
								ok: function() {},
								cancel: false
							}).width(320).show();
						})();
						break;
					default:
						return false;
				}
				e=e||window.event;
				if(e.stopPropagation){
					e.stopPropagation();
				}else{
					e.cancelable=true;
				}

			});

			function updateFun(r) {
				if(r.code == "0000") {
					dialog({
						title: '提示',
						modal: true,
						content: '操作成功',
						ok: function() {
							$(".scan-close-icon,.scan-cancel").click();
							requestData = {
								pageNo: 1,
								pageSize: pageSize
							};
							common.postData(url, requestData, callbackCommonFun, true);
						},
						cancel: false
					}).width(320).show();

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

			//导出验收汇总单
			$(".export").bind("click", function(e) {
				var $that = $(this);
				var idList = [];
				$(".account-checkbox:checked").each(function() {
					var id = $(this).next().val();
					idList.push(id);
				});
				var excelCallback = function(r) {
					if(r.code == "0000") {
						$that.next("a").prop("href", testUrl + "/" + r.url);
						var $span = $that.next("a").find(".account-download");
						$span.click();
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
				common.postData(excelUrl, {
					idList: idList
				}, excelCallback, true);
				
				e=e||window.event;
				if(e.stopPropagation){
					e.stopPropagation();
				}else{
					e.cancelable=true;
				}
			});

			//checkbox勾选
			var $chekboxAll = $(".account-checkbox-all"); //全选按钮
			$chekboxAll.bind("click", function() {
				var $checkbox = $(".account-checkbox");
				$(this).toggleClass("all-selected");
				if($(this).hasClass("all-selected")) {
					$checkbox.each(function() {
						$(this).prop("checked", true);
					});
				} else {
					$checkbox.each(function() {
						$(this).prop("checked", false);
					});
				}
			});
			$("#accountList").on("click", ".account-checkbox", function() {
				if($(".account-checkbox:checked").length == $(".account-checkbox").length) {
					$(".account-checkbox-all").prop("checked", true).addClass("all-selected");
				} else {
					$(".account-checkbox-all").prop("checked", false).removeClass("all-selected");
				}
			});

			//搜索功能
			var dataFun=function(){
				var search = $(".search-input").val().trim(),
					startTime = $("#startTime").val(),
					endTime = $.trim($("#endTime").val()),
					supp = $.trim($("#supp").val()),
					dept = $.trim($("#dept").val()),
					status = parseInt($(".account select").val());;
				requestData = {
					pageNo: 1,
					pageSize: pageSize,
					querySet: {}
				}
				if(index && index != "all") {
					requestData.querySet.status = index;
				}
				if(search) {
					requestData.querySet.queryTerm = search;
				}
				if(startTime) {
					requestData.querySet.startTime = startTime;
				}
				if(endTime) {
					requestData.querySet.endTime = endTime;
				}
				if(supp) {
					requestData.querySet.supp = supp;
				}
				if(dept) {
					requestData.querySet.dept = dept;
				}
				if(status||status===0){
					requestData.querySet.status = status;
				}
				common.postData(url, requestData, callbackCommonFun, true);
			};
			$(".search-btn").bind("click", function() {
				$(".account select").val("all");
				dataFun();
			});
			$(".search-input").keydown(function(event) {
				if(event.keyCode == 13) {
					$(".search-btn").click();
				}
			});
			//状态筛选
			$(".account select").change(function() {
				var status = parseInt($(this).val());
				dataFun();
			});

			//首页和末页
			$(".endpoint").bind("click", function() {
				switch($(this).text()) {
					case "首页":
						$("#pagination .prev").next().click();
						break;
					case "尾页":
						$("#pagination .next").prev().click();
						break;
				}

			});

			//子导航选择
			$(".secondary-title").click(function() {
				$(this).addClass("secondary-active").siblings().removeClass("secondary-active");
				switch($(this).attr("data-flag")) {
					case "1":
						status = 1;
						break;
					case "2":
						status = 2;
						break;
					case "3":
						status = 3;
						break;
					case "4":
						status = 4;
						break;
					case "5":
						status = 5;
						break;
					case "7":
						status = 7;
						break;
					case "all":
						status = null;
						break;
					default:
						status = null;
				}
				requestData = {
					pageNo: 1,
					pageSize: pageSize,
					querySet: {
						status: status
					}
				}
				common.postData(url, requestData, callbackCommonFun, true);
			});

			//时间控件
			laydate({
				elem: "#startTime"
			});
			laydate({
				elem: "#endTime"
			});
		}
	};
	return controller;
});