/**
 * Created by liumin on 2016/7/11.
 */
define(['jquery'], function($) {
	var LOGIN_IFRAME_CLASS = "__sso_iframe__";
	// 提供服务
	return {
		//分页条数
		pageSize: 20,
		//服务器地址（跨域）
		serverBaseUrl: "/store",
		bidBaseUrl: "/bid",

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
				//timeout: 20000,
				beforeSend: function() {
					$('body').append("<span class='loading-gif' id='loading-gif'><img src='style/images/loading.gif' /></span>");
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
					/*,
									error: function(XMLHttpRequest, textStatus, errorThrown) {
										if(XMLHttpRequest.statusText == "timeout") {
											that.getOutFun();
										}
									}*/
			});
		},
		/**
		 * 请求方法
		 * @param {string} url 请求的url
		 * @param {json} params 传入的参数
		 * @param {function} callBack 回调方法
		 * @param {Boolean}isJson 是否为json格式
		 * **/
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
				timeout: 1000,
				beforeSend: function() {
					$('body').append("<span class='loading-gif' id='loading-gif'><img src='style/images/loading.gif' /></span>");
				},
				success: function(r) {
					if(retry) {
						that.retryIfNotLoggedInOtherwiseCallback(r, url, params, callBack, isJson, retryPredicate, 'get');
					} else {
						callBack(r);
					}
				},
				complete: function() {
					$(".loading-gif").remove();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if(XMLHttpRequest.statusText == "timeout") {
						$.cookie('id', '', {
							path: '/'
						});
						$.cookie('username', '', {
							path: '/'
						});
						window.location.href = that.serverBaseUrl + urls.allUrls.outLogin;
					}
					//window.location.href="404.html";
				}
			});
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
		//另一种分页样式
		pageFun2: function(totalNum, pageIndex, pageSize, pageCallback) {
			$("#pagination2").pagination(totalNum, {
				prev_text: "&lt;",
				next_text: "&gt;",
				prev_show_always: false,
				next_show_always: false,
				current_page: pageIndex - 1,
				ellipse_text: "...",
				num_edge_entries: 2,
				num_display_entries: 5,
				items_per_page: pageSize,
				callback: pageCallback,
				link_to: "javascript:void(0);"
			});
		},
		//js时间戳转为本地时间格式
		getLocalTime: function(now) {
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var date = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			hour = (hour < 10 ? "0" + hour : hour);
			minute = (minute < 10 ? "0" + minute : minute);
			second = (second < 10 ? "0" + second : second);
			return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
		},
		//文件上传
		fileUpload: function(id, callBack) {
			var url = this.serverBaseUrl + "/api/common/file/Upload";
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
		//新建竞价单时上传附件
		UploadFile: function(id, callBack) {
			var url = this.bidBaseUrl + "/file/upload";
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

		//菜单栏tab选中
		tabFocus: function(text) {
			$(".left-nav .home-active").removeClass("home-active").addClass("hover-flag");
			var $tab = $("a:contains(" + text + ")");
			$tab.parents(".next-ul-nav").prev("a").removeClass("my-price-icon1").addClass("my-price-icon2");
			$tab.parents(".next-ul-nav").addClass("show");
			$tab.addClass("home-active").removeClass("hover-flag");
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
			$.cookie("vm", '', {
				path: "/"
			});
			window.location.href = this.serverBaseUrl + urls.allUrls.outLogin;
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

		/*超过指定字数显示‘...’
		 
		 * {cname}  类名  
		 * wordlength  限制字符数
		 * */
		wordlimitFun: function(cname, wordlength) {
			var cname = document.getElementsByClassName(cname);
			for(var i = 0, len = cname.length; i < len; i++) {
				var nowLength = cname[i].innerHTML.trim().length,
					nowWord = cname[i].innerHTML.trim();
				if(nowLength > wordlength) {
					cname[i].innerHTML = nowWord.substr(0, wordlength - 1) + '...';
				}
			}　
		}
	}

});