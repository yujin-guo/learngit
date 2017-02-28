/**
 * Created by liumin on 2016/7/11.
 */
define(['jquery', 'myalert'], function($) {

	var LOGIN_IFRAME_CLASS = "__sso_iframe__";

	// 提供服务
	return {
		pageNo: 1,
		//分页条数
		pageSize: 20,
		//服务器地址（跨域）
		serverBaseUrl: "/store",
		providerBaseUrl: "/supp",
		batchUrl: "/store1",
		bidBaseUrl: "/bid",
		cmsBaseUrl: "/cms",

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
				/* timeout:20000, */
				beforeSend: function() {
					$('body').append("<span class='loading-gif' id='loading-gif'><img src='style/images/loading.gif' /></span>");
				},
				success: function(r) {
						$(".loading-gif").remove();
						if(retry) {
							that.retryIfNotLoggedInOtherwiseCallback(r, url, params, callBack, isJson, retryPredicate);
						} else {
							callBack(r);
						}
					}
					/* error: function(XMLHttpRequest) {
						if(XMLHttpRequest.statusText == "timeout") {
							that.getOutFun();
						}
					} */
			});
		},
		getData: function(url, params, callBack, isJson, doRetryWhenRequireLogin, retryPredicate) {
			var retry = (doRetryWhenRequireLogin == null || doRetryWhenRequireLogin == undefined) ? true : doRetryWhenRequireLogin;
			var that = this;
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
				/* timeout:20000, */
				beforeSend: function() {
					$('body').append("<span class='loading-gif' id='loading-gif'><img src='style/images/loading.gif' /></span>");
				},
				success: function(r) {
						$(".loading-gif").remove();
						if(retry) {
							that.retryIfNotLoggedInOtherwiseCallback(r, url, params, callBack, isJson, retryPredicate, 'get');
						} else {
							callBack(r);
						}
					}
					/* error: function(XMLHttpRequest) {
						if(XMLHttpRequest.statusText == "timeout") {
							$.cookie('id', '', {
								path: '/'
							});
							$.cookie('username', '', {
								path: '/'
							});
							window.location.href =that.serverBaseUrl + urls.allUrls.outLogin;
						}
					} */
			});
		},
		//数字转换为大写
		NoToChinese: function(num) {
			if(!/^\d*(\.\d*)?$/.test(num)) {
				return "Number is wrong!";
			}
			var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
			var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
			var a = ("" + num).replace(/(^0*)/g, "").split("."),
				k = 0,
				re = "";
			for(var i = a[0].length - 1; i >= 0; i--) {
				switch(k) {
					case 0:
						re = BB[7] + re;
						break;
					case 4:
						if(!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
							re = BB[4] + re;
						break;
					case 8:
						re = BB[5] + re;
						BB[7] = BB[5];
						k = 0;
						break;
				}
				if(k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
				if(a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
				k++;
			}

			if(a.length > 1) //加上小数部分(如果有小数部分) 
			{
				re += BB[6];
				for(var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
			}
			return re;
		},
		//获取当前时间
		getDate: function() {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			month = (month < 10 ? "0" + month : month);
			var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			var calendar = (year.toString() + "-" + month.toString() + "-" + day.toString());
			return calendar;
		},
		//获取距离当前日期一个月前的日期
		getOneMonthDate: function() {
			var dd = new Date();
			dd.setDate(dd.getDate() - 30);
			var y = dd.getFullYear();
			var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);
			var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
			return y + "-" + m + "-" + d;
		},
		//js时间戳转为本地时间格式
		getLocalTime: function(now) {
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var date = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
		},
		//商品分类导航去掉初始化的状态；
		firstNav: function() {
			$('.header-main-nav-cell-01').removeClass('header-main-nav-active').addClass('header-main-nav-hover');
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
				});
			$('.header-main-nav-sub').hover(
				function() {
					$('.header-main-nav-types').show();
				},
				function() {
					$('.header-main-nav-types').hide();
				});
		},
		/**
		 * 搜索字段的获取
		 * **/
		searchKey: function() {
			var _key = this.getQueryString('key');
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
				prev_text: "上一页",
				next_text: "下一页",
				current_page: pageIndex - 1,
				ellipse_text: "...",
				num_edge_entries: 2,
				num_display_entries: 5,
				items_per_page: pageSize,
				callback: pageCallback,
				link_to: "javascript:void(0);"
			});
		},

		endsFun: function(headPage, lastPage, callbackFun) {
			$(".endpoint").unbind().bind("click", function() {
				switch($(this).text()) {
					case "首页":
						callbackFun(headPage - 1);
						//common.pageFun(totalP,headPage-1,pageSize,callbackPageFun);
						break;
					case "尾页":
						callbackFun(lastPage - 1);
						//common.pageFun(totalP,lastPage-1,pageSize,callbackPageFun);
						break;
				}
			});
		},

		//退出登录
		getOutFun: function() {
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
			window.location.href = this.serverBaseUrl + urls.allUrls.outLogin;
		},
		/**
		 * 文件上传
		 * @params {string} id 需要提交的表单id名
		 * @params {function} callBack 回调函数（可选，没有的话默认输出返回信息）
		 * **/
		fileUpload: function(id, callBack) {
			var url = this.serverBaseUrl + "/api/hms/user/uploadToAdd";
			var form = $('#' + id)[0];
			var formData = new FormData(form);
			$.ajax({
				url: url,
				type: 'POST',
				cache: false,
				data: formData,
				processData: false,
				contentType: false,
			}).done(function(r) {
				//callBack(r);
				typeof(callBack) == "function" ? callBack(r): console.log(r);
			}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
				dialog({
					title: '提示',
					modal: true,
					content: "文件上传失败，请重新上传",
					ok: function() {},
					cancel: false,
				}).width(320).show();
			})
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
		}

	};

});