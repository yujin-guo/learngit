define(['jquery', 'text!module/header/navigation.html'], function($, navHtml) {

	var LOGIN_IFRAME_CLASS = "__sso_iframe__";

	// 提供服务
	return {
		pageNo: 1,
		//分页条数
		pageSize: 20,
		//服务器地址（跨域）
		serverBaseUrl: "/store",
		providerBaseUrl: "/supp",
		bidBaseUrl: "/bid",
		cmsBaseUrl: "/cms",
		photoUrl: "http://inner.rj-info.com:8295/store/api/upload/",
		//	purchaseBaseUrl:"/store",

		getLoginIframe: function(ssoTarget) {
			// 找到第一个正在处理登录请求的iframe
			var iframes = $("iframe." + LOGIN_IFRAME_CLASS);
			for(var i = 0, max = iframes.size(); i < max; ++i) {
				var iframe = $(iframes[i]);
				var done = iframe.prop('done');
				var ssoTargetOfIFrame = iframe.prop('ssoTarget');
				if(!done && ssoTargetOfIFrame == ssoTarget) {
					return iframe;
				}
			}
			return null;
		},

		fireRetriesInIframe: function(iframeId) {
			var iframe = $(document.getElementById(iframeId));
			if(iframe) {
				var requests = iframe.prop('requests');
				$.each(requests, function(idx, request) {
					if(request[0]) {
						request[0]();
					}
				});
				iframe.prop('done', true);
				iframe.remove();
			}
		},

		fireCallbacksInIframe: function(iframeId) {
			var iframe = $(document.getElementById(iframeId));
			if(iframe) {
				var requests = iframe.prop('requests');
				$.each(requests, function(idx, request) {
					if(request[1]) {
						request[1]();
					}
				});
				iframe.prop('done', true);
				iframe.remove();
			}
		},

		checkIfLoginRequired: function(response, url) {
			// 获取不同应用中要求“请先登录”的错误码
			var app = url.split("/");
			if(app.length == 0) {
				// 随便返回的。只要别让错误码判断错误就行
				return "?";
			}
			app = app[1];
			if(app == 'store') {
				return response.code == "1020";
			} else if(app == 'supp') {
				return response.code == "1020";
			} else if(app == 'bid') {
				return response.resultCode == "1001";
			} else if(app == 'cms') {
				return response.resultCode == "1001";
			}
			// 随便返回的。
			return "?";
		},

		loginInto: function(ssoLoginPath, successCallback, failCallback) {
			// 简单的处理方式是，检查当前页面内是否已经存在特定类的iframe，如果已经存在，将请求放入登录后
			// 应回调的处理队列中，然后跳过登录处理
			var loginIframe = this.getLoginIframe(ssoLoginPath);
			var requests;
			if(loginIframe) {
				requests = loginIframe.prop('requests');
				var callbacks = [successCallback, failCallback];
				requests.push(callbacks);
				return;
			}

			// 登录使用checkOnly，即静默登录，遇到完全未登录的情况直接跳回cb_fail_target，静默
			// 登录成功的情况跳转到cb_target
			var origin = window.location.origin;
			var path = window.location.pathname.split("/").slice(0, -1).join("/");
			var prefix = origin + path;
			var cbTarget = prefix + "/ssoLoginSucceed.html";
			var cbFailTarget = prefix + "/ssoLoginFail.html";
			var ssoTarget = ssoLoginPath;
			ssoLoginPath += "?cb_target=" + encodeURIComponent(cbTarget) + "&cb_fail_target=" + encodeURIComponent(cbFailTarget) + "&checkOnly=true";

			// cb_target 在成功的时候回调。回调时，将requests中记录的所有请求重新发送一次（fireRetriesInIframe），finalTry字段
			// 标记为true以避免再次发生需要登录的情况导致死循环。
			// cb_fail_target 在无法静默登录时调用requests中记录的回调（fireCallbacksInIframe）。另一种
			// 可以考虑的处理方式是直接不调用回调而跳到登录页面上。

			// 在iframe处理完所有请求后把iframe移除。登录处理完成。
			loginIframe = $("<iframe>");
			loginIframe.prop("ssoTarget", ssoTarget);
			loginIframe.prop('requests', []);
			requests = loginIframe.prop('requests');
			var iframeId = "login-" + Math.random();
			loginIframe.prop("id", iframeId);
			loginIframe.prop("class", LOGIN_IFRAME_CLASS);
			loginIframe.css("display", "none");
			requests.push([successCallback, failCallback]);
			loginIframe.appendTo($(document.body));

			loginIframe.prop("src", ssoLoginPath);
		},

		retryIfNotLoggedInOtherwiseCallback: function(response, url, params, callback, isJson, retryPredicate, method) {
			if(retryPredicate) {
				// 使用重试断言进行判断
				if(!retryPredicate(response, url, params)) {
					callback(response);
					return;
				}
			} else {
				// 重试断言未提供，使用默认的重试判断
				// 返回码1020是请先登录的错误码。非1020的话直接调用回调。
				// 但返回码的含义好像没统一……bid上是3000
				if(!this.checkIfLoginRequired(response, url)) {
					callback(response);
					return;
				}
			}
			// 1020 的情况下，尝试到CAS服务器登录，然后再重新发送一次请求
			// 登录依旧走iframe登录，但需要注意postData可能在不同时刻被调用多次而iframe登录流程仍未完成，
			// 所以需要注意判断iframe登录是否已经开始

			// 构造CAS登录路径。对于接口的调用，形式是类似：
			// http://host:port/store/api_name
			// 那么在这里的CAS登录路径就比较简单了，用第一段path+cas登录专用路径即可
			var ssoLoginPath = url.split("/").slice(0, 2).join("/");
			ssoLoginPath += "/sso/login";

			method = method || "post";

			var _this = this;
			if(method == "post") {
				this.loginInto(ssoLoginPath,
					function() {
						_this.postData(url, params, callback, isJson, false);
					},
					function() {
						callback(response);
					});
			} else {
				this.loginInto(ssoLoginPath,
					function() {
						_this.getData(url, params, callback, isJson, false);
					},
					function() {
						callback(response);
					});
			}
		},
		/**
		 * 请求方法
		 * @param {string} url 请求的url
		 * @param {json} params 传入的参数
		 * @param {function} callBack 回调方法
		 * @param {Boolean}isJson 是否为json格式
		 * @param {Boolean}doRetryWhenRequireLogin 是否在“请先登录”的情况下先尝试登录然后再发送请求
		 * @param {function} retryPredicate 是否需要登录后再重试一次请求的断言方法。如果不传入，默认从接口返回代码判断
		 * **/
		postData: function(url, params, callBack, isJson, doRetryWhenRequireLogin, retryPredicate) {
			var retry = (doRetryWhenRequireLogin == null || doRetryWhenRequireLogin == undefined) ? true : doRetryWhenRequireLogin;
			var that = this;
			var postData;
			//兼容ie7（未解决）
			if(isJson == true) {
				if(window.JSON) {
					postData = JSON.stringify(params);
				} else {
					postData = (new Function("return " + params))();
				}
			} else {
				postData = params;
			}
			$.ajax({
				url: url,
				data: postData,
				type: 'post',
				dataType: 'json',
				contentType: isJson == true ? 'application/json' : 'application/x-www-form-urlencoded',
				/* timeout: 20000, */
				beforeSend: function() {
					$('body').append("<span class='loading-gif' id='loading-gif'><img src='images/loading.gif' /></span>");
				},
				success: function(r) {
					if(retry) {
						that.retryIfNotLoggedInOtherwiseCallback(r, url, params, callBack, isJson, retryPredicate);
					} else {
						callBack(r);
					}
				},
				complete: function() {
						$(".loading-gif").remove();
					}
					/* error: function(XMLHttpRequest, textStatus, errorThrown) {
						if(XMLHttpRequest.statusText == "timeout") {
							that.getOutFun();
						}
					} */
			});
		},
		//退出登录
		getOutFun: function() {
			//var outFun = function(datas) {
			if($.cookie('id1')) {
				$.cookie('id1', '', {
					path: '/'
				});
				$.cookie('username1', '', {
					path: '/'
				});
				$.cookie('userEmail1', '', {
					path: '/'
				});
				window.location.href = this.providerBaseUrl + urls.allUrls.outLogin;
			} else {
				$.cookie('id', '', {
					path: '/'
				});
				$.cookie('username', '', {
					path: '/'
				});
				$.cookie('organization', '', {
					path: '/'
				});
				$.cookie("departments", '', {
					path: '/'
				});
				$.cookie("orgId", '', {
					path: '/'
				});
				$.cookie('userEmail', '', {
					path: '/'
				});
				$.cookie("permissions", '', {
					path: "/"
				});
				$.cookie("vm", '', {
					path: "/"
				});
				window.location.href = this.serverBaseUrl + urls.allUrls.outLogin;
			}
		},
		getData: function(url, params, callBack, isJson, doRetryWhenRequireLogin, retryPredicate) {
			var retry = (doRetryWhenRequireLogin == null || doRetryWhenRequireLogin == undefined) ? true : doRetryWhenRequireLogin;
			var _this = this;
			var getData;
			//兼容ie7（未解决）
			if(isJson == true) {
				if(window.JSON) {
					getData = JSON.stringify(params);
				} else {
					getData = (new Function("return " + params))();
				}
			}
			$.ajax({
				url: url,
				data: getData,
				type: 'get',
				dataType: 'json',
				contentType: isJson == true ? 'application/json' : 'application/x-www-form-urlencoded',
				success: function(r) {
					if(retry) {
						_this.retryIfNotLoggedInOtherwiseCallback(r, url, params, callBack, isJson, retryPredicate, 'get');
					} else {
						callBack(r);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {

				}
			});
		},
		//商品分类导航去掉初始化的状态；
		firstNav: function() {
			$('.header-main-nav-cell-01').removeClass('header-main-nav-active').addClass('header-main-nav-hover');
			return this;
		},

		//商品分类导航的展示和关闭效果；
		/**
		 * @param [number] num 判断是否是首页
		 * num 存在，则表示为首页； 否则表示其他页面
		 * **/
		mainNav: function(num) {
			if(num != 0) {
				this.firstNav();
			}
			$('.header-main-nav-hover').hover(
				function() {
					$('.header-main-nav-sub').show();
				},
				function() {
					$('.header-main-nav-sub').hide();
				}
			);
			$('.header-main-sub-name').mouseover(
				function() {
					$(this).next('.header-main-nav-types').show().siblings("ul").hide();
					$(this).css({"background-color":"#61a62c","font-weight":"bold"});
				}
			);
			$('.header-main-sub-name').mouseout(
				function() {
					$(this).css({"background-color":"transparent","font-weight":"normal"});
				}
			);
			$('.header-main-nav-types').mouseover(
				function() {
					$(this).prev(".header-main-sub-name").css({"background-color":"#61a62c","font-weight":"bold"});
				}
			);
			$('.header-main-nav-types').mouseout(
				function() {
					$(this).prev(".header-main-sub-name").css({"background-color":"transparent","font-weight":"normal"});
				}
			);
			$('.header-main-nav-sub').mouseleave(
				function() {
					$(this).find("ul").hide();
				}
			);
			return this;
		},

		/**
		 * 搜索的处理
		 * 点击事件判断
		 * **/
		search: function() {
			var _key = '';
			$('.ac-key-search').on('click', 'a', function() {
				$(this).removeClass("ac-key-hover").addClass("ac-key-a-active");
				$(this).parent().siblings("li").find("a").removeClass("ac-key-a-active").addClass('ac-key-hover');
				/* _key = $(this).text();*/
				_key = $(this).attr("data-flag");
				//$('#searchOptionKey').attr("data-flag",$(this).attr("data-flag")).text(_key);
				switch(_key) {
					case "goods":
						$("#searchKey").attr("placeholder", "请输入商品名称、商品编码、货号、品牌名称进行搜索");
						break;
					case "supplie":
						$("#searchKey").attr("placeholder", "请输入供应商名称进行搜索");
						break;
					case "brand":
						$("#searchKey").attr("placeholder", "请输入商品品牌进行搜索");
						break;
					case "format":
						$("#searchKey").attr("placeholder", "请输入商品规格进行搜索");
						break;
					case "num":
						$("#searchKey").attr("placeholder", "请输入商品编码搜索");
						break;
					case "category":
						$("#searchKey").attr("placeholder", "请输入商品类型搜索");
						break;
				}
				//location.href = '#/commoditylist?key=' + encodeURIComponent(_key, 'utf8');
			});
			$("#searchKey").keydown(function(event) {
				if(event.keyCode == 13) {
					$(".ac-search").click();
				}
			});
			$('.ac-search').on('click', function() {
				//if($('#searchKey').val() && $('#searchKey').val().trim().length > 0){
				if($('#searchKey').val() == "") {
					return false;
				}
				var searchF = $('.ac-key-a-active').attr("data-flag");
				if(searchF == "goods") {
					_key = '?key=' + encodeURIComponent($.trim($('#searchKey').val()), 'utf8');
				} else if(searchF == "supplie") {
					_key = '?supp=' + encodeURIComponent($.trim($('#searchKey').val()), 'utf8');
				} else if(searchF == "brand") {
					_key = '?bran=' + encodeURIComponent($.trim($('#searchKey').val()), 'utf8');
				} else if(searchF == "format") {
					_key = '?format=' + encodeURIComponent($.trim($('#searchKey').val()), 'utf8');
				} else if(searchF == "num") {
					_key = '?num=' + encodeURIComponent($.trim($('#searchKey').val()), 'utf8');
				} else if(searchF == "category") {
					_key = '?cate=' + encodeURIComponent($.trim($('#searchKey').val()), 'utf8');
				}

				/* }*/
				var _url = '#commoditylist' + _key;
				location.href = _url;
			});
			return this;
		},
		/**
		 * 搜索字段的获取
		 * **/
		searchKey: function() {
			var c = this.getQueryString('key'),
				s = this.getQueryString('supp');
			if(c) {
				$(".header-search-ul a").eq(0).addClass("ac-key-a-active").removeClass("ac-key-hover");
				$(".header-search-ul a").eq(1).removeClass("ac-key-a-active").addClass("ac-key-hover");
			} else if(s) {
				$(".header-search-ul a").eq(1).addClass("ac-key-a-active").removeClass("ac-key-hover");
				$(".header-search-ul a").eq(0).removeClass("ac-key-a-active").addClass("ac-key-hover");
			} else {
				$(".header-search-ul a").eq(0).addClass("ac-key-a-active").removeClass("ac-key-hover");
				$(".header-search-ul a").eq(1).removeClass("ac-key-a-active").addClass("ac-key-hover");
			}
			var _key = this.getQueryString('key') || this.getQueryString('supp');
			if(_key != false) {
				$('#searchKey').val(decodeURIComponent(_key));
			}
			return this;
		},
		/**
		 * 获取url中的字段
		 * @params {name} string 获取字段的名字
		 * return {context} 返回获取的字段
		 * **/
		getQueryString: function(name) {
			if(!/\?/.test(location.hash)) {
				return false;
			}
			var _reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
				_hash = location.hash.split('?')[1],
				_r = _hash.match(_reg);
			var _context = "";
			if(_r != null) _context = _r[2];
			_reg = null;
			_r = null;
			return _context == null || _context == "" || _context == "undefined" ? "" : _context;
		},

		/**
		 * 页码
		 * @params {totalNum} 总条数
		 * @params {pageIndex} 初始为第几页，默认0为第1页
		 * @params {pageSize} 每页显示的条数
		 * @params {pageCallback} 点击页数后执行的方法
		 * **/
		pageFun: function(totalNum, pageIndex, pageSize, pageCallback) {
			$("#pagination").pagination(totalNum, {
				prev_text: " ",
				next_text: " ",
				current_page: pageIndex - 1,
				ellipse_text: "...",
				num_edge_entries: 2,
				num_display_entries: 5,
				items_per_page: pageSize,
				callback: pageCallback,
				link_to: "javascript:void(0);"
			});
		},

		/**
		 * 商品列表条件筛选
		 * @params {callbackFun} ajax后的回调函数
		 * @params {url} 服务器地址
		 * @params {pageIndex} 查询第几页
		 * @params {order} 排序方式，价格 PRICE，销量 SALEAMOUNT
		 * @params {direction}排序方向，升序DESC，降序ASC
		 * @params {showBar}true为获取品牌和供应商信息，false则不返回两者信息
		 * @params {findModel}查找条件，对象格式，如var findModel={}
		 * @params {suppliers}供应商查找条件，对象格式，如 var suppliers={id:"1",name:"基因科技"}
		 * **/
		urlFun: function(callbackFun, url, pageIndex, order, direction, showBar, findModel) {
			var listData = {
				pageNo: pageIndex,
				pageSize: common.pageSize,
				order: order,
				direction: direction,
				showBar: showBar,
				findModel: findModel
			};
			this.postData(url, listData, callbackFun, true);
		},
		myAjax: function(type, url, data, doneCallback, failCallback, alwaysCallback) {
			$.ajax({
				type: type,
				url: url,
				data: data,
				dataType: 'json',
				contentType: "application/json",
			}).done(function(result) {
				if(typeof doneCallback === "function") {
					doneCallback(result);
				}
			}).fail(function(result) {
				if(typeof failCallback === "function") {
					failCallback(result);
				}
			}).always(function(result) {
				if(typeof alwaysCallback === "function") {
					alwaysCallback(result);
				}
			});
		},

		/*
		 *nav模块的接口请求及数据显示
		 *@param [number] num 判断是否为首页，num为零则是首页
		 */
		nav: function(num) {
			var categoryUrl = this.serverBaseUrl + "/api/product/category/findAllCategoriesProducts"; //首页一二级分类
			var that = this;
			var callback = function(r) {
				if(r.code == "0000") {
					$("#navModule").html(_.template(navHtml, {
						data: r.list
					}));
					if(num == 0) {
						that.mainNav(0);
						$('.header-main-nav-cell-01').removeClass('header-main-nav-hover').addClass('header-main-nav-active');
					} else {
						that.mainNav();
					}
				}
			}
			that.postData(categoryUrl, {
				flag: 0
			}, callback, false);
			return this;
		},

		//验证手机号码
		checkMobileFun: function(value) {
			var reg0 = /^13\d{9}$/;
			var reg1 = /^15\d{9}$/;
			var reg2 = /^14\d{9}$/;
			var reg3 = /^17\d{9}$/;
			var reg4 = /^18\d{9}$/;
			var my = false;
			if(reg0.test(value)) my = true;
			if(reg1.test(value)) my = true;
			if(reg2.test(value)) my = true;
			if(reg3.test(value)) my = true;
			if(reg4.test(value)) my = true;
			return my;
		},
		/**
		 * 文件上传
		 * @params {string} id 需要提交的表单id名
		 * @params {function} callBack 回调函数（可选，没有的话默认输出返回信息）
		 * **/
		fileUpload: function(id, callBack, fileurl) {
			var url = fileurl;
			var form = $('#' + id)[0];
			var formData = new FormData(form);
			$.ajax({
				url: url,
				type: 'POST',
				data: formData,
				cache: false,
				dataType: 'JSON',
				processData: false,
				contentType: false,
			}).done(function(r) {
				typeof(callBack) == "function" ? callBack(r): alert(r);
			}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
				dialog({
					title: '提示',
					modal: true,
					content: "文件上传失败，请重新上传。",
					ok: function() {},
					cancel: false,
				}).width(320).show();
			})
		},

		//竞价上传文件
		bidUpload: function(fileUrl, datas) {
			var t = this;
			$("#file-link").on("click", function() {
				$("#file-input").click();
			});
			$("#file-input").on("change", function() {
				$("#file-link").parent().nextAll(".bid-error").html('');
				var files = this.files[0];
				var fType = /(application\/msword)|(application\/vnd.ms-excel)|(application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|(application\/pdf)|(application\/x-zip-compressed)|(application\/x-rar-compressed)|(image\/jpeg)|(image\/jpg)|(image\/png)/.test(files.type);
				var fSize = files.size;
				if(fSize > 10485760) {
					$("#file-link").parent().nextAll(".bid-error").html('<label class="error">支持小于10M的文件</label>');
				} else if(!fType) {
					$("#file-link").parent().nextAll(".bid-error").html('<label class="error">支持jpg、jpeg、png、excel、word、pdf、rar、zip格式文件</label>');
				} else {
					t.fileUpload("bid", fileCallback, fileUrl);
				}
				var th = $(this);

				function fileCallback(d) {
					if(d.resultCode == "0000") {
						$("#file-path").html(th.val());
						$("#file-path").attr("data-id", d.id);
					} else if(d.resultCode == "1001") {
						$("#out").click();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: datas.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}

				}
			});
		},
		identityFun: function(c, params) {
			var it = this;

			//登录身份验证
			this.getData("/store/api/identity", null, callbackValidate, true);

			function callbackValidate(d) {
				if(d.code == "0000") {

					$.cookie('id', d.user.id, {
						path: '/'
					});
					$.cookie('username', d.user.realName, {
						path: '/'
					});
					$.cookie('organization', d.user.organization.name, {
						path: '/'
					});
					$.cookie('orgId', d.user.organization.id, {
						path: '/'
					});
					$.cookie("vm", d.user.mobile, {
						path: "/"
					});
					var permission_list = d.user.permissions;
					var new_arr = [];
					for(var i = 0; i < permission_list.length; i++) {
						var items = permission_list[i].name;
						if($.inArray(items, new_arr) == -1) {
							new_arr.push(items);
						}
					}
					window.userPermissions = new_arr;
					var a = JSON.stringify(new_arr);
					$.cookie("permissions", a, {
						path: "/"
					});

					c.apply(null, params); //每个模块约定都返回controller
					it.cookieFun();

					/*退出登录*/
					$("#out").unbind().on("click", function() {
						it.getOutFun();
					});

				} else if(d.code == "1020") {
					it.getOutFun();
				}
			}
		},
		cookieFun: function() {
			if($.cookie('id') != undefined && $.cookie('id') != '' && $.cookie('id') != null) {
				$("#user-nav").prepend("<span style='color:#aaa;padding-right:10px;'>您好&nbsp;&nbsp;<span id='header-username'>" + $.cookie('username') + "</span></span>");
				$("#user-nav").append("<a href='../purchaser_Manager/index.html' id='user-name'>采购人中心" +
					"</a><em class='pd-lf-10 pd-rg-10'>|</em><a href='" + jump.demo.hms + "' id='hospital-center'>医院管理中心</a><a href='javascript:void(0)' class='pd-lf-8' id='out'>退出</a>");
				if($("#flag-login")) {
					$("#flag-login").remove();
				}
				$("#cart").css({
					"display": "inline-block"
				}).next("em").css({
					"display": "inline-block"
				});
				$("#myorder").css({
					"display": "inline-block"
				}).next("em").css({
					"display": "inline-block"
				});
			} else if($.cookie('id1') != undefined && $.cookie('id1') != '' && $.cookie('id1') != null) {
				$("#user-nav").prepend("<span style='color:#aaa;padding-right:10px;'>您好 " + $.cookie('userReal') + "</span>");
				$("#user-nav").append("<a href='../supplier/index.html#personal' id='user-name'>供应商中心<a>"+
					"<a href='javascript:void(0)' class='pd-lf-8' id='out'>退出</a>");
				if($("#flag-login")) {
					$("#flag-login").remove();
				}

				$("#cart").css({
					"display": "none"
				}).next("em").css({
					"display": "none"
				});
				$("#myorder").css({
					"display": "none"
				}).next("em").css({
					"display": "none"
				});
			} else {
				$("#cart").css({
					"display": "none"
				}).next("em").css({
					"display": "none"
				});
				$("#myorder").css({
					"display": "none"
				}).next("em").css({
					"display": "none"
				});
				$("#user-nav").append("<span id='flag-login'><a href='#login' id='login'>登录</a><em class='pd-lf-10 pd-rg-10'>|</em><a href='#providerfirst?key=login'>供应商注册</a></span>");
			}
		}
	};
});