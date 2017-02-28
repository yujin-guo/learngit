define(function() {

	var currentProtocol = window.location.protocol;
	var currentHost = window.location.host;
	var absPrefix = currentProtocol + "//" + currentHost;
	var loginPathPrefix = window.location.pathname.split("/").slice(0, -1).join("/");
	var redirect = encodeURIComponent(absPrefix + loginPathPrefix + "/slo.html?type=hms");
	return {
		allUrls: {
			outLogin: '/sso/logout?redirect=' + redirect, //退出登录
			login: '/api/login', //登录
			getHospitalLogo: "/cms/file/downLoad", //获取医院logo
			getMobileCode: '/api/system/PinRequest', //获取手机验证码
			findPassword: '/api/hms/user/forgetPassword', //找回密码
			getPurcharseList: "/api/order/getPurchaseApplyListFromHMS", //采购清单
			getPurcharseDetail: "/api/order/getPurchaseApplyInfoH", //采购单详情
			getApply: "/api/order/approvePurchaseApply", //审批
			getOrderList: "/api/order/getOrderList", //订单列表
			getOrderInfo: "/api/order/getOrderInfoH", //订单详情
			getStatement: "/api/hms/statement/GetStatements", //结算单列表
			updateAccountStatus: "/api/hms/statement/UpdateStatus", //结算单更新状态
			getStatementDetail: "/api/hms/statement/GetStatementDetail", //结算单详情
			checkoutList:"/api/hms/export/Sysucc",  //导出验收汇总单
			getInvoiceDetail:"/hms/summary/info",  //发票清单（汇总单）详情
			updateInvoiceStatus:"/hms/summary/updateStatus",  //发票清单（汇总单）更新状态
			getMemberList: "/api/hms/user/OrgUserList", //人员管理列表
			getBatchMember: "/api/hms/user/uploadToAdd", //批量导入人员名单
			getMemberDetail: "/api/hms/user/userInfo", //人员详细信息
			updateMember: "/api/hms/user/userUpdate", //修改人员信息
			addMember: "/api/hms/user/userAdd", //增加人员
			updateStatus: "/api/hms/user/updateStatus", //修改人员状态
			loadTemplate: "/api/hms/user/download", //下载人员批量导入模板
			getSuppliers: "/api/hms/supplier/GetSuppliers", //供应商列表
			accreditationAppList: "/hms/accreditation/accreditationAppList", //资质列表
			accreditationAppListSearch: "/hms/accreditation/accreditationAppSearch", //资质查询
			accreditationInfo: "/hms/accreditation/accreditationInfo", //资质详情
			accreditationApprove: "/hms/accreditation/accreditationApprove", //资质提交审核
			updateSupplierStatus: "/api/hms/supplier/UpdateStatus", //供应商变更状态,拉黑、解黑、申请通过、申请驳回
			getSupplierDetails: "/api/hms/supplier/GetSupplierDetail", //供应商详情
			getBrands: "/hms/brand/brandAppList", //品牌列表
			getBrandSearch: "/hms/brand/brandAppSearch", //品牌搜索
			getBrandsInfo: "/hms/brand/brandAppInfo", //查看授权品牌详情
			getBrandAppApproval: "/hms/brand/brandAppApproval", //供应商品牌认证
			initRoles: "/api/hms/role/AccessInfo", //初始化角色权限
			getRoles: "/api/hms/role/GetRoles", //角色管理列表
			getRolesDetail: "/api/hms/role/RoleInfo", //角色信息详情
			editRoles: "/api/hms/role/UpdateRole", //修改角色
			deleteRoles: "/api/hms/role/DelRole", //删除角色
			addRoles: "/api/hms/role/AddRole", //新增角色
			getPersonalDetail: "/api/hms/user/personalCenter", //基本信息
			updateMobile: "/api/hms/user/updateMobile", //修改手机
			updateEmail: "/api/hms/user/updateEmail", //修改邮箱
			updatePass: "/api/hms/user/updatePassword", //修改密码
			getDepartmentList: "/api/hms/department/list", //获取部门列表
			getDepartmentDetail: "/api/hms/department/info", //部门详情
			deleteDepartment: "/api/hms/department/remove", //删除部门
			searchDepartmentMem: "/api/hms/department/members/query", //查询部门内成员
			addDepartment: "/api/hms/department/add", //添加部门
			editDepartment: "/api/hms/department/edit", //修改部门名称/上级部门/负责人新增更换
			deleteMember: "/api/hms/department/members/remove", //删除部门内成员
			addDepMember: "/api/hms/department/members/assign", //新增/编辑部门成员
			inviteEmial: "/api/hms/user/userInvitation", //邮件邀请
			brandStatistic: "/api/product/brand/BrandStats", //品牌统计管理
			suppStatistic: "/api/order/getStatisticsListFSupp", //供应商交易统计
			departmentStatistic: "/api/order/getStatisticsListFD", //课题组交易统计
			statementSummary: "/api/user/statement/StatementSummary", //结算统计
			orderSummary: "/api/order/OrderSummary", //订单统计
			approvalSummary: "/api/order/ApprovalSummary", //审批汇总统计
			applicationSummary: "/api/order/ApplicationSummary", //申请统计
			systemSummary: "/api/hms/logs/login", //系统使用查询
			commentSummary: "/api/product/getProductCommentList", //评价列表统计
			getCardList: "/api/user/getFundCardList", //经费卡列表
			cardStatus: "/api/user/updateFundCardStatus", //启用/禁用经费卡
			addCard: "/api/user/addFundCard", //新增经费卡
			cardDetail: "/api/user/getFundCardInfo", //经费卡详情
			//editCard:"/api/user/updateFundCard",  //编辑经费卡
			deleteCard: "/api/user/deleteFundCard", //删除经费卡
			getNoticeList: "/notice/list", //获取公告列表
			getBidList: "/order/getHMSProcurements", //获取竞价列表
			getBidDetails: "/order/hms/getProcurementInfo", //获取竞价详情
			updateBidStatus: "/order/hms/updateHMSProStatus", //竞价单审批
			cancelBid: "/order/hms/canclePro", //取消竞价单
			newNotice: "/notice/save", //新建公告列表
			updateNotice: "/notice/update", //修改公共详情
			noticeOffline: "/notice/offline/", //公告下线
			noticePublish: "/notice/publish/", //公告发布
			noticeDetail: "/notice/detail/", //获取公告详细信息
			getAptSetup: "/api/approvalConf/getBidApprovalInfo", //获取竞价审批信息
			getPurSetup:"/api/approvalConf/getPurchaseApprovalInfo",  //获取采购审批信息
			saveAptSetup: "/api/approvalConf/setPurchaseApproval", //保存采购配置信息
			columnlist: "/column/list", //栏目列表
			columnlistNotPage: "/column/columnlist", //栏目列表不分页
			columnDetail: "/column/detail/", //获取栏目详情
			columnAdd: "/column/add", //新建栏目
			updateColumn: "/column/update", //修改栏目信息
			deleteColumn: "/column/delete/", //删除栏目
			getColumnList: "/column/getlist" //获取上级栏目列表
		}
	};
});