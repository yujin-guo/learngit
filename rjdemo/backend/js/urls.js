define(function() {

	var currentProtocol = window.location.protocol;
	var currentHost = window.location.host;
	var absPrefix = currentProtocol + "//" + currentHost;
	var loginPathPrefix = window.location.pathname.split("/").slice(0, -1).join("/");
	var redirect = encodeURIComponent(absPrefix + loginPathPrefix + "/slo.html?type=oms");
	return {
		allUrls: {
			outLogin: '/sso/logout?redirect=' + redirect, //退出登录
			login: '/api/login', //登录
			getHospitalLogo: "/cms/file/downLoad", //获取医院logo
			getMobileCode: '/api/system/PinRequest', //获取手机验证码
			findPassword: '/api/hms/user/forgetPassword', //找回密码
			getApply: "/api/order/approvePurchaseApply", //审批
			getSuppliers: "/api/hms/supplier/GetSuppliers", //供应商列表
			suppList: "/supplier/list", //oms供应商列表
			accreditationAppListSearch: "/hms/accreditation/accreditationAppSearch", //资质查询
			accreditationInfo: "/supplier/detail", //供应商资质详情
			accreditationApprove: "/supplier/approval", //供应商资质提交审核
			updateSupplierStatus: "/supplier/blacklist", //供应商变更状态,拉黑、解黑、申请通过、申请驳回
			getSupplierDetails: "/api/hms/supplier/GetSupplierDetail", //供应商详情
			initRoles: "/api/hms/role/AccessInfo", //初始化角色权限
			updatePass: "/api/hms/user/updatePassword", //修改密码
			inviteEmial: "/api/hms/user/userInvitation", //邮件邀请
			getNoticeList: "/notice/list", //获取公告列表
			newNotice: "/notice/save", //新建公告列表
			updateNotice: "/notice/update", //修改公共详情
			noticeOffline: "/notice/offline/", //公告下线
			noticePublish: "/notice/publish/", //公告发布
			noticeDetail: "/notice/detail/", //获取公告详细信息
			getAptSetup: "/api/order/getAptSetup", //获取验收列表
			saveAptSetup: "/api/order/saveOrUpdateAptSetup", //保存验收方式
			columnlist: "/column/list", //栏目列表
			columnlistNotPage: "/column/columnlist", //栏目列表不分页
			columnDetail: "/column/detail/", //获取栏目详情
			columnAdd: "/column/add", //新建栏目
			updateColumn: "/column/update", //修改栏目信息
			deleteColumn: "/column/delete/", //删除栏目
			getColumnList: "/column/getlist", //获取上级栏目列表
			getBrands: "/suppbrand/list", //品牌列表
			getBrandSearch: "/hms/brand/brandAppSearch", //品牌搜索
			getBrandsInfo: "/suppbrand/detail/", //查看授权品牌详情
			getBrandAppApproval: "/suppbrand/approval", //供应商品牌审批
			getHospitalList:"/organizations/list",  //医院信息管理
			updateHospital:"/organizations/saveorupdate",  //修改、新增医院
			getHospitalDetail:"/organizations/detail",  //医院详情
			hospitalPublish:"/organizations/publish",  //医院上线
			images:"/file/downLoad?id=",  //图片拼接地址
			suppStatistic:"/statistics/supplier/summary",  //供应商交易统计（上部分）
			suppStatisticList:"/statistics/supplier/list",  //供应商交易统计（列表）
			suppStatisticDetail:"/statistics/supplier/detail/",  //供应商交易明细（上部分）
			suppStatisticListDetail:"/statistics/supplier/detail/",  //供应商交易明细（列表）
			hospitalStatistic:"/statistics/summary",  //医院交易统计（上部分）
			hospitalStatisticList:"/statistics/statisticsByType",  //医院交易统计（列表）
			hospitalList:"/statistics/supplier/org",  //医院列表
			hospitalRank:"/statistics/ranking/organization",  //医院排行
			hosConfigList:"/sys/config/list",  //医院配置列表
			hosCtrSubmit:"/sys/config/saveOrUpdate",  //新增、修改医院配置
			hosCtrDetail:"/sys/config/detail/",  //医院审批详情
			hosEnabled:"/sys/config/enabled"  //医院禁用、启用
			
		}
	};
});