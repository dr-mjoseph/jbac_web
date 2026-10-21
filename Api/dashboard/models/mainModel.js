 var sqldb = require('../../config/dbconnect');
var dbutil = require(appRoot + '/utils/dbutils');
var moment = require('moment');
//single start
exports.getdashotpMdl = function (data, callback) {
	var cntxtDtls = "in getdashotpMdl";
	var QRY_TO_EXEC = `select * from users  where d_in = '0' and number = '${data.number}' ; `
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.addOtpMdl = function (otp, number, callback) {
	var cntxtDtls = "in addOtpMdl";
	var QRY_TO_EXEC = `update  users set otp = '${otp}'   where d_irn = '0' and number = '${number}' ; `

	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.checkUserExistMdl = function (number, usr_pwd, callback) {
	var cntxtDtls = "in checkUserExistMdl";
	var QRY_TO_EXEC = ` SELECT * from users where number ='${number}' and otp ='${usr_pwd}' and d_in <> 1;`;

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getUserDataMdl = function (user_id, callback) {
	var cntxtDtls = "in getUserDataMdl";
	var QRY_TO_EXEC = `SELECT mm.* from main_modules as mm join permissions as ps on mm.id=ps.module_id  where ps.user_id ='${user_id}' and ps.d_in <> 1 and mm.d_in=0 group by  ps.module_id    ;
	SELECT mm.* from sub_modules as mm join permissions as ps on mm.id=ps.sub_module_id  where ps.user_id ='${user_id}' and ps.d_in <> 1 and mm.d_in=0 order by module_order  ;
	`;
	// 
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.deleteUsersMdl = function (id, callback) {
	var cntxtDtls = "in deleteUsersMdl";
	var QRY_TO_EXEC = `update  users set d_in = 1   where id  = '${id}' ; `

	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.addUsersMdl = function (user, callback) {
	var cntxtDtls = "in addUsersMdl";
	var QRY_TO_EXEC = ` insert into users (name, number,email) 
	values( '${user.name}', '${user.number}', '${user.email}') ;`;

	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.globalGetMdl = function (tablename, callback) {
	var cntxtDtls = "in globalGetMdl";
	var QRY_TO_EXEC = ' select * from ' + tablename + ' where d_in = 0 order by id desc'
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getUserPermissionsMdl = function (callback) {
	var cntxtDtls = "in getUserPermissionsMdl";
	var QRY_TO_EXEC = `SELECT * from users  WHERE  users.d_in = 0`
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.getModulesMdl = function (id, callback) {
	var cntxtDtls = "in getModulesMdl";

	var QRY_TO_EXEC = `SELECT * from main_modules WHERE  d_in = 0; SELECT * from sub_modules  WHERE  d_in = 0; SELECT * from permissions  WHERE  d_in = 0 and user_id = '${id}' ;
	SELECT ps.*, ss.title FROM permissions as ps join sub_modules as ss on ps.sub_module_id = ss.id where ps.user_id = '${id}' and ps.d_in = 0`;

	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.submitpermissionsMdl = function (persdata, callback) {
	var cntxtDtls = "in submitpermissionsMdl";
	var QRY_TO_EXEC = '';
	persdata.permissions.map(res => {
		var sub_sq = ` insert into permissions (user_id, module_id, sub_module_id) values( '${persdata.usr_id}', '${res.main_id}', '${res.id}') ;`;
		QRY_TO_EXEC = QRY_TO_EXEC + sub_sq;
	})


	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.deletePermissionsMdl = function (data, callback) {
	var cntxtDtls = "in deletePermissionsMdl";
	var QRY_TO_EXEC = '';
	var sub_que = '';
	data.map(respo => {
		sub_que = `update  permissions set d_in = 1   where id  = '${respo.id}' ; `
		QRY_TO_EXEC = QRY_TO_EXEC + sub_que;
	})


	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
//single end

// user permission start
exports.getmodulelistdetailsMdl = function (usr_id, callback) {
	var cntxtDtls = "in getmodulelistdetailsMdl";
	var QRY_TO_EXEC = `SELECT CASE
    WHEN user_id IS NOT null  THEN 'true'
    WHEN user_id IS null  THEN 'false'
    ELSE 'false'
END as check_sub_menu, user_id,sm.id,sm.module_id,m.title as module_nm,sm.path,sm.icon,sm.title,sm.id,m.icon,p.d_in,
        CASE
            WHEN user_id IS NULL THEN 0
            ELSE 1
        END AS check_sub_menu,module_order
        FROM sub_modules as sm
        JOIN main_modules as m ON sm.module_id = m.id
        left JOIN  (SELECT * from permissions WHERE user_id=${usr_id}) as p  ON p.sub_module_id=sm.id
        WHERE sm.d_in=0 order by sm.module_id`;

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.userpermissiondatactrlmd1 = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in userpermissiondatactrlmd1";

	var QRY_TO_EXEC = `SELECT l.id,name,l.number,GROUP_CONCAT(DISTINCT m.title) AS module_nm, COUNT(m.title) as mcnt, GROUP_CONCAT(sm.title) AS sub_menu 
FROM permissions as p 
JOIN sub_modules AS sm ON p.sub_module_id = sm.id 
JOIN main_modules AS m ON p.module_id = m.id 
JOIN users as l ON l.id = p.user_id 
where p.d_in=0 and l.d_in=0 and m.d_in=0 
GROUP BY p.user_id ORDER BY mcnt,l.id`;

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getemployeelistdataMdl = function (callback) {
	var cntxtDtls = "in getemployeelistdataMdl";
	var QRY_TO_EXEC = `SSELECT * FROM users WHERE d_in=0 order by name`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postusermenulistMdl = function (data, module_id, usr_id, callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in postusermenulistMdl";
	var QRY_TO_EXEC2 = `DELETE FROM permissions WHERE user_id = ${usr_id};`;


	if (callback && typeof callback == "function") {

		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC2, cntxtDtls, function (err, results1) {
			// 			callback(err, results);

			var QRY_TO_EXEC = `insert into permissions (user_id, module_id, sub_module_id) values ? `;

			dbutil.execinsertQuerys(sqldb.MySQLConPool, QRY_TO_EXEC, data, cntxtDtls, function (err, results) {
				callback(err, results);
				return;
			});

			// 			return;
		});



	}
	else
		return dbutil.execQuerys(sqldb.MySQLConPool, QRY_TO_EXEC, data, cntxtDtls);
};
// user permission end




//Analysis

exports.getusersanalysisMdl = function (callback) {
	var cntxtDtls = "in  getusersanalysisMdl";
	var QRY_TO_EXEC = `select(select count(id) from customer_dtl_t where d_in='0') as tot_users, 
  (select count(id) from customer_dtl_t where d_in='0' and gender='Male') as male_users,
  (select count(id) from customer_dtl_t where d_in='0' and gender='Female') as female_users`;

	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			//(err);
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.toatlcntsordersMdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in toatlcntsordersMdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from pastor_reg where d_in='0') as total_orders, (select count(*) from pastor_reg where DATE(i_ts)=CURRENT_DATE() and d_in='0') as current_orders, (SELECT COUNT(*) FROM pastor_reg WHERE d_in=0 AND DATE(i_ts) >= (NOW() - INTERVAL 7 DAY) ORDER BY i_ts DESC) as seven_amount, (SELECT COUNT(*) FROM pastor_reg WHERE d_in=0 AND DATE(i_ts) >= (NOW() - INTERVAL 30 DAY) ORDER BY i_ts DESC) as thirty_amount;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.toatlcntstudentsordersDataMdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in toatlcntstudentsordersDataMdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from student_reg where d_in='0') as total_orders, (select count(*) from student_reg where DATE(i_ts)=CURRENT_DATE() and d_in='0') as current_orders, (SELECT COUNT(*) FROM student_reg WHERE d_in=0 AND DATE(i_ts) >= (NOW() - INTERVAL 7 DAY) ORDER BY i_ts DESC) as seven_amount, (SELECT COUNT(*) FROM student_reg WHERE d_in=0 AND DATE(i_ts) >= (NOW() - INTERVAL 30 DAY) ORDER BY i_ts DESC) as thirty_amount;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.toatlcntbelieversDataMdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in toatlcntbelieversDataMdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from signup_form where d_in='0') as total_orders, (select count(*) from signup_form where DATE(cts)=CURRENT_DATE() and d_in='0') as current_orders, (SELECT COUNT(*) FROM signup_form WHERE d_in=0 AND DATE(cts) >= (NOW() - INTERVAL 7 DAY) ORDER BY cts DESC) as seven_amount, (SELECT COUNT(*) FROM signup_form WHERE d_in=0 AND DATE(cts) >= (NOW() - INTERVAL 30 DAY) ORDER BY cts DESC) as thirty_amount;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.toatlchurchcntsordersmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in toatlchurchcntsordersmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from 	church_reg where d_in='0'and churchtype='Ministry') as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.toatlcntsindchurchmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in toatlcntsindchurchmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from church_reg where d_in='0'and churchtype='Independentchurch') as total_orders`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.toatlreggchurchcountsmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in toatlreggchurchcountsmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from church_reg where d_in='0') as total_orders`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.totalpastordistcntmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in totalpastordistcntmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from pastor_reg where d_in='0' and leadership='YES' and leadertype='1' and generaltype='1' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.ministry_cntsmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in ministry_cntsmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from 	ministry_signup where d_in='0') as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.attackas_cntsmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in attackas_cntsmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from 	attacks where d_in='0') as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.jobs_cntsCtrlmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in jobs_cntsCtrlmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from 	jobs where d_in='0') as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.marriages_cuntssCtrlmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in marriages_cuntssCtrlmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from 	marriages where d_in='0') as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.attacks_cuntsCtrlmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in attacks_cuntsCtrlmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from 	attacks where d_in='0') as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.institutes_cuntsCtrlmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in institutes_cuntsCtrlmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from 	institutes where d_in='0') as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.totalcountsMdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in totalcountsMdl";
	var QRY_TO_EXEC = `SELECT p.*,DATE_FORMAT(p.order_date,"%d/%m/%Y") as dated,CASE
    WHEN p.payment_type = 'COD' THEN 'Cash'
    WHEN p.payment_type = 'Online' THEN 'Online'
    ELSE 'None'
END AS payment_mode  FROM order_dtl_t as p where p.d_in='0' order by p.id desc`;

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.topfiveItemsMdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in topfiveItemsMdl";
	var QRY_TO_EXEC = `SELECT count(o.id) as cnt,o.item_nm,o.item_img1 FROM order_items_dtl_t as o  GROUP by o.item_id order by cnt desc limit 5`;

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};




// mis reports start
exports.getExpandDataMdl = function (callback) {
	var cntxtDtls = "in getExpandDataMdl";
	var QRY_TO_EXEC = `SELECT * from expand  WHERE  d_in = 0  order by id desc;`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.addExpandMdl = function (expandData, callback) {
	var cntxtDtls = "in addExpandMdl";
	var dat = new Date();
	var date = dat.getDay - dat.getMonth - dat.getFullYear;
	var today = moment().format('YYYY-MM-DD');
	var QRY_TO_EXEC = ` insert into expand (username, userid, expandfor, expendtype, expandamount, remarks, date, user_id, cts)
	 values( '${expandData.name.username}', '${expandData.name.userid}', '${expandData.expandfor}',
		  '${expandData.expendtype}', '${expandData.expandamount}', '${expandData.remarks}', '${today}', '${expandData.user_id}', '${expandData.cts}') ; `;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.getAccountMdl = function (callback) {
	var cntxtDtls = "in getAccountMdl";

	var date = new Date()

	var QRY_TO_EXEC = `SELECT (SELECT COALESCE(sum(grand_total),0) FROM order_dtl_t) as total, 
	(SELECT COALESCE(sum( grand_total), 0) FROM order_dtl_t WHERE DATE(order_date) = CURDATE() ) as today ,
	(SELECT COALESCE(sum(grand_total), 0) FROM order_dtl_t WHERE week(order_date) = week(now()) ) as weekly, 
	(SELECT COALESCE(sum(grand_total), 0) FROM order_dtl_t WHERE month(order_date) = month(curdate()) ) as monthly FROM order_dtl_t LIMIT 1;

	SELECT (SELECT COALESCE(sum(expandamount), 0) FROM expand WHERE d_in = 0) as total, 
	(SELECT COALESCE(sum(expandamount), 0) FROM expand WHERE DATE(date) = CURDATE() and d_in = 0) as today ,
	(SELECT COALESCE(sum(expandamount), 0) FROM expand WHERE week(date) = week(now()) and d_in = 0) as weekly, 
	(SELECT COALESCE(sum(expandamount), 0) FROM expand WHERE month(date) = month(curdate()) and d_in = 0) as monthly FROM expand LIMIT 1;  `;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.datewiseExpandMdl = function (ind, callback) {
	var cntxtDtls = "in datewiseExpandMdl";


	if (ind == 1) {
		var QRY_TO_EXEC = `SELECT sum(grand_total) as amount, order_date  as date  FROM order_dtl_t group by order_date  ;
        SELECT sum(expandamount) as expandamount, date  FROM expand group by date `;
	}
	if (ind == 0) {
		var QRY_TO_EXEC = `SELECT sum(grand_total) as amount, order_date  as date  FROM order_dtl_t WHERE DATE(order_date ) = CURDATE() group by order_date  ;
        SELECT sum(expandamount) as expandamount, date  FROM expand WHERE DATE(date) = CURDATE() group by date `;
	}
	if (ind == 2) {
		var QRY_TO_EXEC = `SELECT sum(grand_total) as amount, order_date  as date  FROM order_dtl_t  WHERE week(order_date ) = week(now()) group by order_date  ;
        SELECT sum(expandamount) as expandamount, date  FROM expand  WHERE week(date) = week(now()) group by date `;
	}
	if (ind == 3) {
		var QRY_TO_EXEC = `SELECT sum(grand_total) as amount, order_date  as date  FROM order_dtl_t  WHERE month(order_date ) = month(curdate()) group by order_date  ;
        SELECT sum(expandamount) as expandamount, date  FROM expand  WHERE month(date) = month(curdate()) group by date `;
	}
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.getEnquiryMdl = function (callback) {
	var cntxtDtls = "in getEnquiryMdl";
	var QRY_TO_EXEC = `SELECT * from call_enquiry  WHERE  d_in = 0 order by id desc;`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.addEnquiryMdl = function (enquirydata, callback) {
	var cntxtDtls = "in addEnquiryMdl";
	var QRY_TO_EXEC = ` insert into call_enquiry (name, number, remarks) values( '${enquirydata.name}', '${enquirydata.number}', '${enquirydata.remarks}') ; `;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.deleteEnquiryMdl = function (id, callback) {
	var cntxtDtls = "in deleteEnquiryMdl";

	var QRY_TO_EXEC = `update call_enquiry set d_in = 1  WHERE  id = '${id}' ;`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
// mis reports end


exports.getaboutwebsiteMdl = function (id, callback) {
	var cntxtDtls = "in getaboutwebsiteMdl";
	var QRY_TO_EXEC = `SELECT * FROM about_tbl where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.submiteventMdl = function (data, callback) {
	var cntxtDtls = "in submiteventMdl";
	var QRY_TO_EXEC = `insert into signup(name,mail,mobilenumber,password,retypepassword,category,categoryid)  values('${data.name}','${data.mail}','${data.mobilenumber}','${data.password}','${data.retypepassword}','${data.category}','${data.categoryid}') `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};





exports.checkloginwebsitenumbermdl = function (data, callback) {
	var cntxtDtls = "in checkloginwebsitenumbermdl";
	 if (data.category == 1) {
           	var QRY_TO_EXEC = `select id from signup_form where mobile_number ='${data.mobile_number}'and d_in=0`;
          } else if (data.category == 2) {
            	var QRY_TO_EXEC = `select id from student_reg where number ='${data.mobile_number}'and d_in=0`;
          } else if (data.category == 3) {
           	var QRY_TO_EXEC = `select id from ministry_signup where headnmber ='${data.mobile_number}'and d_in=0`;
          } else if (data.category == 4) {
          	var QRY_TO_EXEC = `select id from pastor_reg where phonenumber ='${data.mobile_number}'and d_in=0`;
          } else if (data.category == 5) {
           	var QRY_TO_EXEC = `select id from church_reg where contactnumber ='${data.mobile_number}'and d_in=0`;
          } else if (data.category == 6) {
          	var QRY_TO_EXEC = `select id from independentorganisation_reg where contact_num ='${data.mobile_number}'and d_in=0`;
          } else if (data.category == 7) {
          	var QRY_TO_EXEC = `select id from pastors_associations where phonenumber ='${data.mobile_number}'and d_in=0`;
          }
	
// 	var QRY_TO_EXEC = `select id from signup where mobilenumber ='${data.mobile_number}'and d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.passwordwebsiteloginmdl = function (data, callback) {
    console.log(data)
	var cntxtDtls = "in passwordwebsiteloginmdl";
		 if (data.category == 1) {
           	var QRY_TO_EXEC = `select * ,fname as name  from signup_form where mobile_number ='${data.mobile_number}'and password = '${data.password}'`;
          } else if (data.category == 2) {
            var QRY_TO_EXEC = `select * ,studentname as name  from student_reg where number ='${data.mobile_number}'and password = '${data.password}'`;
          } else if (data.category == 3) {
           	var QRY_TO_EXEC = `select * ,ministryname as name from ministry_signup where headnmber ='${data.mobile_number}'and password = '${data.password}'`;
          } else if (data.category == 4) {
          	var QRY_TO_EXEC = `select * ,pastorname as name from pastor_reg where phonenumber ='${data.mobile_number}'and password = '${data.password}'`;
          } else if (data.category == 5) {
           	var QRY_TO_EXEC = `select * ,church_name as name from church_reg where contactnumber ='${data.mobile_number}'and password = '${data.password}'`;
          } else if (data.category == 6) {
          	var QRY_TO_EXEC = `select * ,organisation_name as name from independentorganisation_reg where contact_num ='${data.mobile_number}'and password = '${data.password}'`;
          }else if (data.category == 7) {
          	var QRY_TO_EXEC = `select * ,paname as name from pastors_associations where phonenumber ='${data.mobile_number}'and password = '${data.password}'`;
          }
       console.log(QRY_TO_EXEC); 
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}



exports.getupdatesMdl = function (id, callback) {
	var cntxtDtls = "in getupdatesMdl";
	var QRY_TO_EXEC = `SELECT * FROM events  WHERE d_in=0 and enddate >= CURRENT_DATE() ORDER BY startdate,enddate`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



exports.denomationMdl = function (id, callback) {
	var cntxtDtls = "in denomationMdl";
	var QRY_TO_EXEC = `SELECT * FROM churchdenomation where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.leaderlevelMdl = function (id, callback) {
	var cntxtDtls = "in leaderlevelMdl";
	var QRY_TO_EXEC = `SELECT * FROM leaderlevel where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.educationMdl = function (id, callback) {
	var cntxtDtls = "in educationMdl";
	var QRY_TO_EXEC = `SELECT * FROM education where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

// exports.patternMdl = function (id, callback) {
// 	var cntxtDtls = "in patternMdl";
// 	var QRY_TO_EXEC = `SELECT * FROM pattern_table where d_in=0`;
// 	if (callback && typeof callback == "function") {
// 		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
// };



exports.getdistrictsMdl = function (id, callback) {
	var cntxtDtls = "in getdistrictsMdl";
	var QRY_TO_EXEC = `SELECT * FROM dstrct where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getmandalsMdl = function (id, callback) {
	var cntxtDtls = "in getmandalsMdl";
	var QRY_TO_EXEC = `SELECT * FROM mndls_lst_t where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.gepanchayatiMdl = function (id, callback) {
	var cntxtDtls = "in gepanchayatiMdl";
	var QRY_TO_EXEC = `SELECT * FROM pnchyt_lst_t where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.getbeliversMdl = function (data, callback) {
	var cntxtDtls = "in getbeliversMdl";
	var QRY_TO_EXEC = `SELECT id,fname,lname FROM signup_form where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getservicesMdl = function (id, callback) {
	var cntxtDtls = "in getservicesMdl";
	var QRY_TO_EXEC = `SELECT * FROM services where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.checkserviceMdl = function (i, callback) {
	var cntxtDtls = "in checkserviceMdl";
	var QRY_TO_EXEC = ` select * from  services where servicename='${i.service_name}' and d_in =0`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.addNewpageMdl = function (proofdata, callback) {
	var cntxtDtls = "in addNewpageMdl";
	var QRY_TO_EXEC = ` insert into services(servicename) values ( '${proofdata.service_name}')`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getconsistencysMdl = function (id, callback) {
	var cntxtDtls = "in getconsistencysMdl";
	var QRY_TO_EXEC = `SELECT * FROM const_dtl_t where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getchurchMdl = function (id, callback) {
	var cntxtDtls = "in getchurchMdl";
	var QRY_TO_EXEC = `SELECT * FROM church_reg where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getpastorMdl = function (id, callback) {
	var cntxtDtls = "in getpastorMdl";
	var QRY_TO_EXEC = `SELECT id,pastorname FROM pastor_reg where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postmeetingsMdl = function (data, img_links, callback) {
	var cntxtDtls = "in postmeetingsMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	console.log(data)
	var QRY_TO_EXEC = `insert into events(eventname,orgname,meetsize,description,startdate,enddate,starttime,endtime,district_id,constituency_id,mandal_id,panchayat_id,image,speaker1,speaker2,speaker3,speaker4,phone,eventcontactnumber,address,location,facebook,youtube,denomation_id,ministry_id , peoplecount,cts)  values('${data.mettingtype}','${data.orgname}','${data.meetsize}','${data.description}','${data.fromdate}','${data.todate}','${data.fromtime}','${data.totime}','${data.districtname}','${data.constituencyname}','${data.mandals}','${data.village_name}','${img_links}','${data.speakerone}','${data.speakertwo}','${data.speakerthree}','${data.speakerfour}','${data.orgphone}','${data.evntphone}','${data.address}','${data.location}','${data.facebook}','${data.youtube}','${data.denomation}','${data.ministry_id}','${data.peoplecount}','${date}')`;
	console.log(QRY_TO_EXEC);
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

// passing userid, mobile number, name
// exports.postmeetingsMdl = function (data, img_links, callback) {
// 	var cntxtDtls = "in postmeetingsMdl";
// 	var QRY_TO_EXEC = `insert into events(eventname,description,startdate,enddate,starttime,endtime,district_id,constituency_id,mandal_id,panchayat_id,image,speaker1,speaker2,speaker3,speaker4,user_id,eventcontactnumber,address,location,facebook,youtube,denomation_id,ministry_id)  values('${data.mettingtype}','${data.description}','${data.fromdate}','${data.todate}','${data.fromtime}','${data.totime}','${data.districtname}','${data.constituencyname}','${data.mandals}','${data.village_name}','${img_links}','${data.speakerone}','${data.speakertwo}','${data.speakerthree}','${data.speakerfour}','${data.usr_id}','${data.mobile_number}','${data.address}','${data.location}','${data.facebook}','${data.youtube}','${data.denomation}','${data.ministry_id}')`;
// 	if (callback && typeof callback == "function") {
// 		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
// };

exports.postchurchmeetingsMdl = function (data, callback) {
	var cntxtDtls = "in postchurchmeetingsMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into church_timings(service_id,church_id,day,starttime,endtime,user_id,user_phn,user_name,descriptions,district_id,constituency_id,mandal_id,village_id,cts)  values('${data.service_name}','${data.church}','${data.day}','${data.time_start}','${data.time_end}','${data.usr_id}','${data.mobile_number}','${data.name}','${data.description}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postinsututiesMdl = function (data, imageupload, callback) {
	var cntxtDtls = "in postinsututiesMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into institutes(institutename,college_type,course_offered,district_id,constituency_id,mandal_id,panchayat_id,phonenumber,facebook,youtube,ministry,ministry_id,cts)
	values('${data.institutename}','${data.collegetype}','${data.courses}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}'
	,'${data.phonenumber}','${data.facebook}','${data.youtube}','${data.ministry}','${data.ministry_id}','${date}' )`;
	console.log(QRY_TO_EXEC);
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

// exports.postinsututies_Mdl = function (data, callback) {
// 	var cntxtDtls = "in postinsututies_Mdl";
// 	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
// 	var QRY_TO_EXEC = `insert into institutes(believer_id,pastor_id,institutename,location,address,college_type,course_offered,district_id,constituency_id,mandal_id,panchayat_id,phonenumber,posted_id,postedbynumber,facebook,youtube,term ,ministry,ministry_id,cts)
// 	values('${data.believer_id}','${data.pastor_id}','${data.institutename}','${data.location}','${data.address}','${data.collegetype}','${data.courses}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}'
// 	,'${data.phonenumber}','${data.usr_id}','${data.number}','${data.facebook}','${data.youtube}','${data.term}','${data.ministry}','${data.ministry_id}',,'${date}' )`;
// 	if (callback && typeof callback == "function") {
// 		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
// };

exports.postcollegesMdl = function (data, callback) {
	var cntxtDtls = "in postcollegesMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into colleges(collegename,image,location,church_id,address,district_id,constituency_id,mandal_id,village_id,phonenumber,user_id,cts) values('${data.collegename}','${data.image}','${data.location}','${data.church}','${data.address}','${data.districtname}','${data.constituencyname}','${data.mandals}','${data.village_name}','${data.phonenumber}','${data.usr_id}','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};






exports.postjobsMdl = function (data, img_links, callback) {
	var cntxtDtls = "in postjobsMdl";
		var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	//var QRY_TO_EXEC = `insert into jobs(jobtitle,qualification,experience_type,experience,salary,workinglocation,contactnumber,contactnumber2,description,believerorpaster_id,believerorpastor,phonenumber,district_id,constituency_id,mandal_id,panchayat_id,google_location,image,i_ts) values('${data.jobname}','${data.qualification}','${data.experience}','${data.salary}','${data.location}','${data.number1}','${data.number2}','${data.description}','${data.usr_id}','${data.name}','${data.mobile_number}','${data.districtname}','${data.constituencyname}','${data.mandals}','${data.village_name}','${data.google_location}','${img_links}','${date}')`;
	var QRY_TO_EXEC = `insert into jobs(jobtitle,qualification,experience_type,experience,salary,age,contactnumber,description,district_id,constituency_id,mandal_id,panchayat_id,google_location,i_ts) values('${data.jobname}','${data.qualification}','${data.experience_t}','${data.experience}','${data.salary}','${data.location}','${data.number1}','${data.description}','${data.districtname}','${data.constituencyname}','${data.mandals}','${data.village_name}','${data.google_location}','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

//////////////////////////////////////////////////////////////////////////Login




exports.postbeliversignupMdl = function (data, callback) {
	var cntxtDtls = "in postbeliversignupMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into signup_form(fname,lname,dob,gender,email,mobile_number,caste,nativeplace,talent,education,designation,dpartment,youtube,
	income,status,password,retypepassword,district_id,constituency_id,mandal_id,panchayat_id,church_id,pastor_id,leadership,leadertype,generaltype,wingtype,wardnumber,whatsapp,villagename,denomination_id,hobbies,spirti,lifegoal,wingtypes,livingfrom,god,term,subward,subcaste,from_signup,cts)  
	values('${data.fname}','${data.lname}','${data.dob}','${data.gender}','${data.email}','${data.mobile_number}','${data.caste}','${data.nativeplace}','${data.talent}','${data.education}','${data.designation}','${data.dpartment}','${data.youtube}','${data.income}','${data.status}','${data.password}','${data.retypepassword}','${data.districts
		}','${data.constituencyname}','${data.mandals}','${data.panchayati}','${data.church}','${data.pastor}','${data.leadership}','${data.leadertype}','${data.generaltype}','${data.wingtype}','${data.wardnumber}','${data.whatsapp}','${data.villagename}','${data.denomination_id}','${data.hobbies}','${data.spirti}','${data.lifegoal}','${data.wingtypes}','${data.nri}','${data.god}','${data.term}','${data.subward}','${data.subcaste}','1','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postMaindata = function (name, id, lastid, data, callback) {
	var cntxtDtls = "in postMaindata";
	var QRY_TO_EXEC = `insert into signup(usr_id,name ,mail ,mobilenumber,password,category,categoryid) values('${lastid}','${data.fname}','${data.email}','${data.mobile_number}','${data.password}','${name}','${id}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

// exports.studentsigniupMdl = function (data, callback) {
//     const cntxtDtls = "in studentsigniupMdl";
//     const date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");

//     const QRY_TO_EXEC = `
//         INSERT INTO student_reg (
//             studentname, number, parentnum, pastornum, group_branch, takecarer, sstatus,
//             finanstat, caste, schname, totmarks, maxmarks, exampass, eamcet, choosing_course,
//             talent, district_id, constituency_id, mandal_id, village_id, 
//             aboutyourself, leadership, generaltype, i_ts, dob, denomination_id, hobbies, spirti, lifegoal, wardnumber, villagename, respanchayati, resmandals, resconstituencyname,
//             resdistricts, god, subcaste, gender
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//         data.studentname, data.number, data.parentnum, data.pastornum, data.study,
//         data.fathername, data.sstatus, data.finanstat, data.caste, data.schname,
//         data.tmarks, data.mmarks, data.passexam, data.mother, data.orphon, data.talent,
//         data.district_id, data.constituency_id, data.mandal_id, data.village_id,
//         data.aboutyourself, data.leadership, data.generaltype, date, data.dob,
//         data.denomination_id, data.hobbies, data.spirti, data.lifegoal, 
//         data.wardnumber, data.villagename, data.respanchayati, data.resmandals,
//         data.resconstituencyname, data.resdistricts, data.god, data.subcaste, data.gender
//     ];

//     if (callback && typeof callback === "function") {
//         dbutil.execQuery(sqldb.MySQLConPool, { sql: QRY_TO_EXEC, values }, cntxtDtls, callback);
//     } else {
//         return dbutil.execQuery(sqldb.MySQLConPool, { sql: QRY_TO_EXEC, values }, cntxtDtls);
//     }
// };


exports.studentsigniupMdl = function (data, callback) {
	var cntxtDtls = "in studentsigniupMdl";
    var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    
	var QRY_TO_EXEC = `insert into student_reg(studentname,number,parentnum,pastornum,study,fathername,sstatus,finanstat,caste,totmarks,maxmarks,eamcet,talent,aboutyourself, i_ts,dob,denomination_id,spirti,lifegoal,villagename,respanchayati,resmandals,resconstituencyname,resdistricts,god,subcaste,gender) values ('${data.studentname}','${data.number}','${data.parentnum}','${data.pastornum}','${data.study}','${data.fathername}','${data.sstatus}','${data.finanstat}','${data.caste}','${data.tmarks}','${data.mmarks}','${data.mother}','${data.talent}','${data.aboutyourself}','${date}','${data.dob}','${data.denomination_id}','${data.spirti}','${data.lifegoal}','${data.villagename}','${data.respanchayati}','${data.resmandals}','${data.resconstituencyname}','${data.resdistricts}','${data.god}','${data.subcaste}','${data.gender}')`;
console.log(QRY_TO_EXEC)
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



// exports.studentsigniupMdl = function (data, callback) {
// 	var cntxtDtls = "in studentsigniupMdl";
// 	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
// 	var QRY_TO_EXEC = `insert into student_reg(studentname,number,pastornum,study,fathername,sstatus,nativeplace,caste,schname,totmarks,maxmarks,talent,district_id,constituency_id
// 	,mandal_id,village_id,aboutyourself,church_id,pastor_id,leadership,leadertype,generaltype,wingtype,i_ts,dob,wingtypes,denomination_id,hobbies,spirti,lifegoal,nri,ward,wardnumber,villagename,respanchayati,resmandals,resconstituencyname,resdistricts,god,term,orphonintersted,orphonname,password,subcaste,gender) values('${data.studentname}','${data.number}','${data.pastornum}','${data.study}',
// 	'${data.fathername}','${data.sstatus}','${data.nativeplace}','${data.caste}','${data.schname}','${data.tmarks}','${data.mmarks}','${data.talent}','${data.district_id}','${data.constituency_id}',
// 	'${data.mandal_id}','${data.village_id}','${data.aboutyourself}','${data.church}','${data.pastor}','${data.leadership}','${data.leadertype}','${data.generaltype}','${data.wingtype}','${date}','${data.dob}','${data.wingtypes}','${data.denomination_id}','${data.hobbies}','${data.spirti}','${data.lifegoal}','${data.nri}','${data.ward}','${data.wardnumber}','${data.villagename}','${data.respanchayati}','${data.resmandals}','${data.resconstituencyname}','${data.resdistricts}','${data.god}','${data.term}','${data.mother}','${data.orphon}','${data.password}','${data.subcaste}','${data.gender}')`;
// 	if (callback && typeof callback == "function") {
// 		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
// };

exports.poststudentlogin = function (name, id, lastid, data, callback) {
	var cntxtDtls = "in poststudentlogin";
	var QRY_TO_EXEC = `insert into signup(usr_id,name ,mail ,mobilenumber,password,category,categoryid) values('${lastid}','${data.studentname}','${data.email}','${data.number}','${data.password}','${name}','${id}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postministrysignupMdl = function (data, callback) {
	var cntxtDtls = "in postministrysignupMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into ministry_signup(ministryname,denomation_id,ministryemail,ministrywebsite,headnmber,number_ofchurches,number_ofmembers,district_id,constituency_id,mandal_id,panchayat_id,pastor,description,password,retypepassword,dts)values('${data.firstname}','${data.denomation}','${data.ministryemail}','${data.ministrywebsite}','${data.headnmber}','${data.number_ofchurches}','${data.number_ofmembers}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.panchayat_id}','${data.pastor}','${data.description}','${data.password}','${data.retypepassword}','${date}') `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



//const moment = require('moment'); // Ensure moment is required

// exports.postregformMdl = function (data, callback) {
//     const cntxtDtls = "in postregformMdl";
//     const date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");

//     const QRY_TO_EXEC = `
//         INSERT INTO reg_form 
//         (category, name, phonenum, whatsappno, district_id, constituency_id, mandal_id, panchayat_id, option1, description, cts)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//         data.category,
//         data.name,
//         data.phnumber,
//         data.whatsapnum,
//         data.district_id,
//         data.constituency_id,
//         data.mandal_id,
//         data.village_id,
//         data.address,
//         data.description,
//         date
//     ];

//     if (callback && typeof callback === "function") {
//         dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, values, callback);
//     } else {
//         return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, values);
//     }
// };





exports.postwishformMdl = function (data, img_links, callback){
	var cntxtDtls = "in postwishformMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	//const date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into wish_form(category,name,phonenum,whatsappno,church_orgname,number_ofmembers,image,district_id,constituency_id,mandal_id,panchayat_id,localadds,denomination,description,cts)values('${data.category}','${data.name}','${data.phnumber}','${data.whatsapnum}','${data.churchname}','${data.number_ofmembers}','${img_links}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.address}','${data.denomation}','${data.description}','${date}') `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postregformMdl = function (data, callback) {
	var cntxtDtls = "in postregformMdl";
	const date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into reg_form(category,name,phonenum,whatsappno,district_id,constituency_id,mandal_id,panchayat_id,option1,description,cts)values('${data.category}','${data.name}','${data.phnumber}','${data.whatsapnum}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.address}','${data.description}','${date}') `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

// exports.postregformMdl = function (data, callback) {
// 	var cntxtDtls = "in postregformMdl";
// 	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
// 	 if (data.category == 1) {
// 	     	     var QRY_TO_EXEC = ` insert into  signup_form  (fname,mobile_number,district_id,constituency_id,mandal_id,panchayat_id,address,description,denomination_id,password,cts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.address}','${data.description}','${data.denomation}','${data.password}','${date}') `
// 	    } else if (data.category == 2) {
//             	var QRY_TO_EXEC = `insert into  student_reg  (studentname,number,district_id,constituency_id,mandal_id,village_id,address,description,denomination_id,password,i_ts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.address}','${data.description}','${data.denomation}','${data.password}','${date}')`
//           } else if (data.category == 3) {
//           	var QRY_TO_EXEC = `insert into  ministry_signup  (ministryname,headnmber,district_id,constituency_id,mandal_id,panchayat_id,address,description,denomation_id,password,dts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.address}','${data.description}','${data.denomation}','${data.password}','${date}') `
//           } else if (data.category == 4) {
//           	var QRY_TO_EXEC = `  insert into  pastor_reg  (pastorname,phonenumber,district_id,constituency_id,mandal_id,village_id,address,description,denomination_id,password,i_ts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.address}','${data.description}','${data.denomation}','${data.password}','${date}') `
//           } else if (data.category == 5) {
//           	var QRY_TO_EXEC = ` insert into  church_reg  (church_name,contactnumber,district_id,constituency_id,mandal_id,village_id,address,description,denomination_id,password,cts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.address}','${data.description}','${data.denomation}','${data.password}','${date}') `
//           } else if (data.category == 6) {
//           	var QRY_TO_EXEC = ` insert into  independentorganisation_reg  (	organisation_name,contact_num,districts,constituencyname,mandals,panchayati,org_address,description,denomation,password,ctsdate)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.address}','${data.description}','${data.denomation}','${data.password}','${date}') `
//           } else if (data.category == 7) {
//           	var QRY_TO_EXEC = ` insert into  pastors_associations  (paname,phonenumber,districtname,constituencyname,mandals,panchaiti,address,description,password,cts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.address}','${data.description}','${data.password}','${date}' ) `
//           }
// 	if (callback && typeof callback == "function") {
// 		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
// };


exports.postmministrylogin = function (name, id, lastid, data, callback) {
	var cntxtDtls = "in postmministrylogin";
	var QRY_TO_EXEC = `insert into signup(usr_id,name ,mail ,mobilenumber,password,category,categoryid)  values('${lastid}','${data.headname}','${data.email}','${data.headnmber}','${data.password}','${name}','${id}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postpastorMdl = function (data, callback) {
	var cntxtDtls = "in postpastorMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into pastor_reg(pastorname,dob,about_desp,gender,phonenumber,phonenumber2,pa_phonenumber,staus,designation,caste,nativeplace,talent,education,district_id,constituency_id,mandal_id,village_id,address,youtubechanel,leadership,leadertype,generaltype,wingtype,i_ts,facebook,god,term,lifegoal,denomination_id,villagename,wingtypes,password,retypepassword,pastortype,ministry_id,subward,fellowship,assicoation_id,position,subcaste)values('${data.pastorname}','${data.dob}','${data.about_desp}','${data.gender}','${data.phonenumber}','${data.phonenumber2}','${data.pa_phonenumber}','${data.staus}','${data.designation}','${data.caste}','${data.nativeplace}','${data.talent}','${data.education}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.panchayat_id}','${data.ward}','${data.youtubechanel}','${data.leaders}','${data.leadertype}','${data.generaltype}','${data.wingtype}','${date}','${data.facebook}','${data.god}','${data.term}','${data.lifegoal}','${data.denomination_id}','${data.villagename}','${data.wingtypes}','${data.password}','${data.retypepassword}','${data.pastortype}','${data.ministry_id}','${data.subward}','${data.fellowship}','${data.assicoation_id}','${data.position}','${data.subcaste}') ;`
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postpastorlogin = function (name, id, lastid, data, callback) {
	var cntxtDtls = "in postpastorlogin";
	var QRY_TO_EXEC = `insert into signup(usr_id,name,mail,mobilenumber,password,category,categoryid)  values('${lastid}','${data.pastorname}','${data.email}','${data.phonenumber}','${data.password}','${name}','${id}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postchurchregistermdl = function (data, callback) {
	var cntxtDtls = "in postchurchregistermdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into church_reg(church_name,denomination_id,total_members,district_id,constituency_id,mandal_id,village_id,street,location,contactnumber,description,ministry_id,churchtype,pastor_id,password,remarks,village_name,term,youtube,facebook,cts)values('${data.church_name}','${data.denomination_id}','${data.total_members}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.street}','${data.location}','${data.contactnumber}','${data.description}','${data.ministry_id}','${data.churchtype}','${data.pastor_id}','${data.password}','${data.remarks}','${data.village_name}','${data.term}','${data.youtube}','${data.facebook}','${date}') `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postpastorassociationsmdl = function (data, callback) {
	var cntxtDtls = "in postpastorassociationsmdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into pastors_associations(paname,headname,phonenumber,whatsapp_number,secretory,president,stdph,totalleadrs,website,address,districtname,constituencyname,mandals,panchaiti,password,workingareas,description,terms,level,cts)values('${data.pa_name}','${data.headname}','${data.phonenumber}','${data.whatsapp_number}','${data.pa_secretory}','${data.pa_president}','${data.std_phonenumber}','${data.totalleadrs}','${data.website}','${data.address}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.password}','${data.workingareas}','${data.description}','${data.term}','${data.level}','${date}') `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postpastorassociationlogin = function (name, id, lastid, data, callback) {
	var cntxtDtls = "in postpastorassociationlogin";
	var QRY_TO_EXEC = `insert into signup(usr_id,name,mail,mobilenumber,category,categoryid,password)values('${lastid}','${data.church_name}','${data.email}','${data.contactnumber}','${name}','${id}','${data.password}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		}); 
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postchurchreglogin = function (name, id, lastid, data, callback) {
	var cntxtDtls = "in postchurchreglogin";
	var QRY_TO_EXEC = `insert into signup(usr_id,name,mail,mobilenumber,category,categoryid,password)values('${lastid}','${data.church_name}','${data.email}','${data.contactnumber}','${name}','${id}','${data.password}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postindepedentorganisationmdl = function (data, callback) {
	var cntxtDtls = "in postindepedentorganisationmdl";
	var QRY_TO_EXEC = `insert into independentorganisation_reg(organisation_name,believer_id,pastor_id,org_address,location,contact_num,email,website,denomation,service_name,organizationtype,ministry_id,districts,constituencyname,mandals,panchayati,villagename,ward,password)values('${data.organisation_name}','${data.believer_id}','${data.pastor_id}','${data.org_address}','${data.location}','${data.contact_num}','${data.email}','${data.website}','${data.denomation}','${data.service_name}','${data.organizationtype}','${data.ministry_id}','${data.districts}','${data.constituencyname}','${data.mandals}','${data.panchayati}','${data.villagename}','${data.ward}','${data.password}') `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postindependentorglogin = function (name, id, lastid, data, callback) {
	var cntxtDtls = "in postindependentorglogin";
	var QRY_TO_EXEC = `insert into signup(usr_id,name,mail ,mobilenumber,password,category,categoryid)values('${lastid}','${data.organisation_name}','${data.email}','${data.contact_num}','${data.password}','${name}','${id}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

// exports.postindepedentchurchMdl = function (imageupload,data, callback) {
// 	var cntxtDtls = "in postindepedentchurchMdl";
// 	var QRY_TO_EXEC = `INSERT INTO pastors_associations(churchname,denomination_id,pattern_id,district_id,constituency_id,mandal_id,
//     panchayat_id,street,pastor_id,church_img,location,contactnumber,
//     totalchurch_mem,description)VALUES('${data.churchname}',
//     '${data.denomination_id }','${data.pattern_id}','${data.district_id}',
//      '${data.constituency_id}','${data.mandal_id }','${data.panchayat_id}',
//     '${data.street}','${data.pastor_id}','${imageupload}',
//     '${data.location}','${data.contactnumber}','${data.totalchurch_mem}',
//     '${data.description }') `;
// 	if (callback && typeof callback == "function") {
// 		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
// };


exports.postindependentchurchlogin = function (name, id, lastid, data, callback) {
	var cntxtDtls = "in postindependentchurchlogin";
	var QRY_TO_EXEC = `insert into signup(usr_id,name,mail ,mobilenumber,password,category,categoryid)values('${lastid}','${data.organisation_name}','${data.email}','${data.contact_num}','${data.password}','${name}','${id}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.checknumber = function (number, callback) {
	var cntxtDtls = "in checknumber";
	var QRY_TO_EXEC = `select id from signup where mobilenumber ='${number}'and d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getpersonalmdl = function (data, callback) {
	if (data.tableid == 1) {
		var table = 'signup_form'
	} else if (data.tableid == 2) {
		var table = 'student_reg'
	} else if (data.tableid == 3) {
		var table = 'ministry_signup'
	} else if (data.tableid == 4) {
		var table = 'pastor_reg'
	} else if (data.tableid == 5) {
		var table = 'church_reg'
	} else if (data.tableid == 6) {
		var table = 'independentorganisation_reg'
	} else if (data.tableid == 7) {
		var table = 'pastors_associations'
	}
	var cntxtDtls = "in getpersonalmdl";
	var QRY_TO_EXEC = `select * from ${table} where id ='${data.usr_id}'and d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postingmarriagesmdl = function (data, img_links, callback) {
	var cntxtDtls = "in postingmarriagesmdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into marriages(image,description,height,color,work,status,name,dob,location,address,phonenumber,district_id,
	constituency_id,mandal_id,panchayat_id,user_id,gender,education,whealth,self,types,i_ts,denomination_id,ministry_id,caste,subcaste,believer_id,pastor_id,spirti)values('${img_links}','${data.description}',
	'${data.height}','${data.color}','${data.work}','${data.status}','${data.name}','${data.dob}','${data.location}','${data.address}',
	'${data.phonenumber}','${data.districtname}','${data.constituencyname}','${data.mandals}','${data.village_name}','${data.usr_id}',
	'${data.gender}','${data.education}','${data.whealth}','${data.self}','${data.types}','${date}','${data.denomation_id}','${data.ministry_id}','${data.caste}','${data.subcaste}','${data.believer_id}','${data.pastor_id}','${data.spirti}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.getyouthmeetingMdl = function (id, callback) {
	var cntxtDtls = "in getyouthmeetingMdl";
	var QRY_TO_EXEC = `select * from events  where d_in = '0' and eventname = 'Youth' and enddate >= CURRENT_DATE()`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getrevivalMdl = function (id, callback) {
	var cntxtDtls = "in getrevivalMdl";
	var QRY_TO_EXEC = `select * from events  where d_in = '0' and eventname = 'Revival' and enddate >= CURRENT_DATE();`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.getwomenMdl = function (id, callback) {
	var cntxtDtls = "in getwomenMdl";
	var QRY_TO_EXEC = `select * from events  where d_in = '0' and eventname = 'Women' and enddate >= CURRENT_DATE();`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.getpastormeetingMdl = function (id, callback) {
	var cntxtDtls = "in getpastormeetingMdl";
	var QRY_TO_EXEC = `select * from events  where d_in = '0' and eventname = 'Pastors' and enddate >= CURRENT_DATE();`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getchildernMdl = function (id, callback) {
	var cntxtDtls = "in getchildernMdl";
	var QRY_TO_EXEC = `select * from events  where d_in = '0' and eventname = 'Children' and enddate >= CURRENT_DATE();`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getmusicalMdl = function (id, callback) {
	var cntxtDtls = "in getmusicalMdl";
	var QRY_TO_EXEC = `select * from events  where d_in = '0' and eventname = 'MuscialNights' and enddate >= CURRENT_DATE();`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.searchingdatamdl = function (data, callback) {
	var cntxtDtls = "in searchingdatamdl";
	
	console.log(data)

	if (data.mettingtype == '' ||data.mettingtype == null ) {
		var a = ''
	} else {
		var a = `and eventname LIKE '%${data.mettingtype}%' `
	}
	if (data.ministry_id == '' || data.ministry_id == null ) {
		var b = ''
	} else {
		var b = `and ministry_id = '${data.ministry_id}'`
	}
	if (data.denomation_id == '' || data.denomation_id == null ) {
		var c = ''
	} else {
		var c = `and denomation_id = '${data.denomation_id}'`
	}
	if (data.startdate == '' || data.startdate == null ) {
		var e = ''
	} else {
		var e = `and startdate<='${data.startdate}' and enddate >= '${data.startdate}'`
	}
	if (data.district_id == '' || data.district_id == null) {
		var f =''
	} else {
		var f =`and district_id = '${data.district_id}'`
	}
	if (data.constenncy_id == '' || data.constenncy_id == null) {
		var g =''
	} else {
		var g =`and constituency_id = '${data.constenncy_id}'`
	}
	if (data.mandal_id == '' || data.mandal_id == null) {
		var h =''
	} else {
		var h =`and mandal_id = '${data.mandal_id}'`
	}
	if (data.panchayati_id == '' || data.panchayati_id == null) {
		var i =''
	} else {
		var i =`and panchayat_id = '${data.panchayati_id}'`
	}

	var QRY_TO_EXEC = `select * from events where d_in=0  AND enddate >= CURDATE() ${a} ${b} ${c} ${e} ${f} ${g} ${h} ${i};`
	
	console.log(QRY_TO_EXEC)

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.searchingchurchdatamdl = function (data, callback) {

    var cntxtDtls = "in searchingchurchdatamdl";
    
    if (data.typetime == 2) {                                                   // without  timings 
    
        if (data.denomationid == '' || data.denomationid == null) {
            var a = ''
        } else {
            var a = `and denomination_id='${data.denomationid}'`
        }

        if (data.ministry_id == '' || data.ministry_id == null) {
            var b = ''
        } else {
            var b = `and ministry_id='${data.ministry_id}'`
        }

        if (data.district_id == '' || data.district_id == null) {
            var d = ''
        } else {
            var d = `and district_id='${data.district_id}'`
        }
        
        if (data.constenncy_id == '' || data.constenncy_id == null) {
            var e = ''
        } else {
            var e = `and constituency_id='${data.constenncy_id}'`
        }
        
        if (data.mandal_id == '' || data.mandal_id == null) {
            var f = ''
        } else {
            var f = `and mandal_id='${data.mandal_id}'`
        }
        
        if (data.panchayati_id == '' || data.panchayati_id == null) {
            var g = ''
        } else {
            var g = `and village_id='${data.panchayati_id}'`
        }

        var QRY_TO_EXEC = `SELECT * FROM church_reg where d_in=0 ${a} ${b} ${d} ${e} ${f} ${g} ;`
        
    } else if (data.typetime == 1) {                                             // with timings 

        if (data.denomationid == '' || data.denomationid == null) {
            var a = ''
        } else {
            var a = `and a.denomination_id='${data.denomationid}'`
        }

        if (data.ministry_id == '' || data.ministry_id == null) {
            var b = ''
        } else {
            var b = `and a.ministry_id='${data.ministry_id}'`
        }

        if (data.district_id == '' || data.district_id == null) {
            var d = ''
        } else {
            var d = `and a.district_id='${data.district_id}'`
        }
        
        if (data.constenncy_id == '' || data.constenncy_id == null) {
            var e = ''
        } else {
            var e = `and a.constituency_id='${data.constenncy_id}'`
        }
        
        if (data.mandal_id == '' || data.mandal_id == null) {
            var f = ''
        } else {
            var f = `and a.mandal_id='${data.mandal_id}'`
        }
        
        if (data.panchayati_id == '' || data.panchayati_id == null) {
            var g = ''
        } else {
            var g = `and a.village_id='${data.panchayati_id}'`
        }

        var QRY_TO_EXEC = `SELECT a.*,c.* FROM church_reg as a JOIN church_timings as c on a.id = c.church_id where c.d_in='0' ${a} ${b} ${d} ${e} ${f} ${g};`
        
    }
    
    console.log(QRY_TO_EXEC);
    if (callback && typeof callback == "function") {
        dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
            callback(err, results);
            return;
        });
    }
    else
        return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getwingmdl = function (id, callback) {
	var cntxtDtls = "in getwingmdl";
	var QRY_TO_EXEC = `select * from wingleaderstype  where d_in = '0'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getchurchesMdl = function (id, callback) {
	var cntxtDtls = "in getchurchesMdl";
	var QRY_TO_EXEC = `SELECT a.*,c.* FROM church_reg as a JOIN church_timings as c on a.id=c.church_id where a.d_in='0';`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.postattackMdl = function (data, video1, video2, audio, callback) {
	var cntxtDtls = "in postattackMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `INSERT INTO attacks(video1,video2,address,victimphonenum1,victimphonenumber2,victimname1,victimname2,attackername1,attackername2,attackerphonenum1,attackerphonenum2,
	noteincident,audiorecordonincident, district_id, constituency_id,mandal_id,panchayat_id,approval_ind,cts)values('${video1}','${video2}','${data.address}','${data.victim1num}','${data.victim2num}',
	'${data.victim1name}','${data.victim2name}','${data.attacker1name}','${data.attacker2name}','${data.attacker1num}','${data.attacker2num}','${data.noteondescription}','${audio}' ,
	'${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}',0,,'${date}')`;
	console.log(1552, QRY_TO_EXEC)
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

//login requirement is there for attacks page so userid, user name, user number can be stored

// exports.postattackMdl = function (data, video1, video2, audio, callback) {
// 	var cntxtDtls = "in postattackMdl";
// 	var QRY_TO_EXEC = `INSERT INTO attacks(video1,video2,address,victimphonenum1,victimphonenumber2,victimname1,victimname2,attackername1,attackername2,attackerphonenum1,attackerphonenum2, noteincident,audiorecordonincident, district_id, constituency_id,mandal_id,panchayat_id,user_id,username,usernumber,approval_ind)values('${video1}','${video2}','${data.address}','${data.victim1num}','${data.victim2num}','${data.victim1name}','${data.victim2name}','${data.attacker1name}','${data.attacker2name}','${data.attacker1num}','${data.attacker2num}','${data.noteondescription}','${audio}' ,'${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.usr_id}','${data.username}','${data.usernumber}',0)`;
// 	if (callback && typeof callback == "function") {
// 		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
// };

exports.updateimagesattackMdl = function (imageupload, id, img, callback) {
	var cntxtDtls = "in updateimagesattackMdl";
	var QRY_TO_EXEC = `update attacks set ${img}= '${imageupload}' where id ='${id}'`
	console.log(QRY_TO_EXEC)
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatedocattackMdl = function (docupload, id, doc, callback) {
	var cntxtDtls = "in updatedocattackMdl";
	var QRY_TO_EXEC = `update attacks set ${doc}= '${docupload}' where id ='${id}'`
		console.log(QRY_TO_EXEC)
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getwebsitegallerymdl = function (data, callback) {
	var cntxtDtls = "in getwebsitegallerymdl";
	var QRY_TO_EXEC = ` select * from  gallery_category where d_in=0 order by id desc `;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


//prasad start //


exports.pposthomebannersSubmitmdl = function (data, img_links, callback) {
	var cntxtDtls = "in pposthomebannersSubmitmdl";
	var QRY_TO_EXEC = `insert into homebanners(heading,image)
			  values('${data.data.heading}','${img_links}');`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.gethomebannersMdl = function (callback) {
	var cntxtDtls = "in gethomebannersMdl";
	var QRY_TO_EXEC = `SELECT * FROM homebanners WHERE d_in=0 order by id desc`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}

exports.deletehomepagedatamdl = function (id, callback) {
	var cntxtDtls = "in deletehomepagedatamdl";
	var QRY_TO_EXEC = `update homebanners set d_in= '1' where id ='${id}'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.updatepposthomebannersSubmitmdl = function (data, callback) {
	var cntxtDtls = "in updatepposthomebannersSubmitmdl";
	var QRY_TO_EXEC = `update  homebanners set heading='${data.data.heading}' where id ='${data.id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.edithomebannerimagemdl = function (data, img_links, callback) {
	var cntxtDtls = "in edithomebannerimagemdl";
	var QRY_TO_EXEC = `update homebanners set  image = '${img_links}' where id='${data.id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.addCatenamedataMdl = function (data, img_links, callback) {
	var cntxtDtls = "in addCatenamedataMdl";
	var QRY_TO_EXEC = ` insert into gallery_category (categoryname,image) values( '${data.data.catename}','${img_links}') ; `;
	console.log(QRY_TO_EXEC,'421');
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getCatenamedataMdl = function (callback) {
	var cntxtDtls = "in getCatenamedataMdl";
	var QRY_TO_EXEC = `select * from gallery_category where d_in = 0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.deletecatenamedatamdl = function (id, callback) {
	var cntxtDtls = "in deletecatenamedatamdl";
	var QRY_TO_EXEC = `update gallery_category set d_in ='1' where id ='${id}'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}

exports.addgallerysubmitMdl = function (data, img_links, callback) {
    console.log(data)
	var addrowitm = img_links;
	var cntxtDtls = "in addgallerysubmitMdl";
	var mulqry = '';
	var QRY_TO_EXEC = '';
	// var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	for (i = 0; i < addrowitm.length; i++) {
		var mulqry = `insert into gallery (category_id,categoryname,image,image_name)
			  values('${data.project_id}','${data.project_name}','${addrowitm[i]}','${data.data.imagename}');`;
		QRY_TO_EXEC = QRY_TO_EXEC + mulqry;
	}
	console.log(mulqry,'420');
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.deletegallerydatamdl = function (id, callback) {
	var cntxtDtls = "in deletegallerydatamdl";
	var QRY_TO_EXEC = `update gallery set d_in ='1' where id ='${id}'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}

exports.getgallerydata11Mdl = function (callback) {
	var cntxtDtls = "in getgallerydata11Mdl";
	var QRY_TO_EXEC = `select * from gallery where  d_in=0 order by id desc`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}

exports.updategalleryInfodatanew = function (data, imageupload, callback) {
	var cntxtDtls = "in updategalleryInfodatanew";
	var QRY_TO_EXEC = `UPDATE gallery SET image ='${imageupload}' WHERE id='${data.id}'`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.aboutpostmdl = function (data, image, callback) {
	var cntxtDtls = "in aboutpostmdl";
	// var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = ` insert into about_tbl (title,para1,para2,para3,image) values( '${data.title}','${data.para1}','${data.para2}','${data.para3}','${image}'); `;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getaboutMdl = function (callback) {
	var cntxtDtls = "in getaboutMdl";
	var QRY_TO_EXEC = `SELECT * FROM about_tbl WHERE d_in=0  order by id desc`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}

exports.deleteaboutmdl = function (id, callback) {
	var cntxtDtls = "in deleteaboutmdl";
	var QRY_TO_EXEC = `update about_tbl set d_in= '1' where id ='${id}'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updateaboutdatamdl = function (data, callback) {
	var cntxtDtls = "in updateaboutdatamdl";
	var QRY_TO_EXEC = `update about_tbl set title='${data.title}',para1='${data.para1}',para2='${data.para2}',para3='${data.para3}'  where id ='${data.id}'`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.editimageaboutmdl = function (data, imageupload, callback) {
	var cntxtDtls = "in editimageaboutmdl";
	var QRY_TO_EXEC = `update about_tbl set image='${imageupload}' where id ='${data.id}'`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.eventspostingdataMdl = function (data, img_links, callback) {
	var cntxtDtls = "in eventspostingdataMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	
	var QRY_TO_EXEC = `insert into events (eventname,startdate,enddate,starttime,endtime,location,address,image,cts) values('${data.data.name}','${data.data.startdate}','${data.data.enddate}','${data.data.starttime}','${data.data.endtime}','${data.data.location}','${data.data.address}','${img_links}','${date}');`
	
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.geteventpostingdataMdl = function (callback) {
	var cntxtDtls = "in geteventpostingdataMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD");
	var QRY_TO_EXEC = `select * from events where d_in = 0   order By id desc `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updateeventspostingdataMdl = function (data, callback) {

	var cntxtDtls = "in updateeventspostingdataMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `update events set eventname='${data.data.name}',startdate='${data.data.startdate}',enddate='${data.data.enddate}',starttime='${data.data.starttime}',endtime='${data.data.endtime}',location='${data.data.location}',address='${data.data.address}' where id ='${data.id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.deleteeventsupdatedatamdl = function (id, callback) {
	var cntxtDtls = "in deleteeventsupdatedatamdl";
	var QRY_TO_EXEC = `update post_news set d_in= '1' where id ='${id}'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.editscheduleimagemdl = function (data, img_links, callback) {
	var cntxtDtls = "in editscheduleimagemdl";
	var QRY_TO_EXEC = `update events set  image = '${img_links}' where id='${data.id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.gatcontactusMdl = function (callback) {
	var cntxtDtls = "in gatcontactusMdl";
	var QRY_TO_EXEC = `select * from contactus where d_in=0 order by id desc`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}
exports.getsignupregMdl = function (callback) {
	var cntxtDtls = "in getsignupregMdl";
	var QRY_TO_EXEC = `select * from signup where d_in=0 order by id desc`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}


exports.getpastorregisMdl = function (callback) {
	var cntxtDtls = "in getpastorregisMdl";
	var QRY_TO_EXEC = `select c.*,d.distrct_nm,e.const_nm,f.mndl_nm,g.pnchyt_nm from pastor_reg c join dstrct as d on d.id=c.district_id join const_dtl_t as e on e.id=c.constituency_id join mndls_lst_t as f on f.id=c.mandal_id join pnchyt_lst_t as g on g.id=c.village_id where c.d_in=0 order by c.id DESC`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}
exports.believerregMdl = function (callback) {
	var cntxtDtls = "in believerregMdl";
	var QRY_TO_EXEC = `SELECT c.*, d.distrct_nm,e.const_nm,f.mndl_nm,g.pnchyt_nm,h.pastorname,i.church_name  from signup_form c join dstrct as d on d.id=c.district_id join const_dtl_t as e on e.id=c.constituency_id join mndls_lst_t as f on f.id=c.mandal_id join pnchyt_lst_t as g on g.id=c.panchayat_id join pastor_reg as h on h.id=c.pastor_id join church_reg as i on i.id=c.church_id where c.d_in=0 order by c.id desc;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}
exports.studentregMdl = function (callback) {
	var cntxtDtls = "in studentregMdl";
	var QRY_TO_EXEC = `select c.*,d.distrct_nm,e.const_nm,f.mndl_nm,g.pnchyt_nm,h.pastorname,i.church_name from student_reg as c join dstrct as d on d.id=c.district_id join const_dtl_t as e on e.id=c.constituency_id join mndls_lst_t as f on f.id=c.mandal_id join pnchyt_lst_t as g on g.id=c.village_id join pastor_reg as h on h.id=c.pastor_id join church_reg as i on i.id=c.church_id where c.d_in=0 order by c.id desc`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}
exports.churchregMdl = function (callback) {
	var cntxtDtls = "in churchregMdl";
// 	var QRY_TO_EXEC = `select c.*,d.distrct_nm,e.const_nm,f.mndl_nm,g.pnchyt_nm,i.denomation_name from church_reg c join dstrct as d on d.id=c.district_id join const_dtl_t as e on e.id=c.constituency_id join mndls_lst_t as f on f.id=c.mandal_id join pnchyt_lst_t as g on g.id=c.village_id join churchdenomation as i on i.id=c.denomination_id where c.d_in=0 order by c.id desc`;
     var QRY_TO_EXEC = `select c.*,d.distrct_nm,e.const_nm,f.mndl_nm,g.pnchyt_nm from church_reg c join dstrct as d on d.id=c.district_id join const_dtl_t as e on e.id=c.constituency_id join mndls_lst_t as f on f.id=c.mandal_id join pnchyt_lst_t as g on g.id=c.village_id where c.d_in=0;`
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}
exports.independentchurchMdl = function (callback) {
	var cntxtDtls = "in independentchurchMdl";
	var QRY_TO_EXEC = `select c.*,d.distrct_nm,e.const_nm,f.mndl_nm,g.pnchyt_nm,h.denomation_name,i.pattern_name,j.pastorname from pastors_associations c join dstrct as d on d.id=c.district_id join const_dtl_t as e on e.id=c.constituency_id join mndls_lst_t as f on f.id=c.mandal_id join pnchyt_lst_t as g on g.id=c.panchayat_id join churchdenomation as h on h.id=c.denomination_id join pattern_table as i on i.id=c.pattern_id join pastor_reg as j on j.id=c.pastor_id where c.d_in=0 order by c.id desc`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}
exports.ministryregsMdl = function (callback) {
	var cntxtDtls = "in ministryregsMdl";
	var QRY_TO_EXEC = `select c.*,h.denomation_name from ministry_signup as c join churchdenomation as h on h.id=c.denomation_id  where c.d_in=0 ORDER BY c.id DESC;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}
exports.ministryservicesMdl = function (callback) {
	var cntxtDtls = "in ministryservicesMdl";
	var QRY_TO_EXEC = `select c.*,h.ministryname,i.servicename from ministery_services c join ministry_signup as h on h.id=c.ministery_id join services as i on i.id=c.sevice_id where c.d_in=0 order by c.id desc;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}

exports.remarkssubmitdataMdl = function (data, callback) {
	var cntxtDtls = "in remarkssubmitdataMdl";
	var QRY_TO_EXEC = `update pastor_reg set remarkone ='${data.remarkone}' where id='${data.id}';`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.believerremarksdataMdl = function (data, callback) {
	var cntxtDtls = "in believerremarksdataMdl";
	var QRY_TO_EXEC = `update signup_form set remarkones ='${data.remarkone}' where id='${data.id}';`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getjobsdataMdl = function (callback) {
	var cntxtDtls = "in getjobsdataMdl";
	var QRY_TO_EXEC = `SELECT * FROM jobs where d_in=0 order by id desc`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.churchtimingsMdl = function (callback) {
	var cntxtDtls = "in churchtimingsMdl";
	var QRY_TO_EXEC = `select c.*,i.church_name,d.servicename from church_timings as c  join church_reg as i on i.id=c.church_id join services as d on d.id=c.service_id where c.d_in=0 order by c.id desc; ;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.institutesMdl = function (callback) {
	var cntxtDtls = "in institutesMdl";
	var QRY_TO_EXEC = `select c.*,d.distrct_nm,e.const_nm,f.mndl_nm,g.pnchyt_nm from  institutes c join dstrct as d on d.id=c.district_id join const_dtl_t as e on e.id=c.constituency_id join mndls_lst_t as f on f.id=c.mandal_id join pnchyt_lst_t as g on g.id=c.panchayat_id   where c.d_in=0 order by c.id desc;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.getattackersdataMdl = function (callback) {
	var cntxtDtls = "in getattackersdataMdl";
	var QRY_TO_EXEC = `select c.*,d.distrct_nm,e.const_nm,f.mndl_nm,g.pnchyt_nm from  attacks c join dstrct as d on d.id=c.district_id join const_dtl_t as e on e.id=c.constituency_id join mndls_lst_t as f on f.id=c.mandal_id join pnchyt_lst_t as g on g.id=c.panchayat_id   where c.d_in=0 order by c.id desc;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};




exports.pastorleadershipregMdl = function (data, callback) {
	var cntxtDtls = "in pastorleadershipregMdl";
	if (data.df == 1) {
		var QRY_TO_EXEC = `SELECT * FROM pastor_reg  where d_in=0  and leadership='yes' and leadertype='1' and generaltype = '2' and district_id = '${data.district_id}'; `
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `SELECT * FROM pastor_reg where d_in=0 and leadership='YES' and leadertype='1' and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'; `
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `SELECT * FROM pastor_reg  where d_in=0 and leadership='YES'  and leadertype='1' and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}' `
	} else if (data.df == 4){
		var QRY_TO_EXEC = `SELECT * FROM pastor_reg  where d_in='0'and leadership='YES' and leadertype='1'  and district_id = '${data.district_id}' and mandal_id = '${data.mandal_id}' and constituency_id = '${data.constenncy_id}' and village_id ='${data.panchayati_id}'`;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.searchingbelieverdatactrlMdl = function (data, callback) {
	var cntxtDtls = "in searchingbelieverdatactrlMdl";
	if (data.df == 1) {
		var QRY_TO_EXEC = `SELECT * FROM signup_form  where d_in=0  And leadership='YES'  AND  leadertype='1' AND district_id = '${data.district_id}'`;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `SELECT * FROM signup_form where d_in=0 and leadership='YES'  and leadertype='1' and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'; `
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `SELECT * FROM signup_form  where d_in=0 and leadership='YES'  and leadertype='1' and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}' `
	} else {
		var QRY_TO_EXEC = `SELECT * FROM signup_form  where d_in='0'and leadership='YES'  and leadertype='1' and district_id = '${data.district_id}' and mandal_id = '${data.mandal_id}' and constituency_id = '${data.constenncy_id}' and panchayat_id ='${data.panchayati_id}'`;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.searchingstudentsdataMdl = function (data, callback) {
	var cntxtDtls = "in searchingstudentsdataMdl";
	if (data.df == 1) {
		var QRY_TO_EXEC = `SELECT * FROM student_reg  where d_in=0  And leadership='YES' AND leadertype='1'  AND district_id = '${data.district_id}'`;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `SELECT * FROM student_reg where d_in=0 and leadership='YES'  and leadertype='1' and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'; `
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `SELECT * FROM student_reg  where d_in=0 and leadership='YES' and leadertype='1' and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}' `
	} else {
		var QRY_TO_EXEC = `SELECT * FROM student_reg  where d_in='0'and leadership='YES' and leadertype='1' and district_id = '${data.district_id}' and mandal_id = '${data.mandal_id}' and constituency_id = '${data.constenncy_id}' and village_id ='${data.panchayati_id}'`;
	}


	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatevolunteersindMdl = function (data, callback) {
	var cntxtDtls = "in updatevolunteersindMdl";

	var QRY_TO_EXEC = `Update pastor_reg set approval_ind = '${data.status_ind}' where id = '${data.item_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.volunteerbelieverMdl = function (data, callback) {
	var cntxtDtls = "in volunteerbelieverMdl";

	var QRY_TO_EXEC = `Update signup_form set approval_ind = '${data.status_ind}' where id = '${data.item_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.volunteerstudentMdl = function (data, callback) {
	var cntxtDtls = "in volunteerstudentMdl";

	var QRY_TO_EXEC = `Update student_reg set approval_ind = '${data.status_ind}' where id = '${data.item_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};






//prasad end//



exports.Searchinstitutemdl = function (data, callback) {
	var cntxtDtls = "in Searchinstitutemdl";
	if (data.denomination_id == '') {
		var a = ''
	}
	else {
		var a = `and denomination_id  = '${data.denomination_id}'`
	}
	if (data.ministry_id == '') {
		var b = ''
	}
	else {
		var b = `and ministry_id  = '${data.ministry_id}'`
	}
	if (data.course_offered == '') {
		var c = ''
	}
	else {
		var c = `and course_offered  = '${data.course_offered}'`
	}
		if (data.college_type == '') {
		var d = ''
	}
	else {
		var d = `and college_type  = '${data.college_type}'`
	}

	var QRY_TO_EXEC = `select * from institutes where d_in=0 and district_id = '${data.district_id}'  and constituency_id = '${data.constenncy_id}' and mandal_id = '${data.mandal_id}'  and panchayat_id ='${data.panchayati_id}' ${a} ${b} ${c} ${d}`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getcatewebsitegallerymdl = function (data, callback) {
	var cntxtDtls = "in getcatewebsitegallerymdl";
	var QRY_TO_EXEC = `SELECT * FROM gallery where d_in=0 `;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};




exports.Searchmarriagesmdl = function (data, callback) {
	var cntxtDtls = "in Searchmarriagesmdl";
    var date = moment().utcOffset("+05:30").format("YYYY-MM-DD");
    if (data.df == 0) {
	var QRY_TO_EXEC = `SELECT *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date FROM marriages WHERE d_in=0 ; `
	} else	if (data.df == 1) {
		var QRY_TO_EXEC = `SELECT *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date FROM marriages WHERE district_id='${data.district_id}' and d_in=0 ;`
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `SELECT *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date FROM marriages where d_in=0 and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}' and d_in=0 ;`
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `SELECT *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date FROM marriages  where d_in=0  and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}' and d_in=0  ;` 
	} else {
		var QRY_TO_EXEC = `SELECT *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date FROM marriages  where d_in='0' and district_id = '${data.district_id}' and mandal_id = '${data.mandal_id}' and constituency_id = '${data.constenncy_id}' and panchayat_id ='${data.village_id}'  and d_in=0 ;`
	}
	console.log(QRY_TO_EXEC);
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.marriagespregctrlMdl = function (data, callback) {
	var cntxtDtls = "in marriagespregctrlMdl";
	if (data.df == 1) {
		var QRY_TO_EXEC = `SELECT * FROM marriages  where d_in=0   AND district_id = '${data.district_id}'`;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `SELECT * FROM marriages where d_in=0  and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'; `
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `SELECT * FROM marriages  where d_in=0  and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}' `
	} else {
		var QRY_TO_EXEC = `SELECT * FROM marriages  where d_in='0' and district_id = '${data.district_id}' and mandal_id = '${data.mandal_id}' and constituency_id = '${data.constenncy_id}' and panchayat_id ='${data.panchayati_id}'`;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.deleteattackersMdl = function (id, callback) {
	var cntxtDtls = "in deleteattackersMdl";
	var QRY_TO_EXEC = `update attacks set d_in = 1  WHERE  id = '${id}' ;`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



exports.updateattacksapprovalindMdl = function (data, callback) {
	var cntxtDtls = "in updateattacksapprovalindMdl";
	var QRY_TO_EXEC = `Update attacks set approval_ind = '${data.status_ind}' where id = '${data.item_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postaddsMdl = function (data, img_links, callback) {
	var cntxtDtls = "in postaddsMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into adds_data(type,title,description,number,user_id,image,cts)  values('${data.type}','${data.title}','${data.description}','${data.number}','${data.usr_id}','${img_links}','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.pastorwingleadershipregMdl = function (data, callback) {
	var cntxtDtls = "in pastorwingleadershipregMdl";
	if (data.df == 0) {
		var QRY_TO_EXEC = `SELECT * FROM pastor_reg  where d_in=0  And leadership='YES' AND leadertype='2';`;
	} else if (data.df == 1) {
		var QRY_TO_EXEC = `SELECT * FROM pastor_reg  where d_in=0  And leadership='YES' AND leadertype='2' AND district_id = '${data.district_id}';`;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `SELECT * FROM pastor_reg where d_in=0 and leadership='YES' and leadertype='2' and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'; `
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `SELECT * FROM pastor_reg  where d_in=0 and leadership='YES'  and leadertype='2'  and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}' `
	} else {
		var QRY_TO_EXEC = `SELECT * FROM pastor_reg  where d_in='0'and leadership='YES'  and leadertype='2' and district_id = '${data.district_id}' and mandal_id = '${data.mandal_id}' and constituency_id = '${data.constenncy_id}' and village_id ='${data.panchayati_id}'`;
	}

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.searchingbelieverchurchdataMdl = function (data, callback) {
	var cntxtDtls = "in searchingbelieverchurchdataMdl";
	if (data.df == 1) {
		var QRY_TO_EXEC = `SELECT * FROM signup_form  where d_in=0  And leadership='YES' AND leadertype='2' AND district_id = '${data.district_id}';`;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `SELECT * FROM signup_form where d_in=0 and leadership='YES' and leadertype='2' and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'; `
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `SELECT * FROM signup_form  where d_in=0 and leadership='YES'  and leadertype='2'  and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}' `
	} else {
		var QRY_TO_EXEC = `SELECT * FROM signup_form  where d_in='0'and leadership='YES'  and leadertype='2' and district_id = '${data.district_id}' and mandal_id = '${data.mandal_id}' and constituency_id = '${data.constenncy_id}' and panchayat_id ='${data.panchayati_id}'`;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.searchingstudentchurchdataMdl = function (data, callback) {
	var cntxtDtls = "in searchingstudentchurchdataMdl";
	if (data.df == 1) {
		var QRY_TO_EXEC = `SELECT * FROM student_reg  where d_in=0  And leadership='YES' AND leadertype='2' AND district_id = '${data.district_id}';`;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `SELECT * FROM student_reg where d_in=0 and leadership='YES' and leadertype='2' and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'; `
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `SELECT * FROM student_reg  where d_in=0 and leadership='YES'  and leadertype='2'  and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}' `
	} else {
		var QRY_TO_EXEC = `SELECT * FROM student_reg  where d_in='0'and leadership='YES'  and leadertype='2' and district_id = '${data.district_id}' and mandal_id = '${data.mandal_id}' and constituency_id = '${data.constenncy_id}' and village_id ='${data.panchayati_id}'`;
	}

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};




exports.volunteerwingapprovalmdl = function (data, callback) {
	var cntxtDtls = "in volunteerwingapprovalmdl";
	var QRY_TO_EXEC = `Update pastor_reg set approval_ind = '${data.status_ind}' where id = '${data.item_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.volunteerbelieverwingapprovalmdl = function (data, callback) {
	var cntxtDtls = "in volunteerbelieverwingapprovalmdl";
	var QRY_TO_EXEC = `Update signup_form set approval_ind = '${data.status_ind}' where id = '${data.item_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.volunteerstudentwingapprovalmdl = function (data, callback) {
	var cntxtDtls = "in volunteerstudentwingapprovalmdl";
	var QRY_TO_EXEC = `Update student_reg set approval_ind = '${data.status_ind}' where id = '${data.item_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.adddocumentctrlmdl = function (data, img_links, callback) {
	var cntxtDtls = "in adddocumentctrlmdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into docment_tbl(title,document,cts)  values('${data.title}','${img_links}','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.getdocumentMdl = function (callback) {
	var cntxtDtls = "in getdocumentMdl";
	var QRY_TO_EXEC = `SELECT * from docment_tbl where d_in=0 order by id desc `;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};




exports.deletedocumentCtrlMdl = function (id, callback) {
	var cntxtDtls = "in deletedocumentCtrlMdl";
	var QRY_TO_EXEC = `update docment_tbl set d_in = 1  WHERE  id = '${id}' ;`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};







exports.getpastorwingdataasMdl = function (id, callback) {
	var cntxtDtls = "in getpastorwingdataasMdl";
	var QRY_TO_EXEC = `SELECT * FROM pastor_reg  where d_in=0  And leadership='YES' AND leadertype='2';`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.getbelieverwingdataasMdl = function (id, callback) {
	var cntxtDtls = "in getbelieverwingdataasMdl";
	var QRY_TO_EXEC = `SELECT * FROM signup_form  where d_in=0  And leadership='YES' AND leadertype='2';`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getstudentwingchurchdataMdl = function (id, callback) {
	var cntxtDtls = "in getstudentwingchurchdataMdl";
	var QRY_TO_EXEC = `SELECT * FROM student_reg  where d_in=0  And leadership='YES' AND leadertype='2';`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getpastorsgendataMdl = function (id, callback) {
	var cntxtDtls = "in getpastorsgendataMdl";
	var QRY_TO_EXEC = `SELECT * FROM pastor_reg  where d_in=0  And leadership='YES' AND leadertype='1';`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getbelievergendataMdl = function (id, callback) {
	var cntxtDtls = "in getbelievergendataMdl";
	var QRY_TO_EXEC = `SELECT * FROM signup_form  where d_in=0  And leadership='YES' AND leadertype='1';`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.getstudentgenchurchdataMdl = function (id, callback) {
	var cntxtDtls = "in getstudentgenchurchdataMdl";
	var QRY_TO_EXEC = `SELECT * FROM student_reg  where d_in=0  And leadership='YES' AND leadertype='1';`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.searchgetmarriagesMdl = function (id, callback) {
	var cntxtDtls = "in searchgetmarriagesMdl";
	var QRY_TO_EXEC = `SELECT * FROM marriages  where d_in=0;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.getaddsdataapprovalMdl = function (callback) {
	var cntxtDtls = "in getaddsdataapprovalMdl";
	var QRY_TO_EXEC = `SELECT * from adds_data where d_in=0 order by id desc `;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getadocumentsdataaMdl = function (callback) {
	var cntxtDtls = "in getadocumentsdataaMdl";
	var QRY_TO_EXEC = `SELECT * from docment_tbl where d_in=0 order by id desc `;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.deleteProductDataCtrlMdl = function (data, callback) {
	var cntxtDtls = "in deleteProductDataCtrlMdl";
	var QRY_TO_EXEC = `update events set activestatus ='${data.ind}' where id='${data.id}';`
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



exports.addsapprovaldatamdl = function (data, callback) {
	var cntxtDtls = "in addsapprovaldatamdl";
	var QRY_TO_EXEC = `Update adds_data set approval_ind = '${data.status_ind}' where id = '${data.item_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.addapprovalindnewsmdl = function (data, callback) {
	var cntxtDtls = "in addapprovalindnewsmdl";
	var QRY_TO_EXEC = `Update post_news set approval_ind = '${data.status_ind}' where id = '${data.item_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.addapprovalindforhelpmdl = function (data, callback) {
	var cntxtDtls = "in addapprovalindforhelpmdl";
	var QRY_TO_EXEC = `Update helps set approval_ind = '${data.status_ind}' where id = '${data.item_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.deleteaddsdataamdl = function (id, callback) {
	var cntxtDtls = "in deleteaddsdataamdl";
	var QRY_TO_EXEC = `update adds_data set d_in= '1' where id ='${id}'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


//////////03-06-2023//////////////////////////////////////////

exports.searchjobmdl = function (data, callback) {
    
    var date = moment().utcOffset("+05:30").format("YYYY-MM-DD");
	var cntxtDtls = "in searchjobmdl";
	if (data.df == 0) { 
		var QRY_TO_EXEC = `SELECT *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date FROM jobs  HAVING later_date>='${date}' `;
	} else if (data.df == 1) {
		var QRY_TO_EXEC = `select *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date from jobs where d_in=0 and district_id = '${data.district_id}' HAVING later_date>='${date}'; `;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `select *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date from jobs where d_in=0 and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  HAVING later_date>='${date}';`
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `select *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date from jobs where d_in=0 and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}'  HAVING later_date>='${date}'; `
	} else if (data.df == 4) {
		var QRY_TO_EXEC = `select *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date from jobs where d_in=0 and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}' and panchayat_id = '${data.village_id}'  HAVING later_date>='${date}'; `
	} else {
		var QRY_TO_EXEC = `select *,DATE_ADD(i_ts, INTERVAL 30 DAY) AS  later_date from jobs where d_in=0 and district_id = '${data.district_id}' and constituency_id = '${data.constenncy_id}'  and mandal_id = '${data.mandal_id}' and panchayat_id = '${data.panchayati_id}'  HAVING later_date>='${date}';`
	
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.contactMdl = function (data, callback) {
	var cntxtDtls = "in contactMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into contactus(name,email,subject,description,cts)  values('${data.name}','${data.e_mail}','${data.subject}','${data.message}','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};




exports.getaddsdataMdl = function (id, callback) {
	var cntxtDtls = "in getaddsdataMdl";
	var QRY_TO_EXEC = `SELECT * from adds_data where d_in=0 AND approval_ind='1'order by id desc;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



exports.totalpastorconcstcntmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in totalpastorconcstcntmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from pastor_reg where d_in='0' and leadership='YES' and leadertype='1' and generaltype='2' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.mndlpastorldrsmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in mndlpastorldrsmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from pastor_reg where d_in='0' and leadership='YES' and leadertype='1' and generaltype='3' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.pnchytpastorldrsmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in pnchytpastorldrsmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from pastor_reg where d_in='0' and leadership='YES' and leadertype='1' and generaltype='4' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.districtwiseblvrsmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in districtwiseblvrsmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from signup_form where d_in='0' and leadership='YES' and leadertype='1' and generaltype='1' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.constwiseblvrsmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in constwiseblvrsmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from signup_form where d_in='0' and leadership='YES' and leadertype='1' and generaltype='2' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.mndlwiseblvrsmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in mndlwiseblvrsmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from signup_form where d_in='0' and leadership='YES' and leadertype='1' and generaltype='3' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.vlgwiseblvrsssmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in vlgwiseblvrsssmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from signup_form where d_in='0' and leadership='YES' and leadertype='1' and generaltype='4' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.distwisestdntssmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in vlgwiseblvrsssmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from student_reg where d_in='0' and leadership='YES' and leadertype='1' and generaltype='1' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.cnctcwisestndtsCtrlmdll = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in cnctcwisestndtsCtrlmdll";
	var QRY_TO_EXEC = `SELECT(select count(*) from student_reg where d_in='0' and leadership='YES' and leadertype='1' and generaltype='2' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.mndlwisestndlrdsCtrlmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in mndlwisestndlrdsCtrlmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from student_reg where d_in='0' and leadership='YES' and leadertype='1' and generaltype='3' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.vlgwisestntssCtrlmdl = function (callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var cntxtDtls = "in vlgwisestntssCtrlmdl";
	var QRY_TO_EXEC = `SELECT(select count(*) from student_reg where d_in='0' and leadership='YES' and leadertype='1' and generaltype='4' ) as total_orders;`

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getreferalcodeMdl = function (usr_id, callback) {
	var cntxtDtls = "in getreferalcodeMdl";
	var QRY_TO_EXEC = `SELECT * FROM signup where usr_id='${usr_id}' and d_in='0' ORDER by id DESC`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



exports.getuserprofilereportmdl = function (data, callback) {
	if (data.category_id == 1) {
		var table = 'signup_form'
	} else if (data.category_id == 2) {
		var table = 'student_reg'
	} else if (data.category_id == 3) {
		var table = 'ministry_signup'
	} else if (data.category_id == 4) {
		var table = 'pastor_reg'
	} else if (data.category_id == 5) {
		var table = 'church_reg'
	} else if (data.category_id == 6) {
		var table = 'independentorganisation_reg'
	} else if (data.category_id == 7) {
		var table = 'pastors_associations'
	}
	var cntxtDtls = "in getuserprofilereportmdl";
	var QRY_TO_EXEC = `select * from ${table} where id ='${data.usr_id}'and d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.updateprofilemdl = function (data, callback) {
	var cntxtDtls = "in updateprofilemdl";
	var QRY_TO_EXEC = `Update student_reg set studentname = '${data.name}',dob = '${data.dob}' where id = '${data.usr_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatebelivermdl = function (data, callback) {
	var cntxtDtls = "in updatebelivermdl";
	var QRY_TO_EXEC = `Update signup_form set fname = '${data.fname}',dob = '${data.dob}',nativeplace = '${data.nativeplace}' where id = '${data.usr_id}';`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.getLeaderswebsiteMdl = function (data, callback) {
  var cntxtDtls = "in getLeaderswebsiteMdl";
  if (data.generaltype == '1') {
    var QRY_TO_EXEC = ` SELECT * FROM signup_form WHERE d_in='0'  and leadership='YES' and leadertype='1'  and generaltype='2' and district_id='${data.district_id}' and approval_ind !=2 ;
	                   SELECT * FROM student_reg WHERE d_in='0'  and leadership='YES' and leadertype='1' and generaltype='2'  and district_id='${data.district_id}' and approval_ind !=2;
	                   SELECT * FROM pastor_reg WHERE d_in='0'  and leadership='YES' and leadertype='1' and generaltype='2' and district_id='${data.district_id}'  and approval_ind !=2;`
//console.log(QRY_TO_EXEC);
  } else if (data.generaltype == '2') {
    var QRY_TO_EXEC = ` SELECT * FROM signup_form WHERE d_in='0'  and leadership='YES' and leadertype='1' and generaltype='3' and constituency_id='${data.constituency_id}' and approval_ind !=2;
	                   	SELECT * FROM student_reg WHERE d_in='0'  and leadership='YES' and leadertype='1' and generaltype='3' and constituency_id='${data.constituency_id}' and approval_ind !=2;
	                	SELECT * FROM pastor_reg WHERE d_in='0'  and leadership='YES'and leadertype='1' and generaltype='3'and constituency_id='${data.constituency_id}' and approval_ind !=2;`
  } else if (data.generaltype == '3') {
    var QRY_TO_EXEC = `SELECT * FROM signup_form WHERE d_in = '0'  and leadership = 'YES' and leadertype='1' and generaltype = '4' and mandal_id='${data.mandal_id}' and approval_ind !=2;
                       SELECT * FROM student_reg WHERE d_in = '0'  and leadership = 'YES' and leadertype='1' and generaltype = '4' and mandal_id='${data.mandal_id}' and approval_ind !=2;
                       SELECT * FROM pastor_reg WHERE d_in = '0' and leadership = 'YES'and leadertype='1' and generaltype = '4'and mandal_id='${data.mandal_id}' and approval_ind !=2;`
  }
   else if (data.generaltype == '4') {
    var QRY_TO_EXEC = `SELECT * FROM signup_form WHERE d_in = '0'  and leadership = 'YES' and leadertype='1' and generaltype = '5' and panchayat_id = '${data.panchayat_id}'and approval_ind !=2;
                       SELECT * FROM student_reg WHERE d_in = '0'  and leadership = 'YES' and leadertype='1' and generaltype = '5' and village_id = '${data.panchayat_id}'and approval_ind !=2;
                       SELECT * FROM pastor_reg WHERE d_in = '0' and leadership = 'YES'and leadertype='1' and generaltype = '5'and village_id = '${data.panchayat_id}'and approval_ind !=2;`
  }
  if (callback && typeof callback == "function")
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
      callback(err, results);
      return;
    });
  else
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getLeaderswebsitewing = function (data, callback) {
  var cntxtDtls = "in getLeaderswebsitewing";
  if (data.generaltype == '1') {
    var QRY_TO_EXEC = ` SELECT * FROM signup_form WHERE d_in='0' and wingtype='${data.wingtype}'  and leadership='YES' and leadertype='2'  and generaltype='2' and constituency_id='${data.constituency_id}'and approval_ind !=2;
	                   	SELECT * FROM student_reg WHERE d_in='0' and wingtype='${data.wingtype}'  and leadership='YES' and leadertype='2' and generaltype='2'and constituency_id='${data.constituency_id}'and approval_ind !=2;
	                	SELECT * FROM pastor_reg WHERE d_in='0' and wingtype='${data.wingtype}' and leadership='YES' and leadertype='2'and generaltype='2'and constituency_id='${data.constituency_id}' and approval_ind =1;`
  } else if (data.generaltype == '2') {
    var QRY_TO_EXEC = ` SELECT * FROM signup_form WHERE d_in='0'and wingtype='${data.wingtype}'  and leadership='YES' and leadertype='2' and generaltype='3' and mandal_id='${data.mandal_id}'and approval_ind !=2;
	                   	SELECT * FROM student_reg WHERE d_in='0' and wingtype='${data.wingtype}' and leadership='YES' and leadertype='2' and generaltype='3' and mandal_id='${data.mandal_id}'and approval_ind !=2;
	                	SELECT * FROM pastor_reg WHERE d_in='0' and wingtype='${data.wingtype}' and leadership='YES'and leadertype='2' and generaltype='3'and mandal_id='${data.mandal_id}' and approval_ind !=2;`
  } else if (data.generaltype == '3') {
    var QRY_TO_EXEC = `SELECT * FROM signup_form WHERE d_in = '0' and wingtype='${data.wingtype}' and leadership = 'YES' and leadertype='2' and generaltype = '4' and panchayat_id = '${data.panchayat_id}'and approval_ind !=2;
                       SELECT * FROM student_reg WHERE d_in = '0'and wingtype='${data.wingtype}'  and leadership = 'YES' and leadertype='2' and generaltype = '4' and village_id = '${data.panchayat_id}'and approval_ind !=2;
                       SELECT * FROM pastor_reg WHERE d_in = '0' and wingtype='${data.wingtype}' and leadership = 'YES'and leadertype='2' and generaltype = '4'and village_id = '${data.panchayat_id}'and approval_ind !=2;`
  } else if (data.generaltype == '4') {
    var QRY_TO_EXEC = `SELECT * FROM signup_form WHERE d_in = '0' and leadership = 'yes' and  panchayat_id = '${data.panchayat_id}'and approval_ind !=2;
                       SELECT * FROM student_reg WHERE d_in = '0' and leadership = 'yes' and  village_id = '${data.panchayat_id}'and approval_ind !=2;
                       SELECT * FROM pastor_reg WHERE d_in = '0'  and leadership = 'yes' and   village_id = '${data.panchayat_id}'and approval_ind !=2;`
  }
  if (callback && typeof callback == "function")
    dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
      callback(err, results);
      return;
    });
  else
    return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getUserMainMdl = function (data, callback) {
	var cntxtDtls = "in getUserMainMdl";
	if (data.category == "1") {
		var QRY_TO_EXEC = `SELECT *,panchayat_id as village_id  FROM signup_form WHERE id='${data.usr_id}' and leadership='YES' and approval_ind='1'`
	} else if (data.category == "2") {
		var QRY_TO_EXEC = `SELECT * FROM student_reg WHERE id='${data.usr_id}' and leadership='YES' and approval_ind='1';`
	} else if (data.category == "4") {
		var QRY_TO_EXEC = `SELECT * FROM pastor_reg WHERE id='${data.usr_id}' and leadership='YES' and approval_ind='1';`
	}

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.gebeliverMdl = function (id, callback) {
	var cntxtDtls = "in gebeliverMdl";
	var QRY_TO_EXEC = `SELECT * FROM ministry_signup where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.gethomebannersMdl = function (id, callback) {
	var cntxtDtls = "in gethomebannersMdl";
	var QRY_TO_EXEC = `SELECT * FROM homebanners where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


// exports.searchingdemonationmdl = function (data, callback) {
// 	var cntxtDtls = "in searchingdemonationmdl";
// 	if (data.df == 1) {
// 		var QRY_TO_EXEC = `select * from events where d_in=0 and eventname= '${data.mettingtype}' and startdate<='${data.startdate}' and enddate >= '${data.startdate}'`;
// 	} else if (data.df == 2) {
// 		var QRY_TO_EXEC = `select * from events where d_in=0  and denomation_id = '${data.denomation}'and startdate<='${data.startdate}' and enddate >= '${data.startdate}' `;
// 	} else if (data.df == 3) {
// 		var QRY_TO_EXEC = `select * from events where d_in=0  and speaker1 = '${data.speakerone}' and startdate<='${data.startdate}' and enddate >= '${data.startdate}'; `
// 	} else if (data.df == 4) {
// 		var QRY_TO_EXEC = `select * from events where d_in=0  and ministry_id = '${data.ministry_id}' and startdate<='${data.startdate}' and enddate >= '${data.startdate}' `
// 	} else if (data.df == 5) {
// 		var QRY_TO_EXEC = `select * from events where d_in=0 and startdate<='${data.startdate}' and enddate >= '${data.startdate}'`
// 	}else {
// 		var QRY_TO_EXEC = `select * from events where d_in=0 and eventname= '${data.mettingtype}' and denomation_id = '${data.denomation}' 
// 		and ministry_id = '${data.ministry_id}' and speaker1 = '${data.speakerone}' and startdate<='${data.startdate}' and enddate >= '${data.startdate}'`;
// 	}
// 	if (callback && typeof callback == "function") {
// 		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
// };

///////pradeep  events code ///////////////////
exports.searchingdemonationmdl = function (data, callback) {
	var cntxtDtls = "in searchingdemonationmdl";
	if (data.df == 1) {
		var QRY_TO_EXEC = `select * from events where d_in=0 and eventname= '${data.mettingtype}' and enddate >= CURRENT_DATE() `;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `select * from events where d_in=0 and eventname= '${data.mettingtype}' and denomation_id = '${data.denomation}' and enddate >= CURRENT_DATE() `;
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `select * from events where d_in=0 and eventname= '${data.mettingtype}' and denomation_id = '${data.denomation}'  and speaker1 = '${data.speakerone}' and enddate >= CURRENT_DATE(); `
	} else if (data.df == 4) {
		var QRY_TO_EXEC = `select * from events where d_in=0  and eventname= '${data.mettingtype}' and denomation_id = '${data.denomation}'  and speaker1 = '${data.speakerone}' and ministry_id = '${data.ministry_id}' and enddate >= CURRENT_DATE(); `
	} else if (data.df == 5) {
		var QRY_TO_EXEC = `select * from events where d_in=0   and startdate<='${data.startdate}' and enddate >= '${data.startdate}';`
	}else {
		var QRY_TO_EXEC = `select * from events where d_in=0 and eventname= '${data.mettingtype}' and denomation_id = '${data.denomation}' 
		and ministry_id = '${data.ministry_id}' and speaker1 = '${data.speakerone}' and startdate<='${data.startdate}' and enddate >= '${data.startdate}';`
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



exports.searchingbusinessmdl = function (data, callback) {
	var cntxtDtls = "in searchingbusinessmdl";
	if (data.df == 1) {
		var QRY_TO_EXEC = `select * from business_table where d_in=0 and type= '${data.type}'`;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `select * from business_table where d_in=0 and type= '${data.type}' and denomation = '${data.denomation}' `;
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `select * from business_table where d_in=0 and  type= '${data.type}' and denomation = '${data.denomation}' and title = '${data.title}'; `
	} else if (data.df == 4) {
		var QRY_TO_EXEC = `select * from business_table where d_in=0 and type= '${data.type}' and denomation = '${data.denomation}' and title = '${data.title}' and ministry_id = '${data.ministry_id}' `
	} else {
		var QRY_TO_EXEC = `select * from business_table where d_in=0 and type= '${data.type}' and denomation = '${data.denomation}' and ministry_id = '${data.ministry_id}' and title = '${data.title}'`;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.posthelpingMdl = function (data, img_links, callback) {
	var cntxtDtls = "in posthelpingMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into helps(description,image,user_id,mobile_number,name,help,cts) values('${data.description}','${img_links}','${data.usr_id}','${data.mobile_number}','${data.name}','${data.help}','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.gethelpingMdl = function (id, callback) {
	var cntxtDtls = "in gethelpingMdl";
	var QRY_TO_EXEC = `select * from helps  where d_in = '0' and approval_ind = '1' `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postnewsMdl = function (data, img_links, callback) {
	var cntxtDtls = "in postnewsMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into post_news(description,image,news,mobile_number,cts)  values('${data.description}','${img_links}','${data.news}','${data.mobilenumber}','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

// exports.postnewsMdl = function (data, img_links, callback) {
// 	var cntxtDtls = "in postnewsMdl";
// 	var QRY_TO_EXEC = `insert into post_news(description,image,user_id,mobile_number,name,news)  values('${data.description}','${img_links}','${data.usr_id}','${data.mobile_number}','${data.name}','${data.news}')`;
// 	if (callback && typeof callback == "function") {
// 		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
// };

exports.getnewsMdl = function (id, callback) {
	var cntxtDtls = "in getnewsMdl";
	var QRY_TO_EXEC = `select * from post_news where d_in = '0' AND approval_ind= '1' `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postbusinessMdl = function (data, img_links, callback) {
	var cntxtDtls = "in postbusinessMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into business_table(type,title,description,number,usr_id,image,denomation,districtname,constituencyname,mandals,village_name,usr_name,ministry_id,ward,cts)values('${data.type}','${data.title}','${data.description}','${data.number}','${data.usr_id}','${img_links}','${data.denomation}','${data.districtname}','${data.constituencyname}','${data.mandals}','${data.village_name}','${data.name}','${data.ministry_id}','${data.ward}','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getbusinessMdl = function (id, callback) {
	var cntxtDtls = "in getbusinessMdl";
	var QRY_TO_EXEC = `SELECT * from business_table where d_in=0;`
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatenewsdataaMdl = function (callback) {
	var cntxtDtls = "in updatenewsdataaMdl";
	var QRY_TO_EXEC = `SELECT * from post_news where d_in=0 order by id desc;`
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getlookingforhelppMdl = function (callback) {
	var cntxtDtls = "in getlookingforhelppMdl";
	var QRY_TO_EXEC = `SELECT * from helps where d_in=0 order by id desc ;`
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.searchgetbusinessMdl = function (id, callback) {
	var cntxtDtls = "in searchgetbusinessMdl";
	var QRY_TO_EXEC = `SELECT * FROM business_table  where d_in=0;`
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.searchbusinessmdl = function (data, callback) {
	var cntxtDtls = "in searchbusinessmdl";
	if (data.df == 1) {
		var QRY_TO_EXEC = `SELECT * FROM business_table  where d_in=0   AND districtname = '${data.district_id}'`;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `SELECT * FROM business_table where d_in=0 and districtname = '${data.district_id}' and constituencyname = '${data.constenncy_id}';`
	} else if (data.df == 3) {
		var QRY_TO_EXEC = `SELECT * FROM business_table  where d_in=0  and districtname = '${data.district_id}' and constituencyname = '${data.constenncy_id}'  and mandals = '${data.mandal_id}' `
	} else {
		var QRY_TO_EXEC = `SELECT * FROM business_table  where d_in='0' and districtname = '${data.district_id}' and mandals = '${data.mandal_id}' and constituencyname = '${data.constenncy_id}' and village_name ='${data.panchayati_id}'`;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updateconsisctrlMdl = function (data, callback) {
	var cntxtDtls = "in updateconsisctrlMdl";
	var table=''
    if(data.tableid == 1) {
		var table = 'signup_form'
	} else if (data.tableid == 2) {
		var table = 'student_reg'
	}  else if (data.tableid == 3) {
		var table = 'pastor_reg'
	} 
	var QRY_TO_EXEC = `update ${table}  set approval_ind = '1' where id ='${data.id}'`;
	
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.deleteboardmemberMdl = function (data, callback) {
	var cntxtDtls = "in deleteboardmemberMdl";
		var table=''
    if(data.tableid == 1) {
		var table = 'signup_form'
	} else if (data.tableid == 2) {
		var table = 'student_reg'
	}  else if (data.tableid == 3) {
		var table = 'pastor_reg'
	} 
	var QRY_TO_EXEC = `update  ${table} set approval_ind= '2' where id ='${data.id}'`;
	
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getinstitutesMdl = function (id, callback) {
	var cntxtDtls = "in getinstitutesMdl";
	var QRY_TO_EXEC = `SELECT * FROM institutes where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.getpastorassciationMdl = function (id, callback) {
	var cntxtDtls = "in getpastorassciationMdl";
	var QRY_TO_EXEC = `SELECT * FROM pastors_associations where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.addurlmdl = function (data, callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	
	var cntxtDtls = "in addurlmdl";
	var QRY_TO_EXEC = `insert into videotable(video, videoid, banner_type,type,i_ts)  values('${data.banner_url}', '${data.videoid}', '${data.banner_type}','1','${date}') `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postvideolinkdatamdl = function (data, callback) {
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD");
	var cntxtDtls = "in postvideolinkdatamdl";
	var QRY_TO_EXEC = `INSERT INTO banner_dlt_t(type,banner_url,videoid,i_ts,title) VALUES ('${data.banner_type}','${data.banner_url}','${data.videoid}','${date}','${data.title}');`;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getvideourlmdl = function (callback) {
	var cntxtDtls = "in getvideourlmdl";
	var QRY_TO_EXEC = `select * from banner_dlt_t where d_in =0  order by id desc`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.deleteUrlmdl = function (id, callback) {
	var cntxtDtls = "in deleteUrlmdl";
	var QRY_TO_EXEC = `update banner_dlt_t set d_in= '1' where id ='${id}'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.checknumbermdl = function (data, callback) {
	var cntxtDtls = "in checknumbermdl";
	if (data.category == 1) {
	  var QRY_TO_EXEC = `select * from signup_form where mobile_number ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 2) {
	     var QRY_TO_EXEC = `select * from student_reg where number ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 3) {
	       var QRY_TO_EXEC = `select * from ministry_signup where headnmber ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 4) {
	     var QRY_TO_EXEC = `select * from pastor_reg where phonenumber ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 5) {
	     var QRY_TO_EXEC = `select * from church_reg where number ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 6) {
	    var QRY_TO_EXEC = `select * from independentorganisation_reg where contact_num ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 7) {
	     var QRY_TO_EXEC = `select * from pastors_associations where phonenumber ='${data.mobile_number}'and d_in=0 `;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.uploadotp = function (number,otp, callback) {
	var cntxtDtls = "in uploadotp";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into otp_table(number,otp,cts)values('${number}','${otp}','${date}')`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.checkotpmdl = function (data, callback) {
	var cntxtDtls = "in checkotpmdl";
	var QRY_TO_EXEC = `select * from otp_table where number='${data.mobile_number}' and otp ='${data.otp}'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.createfrgetpasswordmdl = function (data, callback) {
	var cntxtDtls = "in createfrgetpasswordmdl";
	if (data.category == 1) {
	  var QRY_TO_EXEC = `update signup_form set password = '${data.password}',retypepassword = '${data.password}' where mobile_number ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 2) {
	  var QRY_TO_EXEC = `update student_reg set password = '${data.password}',retypepassword = '${data.password}' where number ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 3) {
	  var QRY_TO_EXEC = `update ministry_signup set password = '${data.password}' where headnmber ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 4) {
	  var QRY_TO_EXEC = `update pastor_reg set password = '${data.password}',retypepassword = '${data.password}'  where phonenumber ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 5) {
	  var QRY_TO_EXEC = `update church_reg set password = '${data.password}' where number ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 6) {
	  var QRY_TO_EXEC = `update independentorganisation_reg set password = '${data.password}' where contact_num ='${data.mobile_number}'and d_in=0 `;
	} else if (data.category == 7) {
	  var QRY_TO_EXEC = `update pastors_associations set password = '${data.password}',retypepassword = '${data.password}' where number ='${data.mobile_number}'and d_in=0 `;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.updatedetailsmdl = function (data, callback) {
	var cntxtDtls = "in updatedetailsmdl";
	if (data.category_id == '1') {
	  var QRY_TO_EXEC = `update signup_form set fname = '${data.name}',mobile_number = '${data.number}' where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '2') {
	  var QRY_TO_EXEC = `update student_reg set studentname = '${data.name}',number = '${data.number}' where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '3') {
	  var QRY_TO_EXEC = `update ministry_signup set ministryname = '${data.name}', headnmber = '${data.number}' where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '4') {
	  var QRY_TO_EXEC = `update pastor_reg set pastorname = '${data.name}' , phonenumber = '${data.number}'  where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '5') {
	  var QRY_TO_EXEC = `update church_reg set church_name = '${data.name}',number = '${data.number}' where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '6') {
	  var QRY_TO_EXEC = `update independentorganisation_reg set organisation_name = '${data.name}' , contact_num = '${data.number}' where id ='${data.usr_id}'and d_in=0 `;
	} 
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.geteditdtailsmdl = function (data, callback) {
	var cntxtDtls = "in geteditdtailsmdl";
	if (data.category_id == '1') {
	  var QRY_TO_EXEC = `Select *  from signup_form where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '2') {
	  var QRY_TO_EXEC = `Select *  from student_reg  where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '3') {
	  var QRY_TO_EXEC = `Select *  from ministry_signup  where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '4') {
	  var QRY_TO_EXEC = `Select *  from pastor_reg   where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '5') {
	  var QRY_TO_EXEC = `Select *  from church_reg  where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '6') {
	  var QRY_TO_EXEC = `Select *  from independentorganisation_reg  where id ='${data.usr_id}'and d_in=0 `;
	} else if (data.category_id == '7') {
	  var QRY_TO_EXEC = `Select *  from pastors_associations  where id ='${data.usr_id}'and d_in=0 `;
	} 
	
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.editministrymdl = function (data, callback) {
	var cntxtDtls = "in editministrymdl";
  var QRY_TO_EXEC = `update ministry_signup set  ministryname='${data.ministryname}',denomation_id='${data.denomation_id}',headname ='${data.headname }',ministryemail='${data.ministryemail}',ministrywebsite='${data.ministrywebsite}',headnmber	='${data.headnmber}',number_ofmembers='${data.number_ofmembers}',number_ofchurches='${data.number_ofchurches}',district_id='${data.district_id}',constituency_id='${data.constituency_id}',mandal_id='${data.mandal_id}' ,panchayat_id='${data.panchayat_id}' ,pastor='${data.pastor}' ,personal_secretary='${data.personal_secretary}' ,description='${data.description}' ,remarks='${data.remarks}'  where id ='${data.usr_id}'and d_in=0 `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.editbelivermdl = function (data, callback) {
    
	var cntxtDtls = "in editbelivermdl";
	
  var QRY_TO_EXEC = `update signup_form set  fname='${data.fname}',whatsapp='${data.whatsapp}',dob='${data.dob}',
  gender='${data.gender}',email='${data.email}',mobile_number='${data.mobile_number}',status='${data.status}',income='${data.income}',caste='${data.caste}',
  subcaste='${data.subcaste}',nativeplace='${data.nativeplace}',talent='${data.talent}', education='${data.education}',designation='${data.designation}',
  dpartment='${data.dpartment}', district_id='${data.districts}',  mandal_id='${data.mandals}', panchayat_id='${data.panchayati}', constituency_id='${data.constituencyname}',villagename='${data.villagename}',wardnumber='${data.wardnumber}',livingfrom='${data.nri}',
  leadership='${data.leadership}',leadertype='${data.leadertype}',generaltype='${data.generaltype}',subward='${data.subward}',wingtype='${data.wingtype}',wingtypes='${data.wingtypes}',
  denomination_id='${data.denomination_id}',hobbies='${data.hobbies}',spirti='${data.spirti}', lifegoal='${data.lifegoal}',church_id='${data.church}',
  pastor_id='${data.pastor}', youtube='${data.youtube}',  lname='${data.lname}', god='${data.god}' where id ='${data.usr_id}'and d_in=0 `;

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.editstudentmdl = function (data, callback) {

  var cntxtDtls = "in editstudentmdl";
  
  var QRY_TO_EXEC = `update student_reg set  studentname='${data.studentname}',number='${data.number}',study='${data.study}',gender='${data.gender}',
  schname='${data.schname}',fathername='${data.fathername}',aboutyourself='${data.aboutyourself}',nativeplace='${data.nativeplace}',caste='${data.caste}',talent='${data.talent}',
  district_id='${data.district_id}',constituency_id='${data.constituency_id}',mandal_id='${data.mandal_id}', village_id='${data.village_id}',password='${data.password}',
  retypepassword='${data.retypepassword}', church_id='${data.church}',  pastor_id='${data.pastor}', leadership='${data.leadership}', leadertype='${data.leadertype}',generaltype='${data.generaltype}',wingtype='${data.wingtype}',wingtypes='${data.wingtypes}',
  dob='${data.dob}',denomination_id='${data.denomination_id}',hobbies='${data.hobbies}',spirti='${data.spirti}',lifegoal='${data.lifegoal}',whatsappnumber='${data.whatsappnumber}',
  nri='${data.nri}',ward='${data.ward}',wardnumber='${data.wardnumber}', villagename='${data.villagename}',respanchayati='${data.respanchayati}',
  resmandals='${data.resmandals}', resconstituencyname='${data.resconstituencyname}',  resdistricts='${data.resdistricts}', god='${data.god}', term='${data.term}', orphonintersted='${data.mother}', orphonname='${data.orphon}', subcaste='${data.subcaste}' where id ='${data.usr_id}'and d_in=0  `;


	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.editpastormdl = function (data, callback) {
    console.log(data)
	var cntxtDtls = "in editpastormdl";
//   var QRY_TO_EXEC = `update pastor_reg set  pastorname='${data.pastorname}',phonenumber='${data.phonenumber}',dob='${data.dob}',
//   gender='${data.gender}',designation='${data.designation}',staus='${data.staus}',caste='${data.caste}',nativeplace='${data.nativeplace}',talent='${data.talent}',
//   education='${data.education}',youtubechanel='${data.youtubechanel}',facebook='${data.facebook}', about_desp='${data.about_desp}',lifegoal='${data.lifegoal}',	subcaste='${data.subcaste}',
//   god='${data.god}', about_desp='${data.about_desp}',  district_id='${data.district_id}', constituency_id='${data.constituency_id}', mandal_id='${data.mandal_id}',village_id='${data.village_id}',fellowship='${data.fellowship}',position='${data.position}',assicoation_id='${data.assicoation_id}' where id ='${data.usr_id}'and d_in=0  `;

        var QRY_TO_EXEC=`update pastor_reg
         set ,
         phonenumber='${data.phonenumber}',
         phonenumber2='${data.phonenumber2}',
         pa_phonenumber= '${data.pa_phonenumber}',
         dob='${data.dob}',
        gender='${data.gender}'
        ,designation='${data.designation}'
        ,staus='${data.staus}',
        caste='${data.caste}',
        nativeplace='${data.nativeplace}'
        ,talent='${data.talent}',
        education='${data.education}',
        youtubechanel='${data.youtubechanel}',
        facebook='${data.facebook}',
        about_desp='${data.about_desp}',
        lifegoal='${data.lifegoal}', 
        subcaste='${data.subcaste}',
        god='${data.god}', 
        about_desp='${data.about_desp}', 
        district_id='${data.district_id}',
        constituency_id='${data.constituency_id}',
        mandal_id='${data.mandal_id}',
        village_id='${data.village_id}',
        fellowship='${data.fellowship}'
        ,position='${data.position}',
        assicoation_id='${data.assicoation_id}'
        where id ='${data.usr_id}'  and  d_in=0 ;`
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.editchurchmdl = function (data, callback) {
	var cntxtDtls = "in editchurchmdl";
  var QRY_TO_EXEC = `update church_reg set  church_name='${data.church_name}',denomination_id='${data.denomination_id}',pastor_id='${data.pastor_id}',
                     total_members='${data.total_members}',contactnumber='${data.contactnumber}',description='${data.description}', district_id='${data.district_id}', constituency_id='${data.constituency_id}', mandal_id='${data.mandal_id}',
               village_id='${data.village_id}',street='${data.street}',location='${data.location}',password='${data.password}',village_name='${data.village_name}',churchtype='${data.churchtype}',ministry_id='${data.ministry_id}',facebook='${data.facebook}',youtube='${data.youtube}' where id ='${data.usr_id}'and d_in=0 `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.editindependentorgainsationmdl = function (data, callback) {
	var cntxtDtls = "in editindependentorgainsationmdl";
  var QRY_TO_EXEC = `update independentorganisation_reg set  organisation_name='${data.organisation_name}',believer_id='${data.believer_id}',
  pastor_id='${data.pastor_id}',denomation='${data.denomation}',org_address='${data.org_address}',location='${data.location}',contact_num='${data.contact_num}',email='${data.email}',
  website='${data.website}',service_name='${data.service_name}',organizationtype='${data.organizationtype}', ministry_id='${data.ministry_id}',password='${data.password}',
   districts='${data.districts}',  constituencyname='${data.constituencyname}', mandals='${data.mandals}', panchayati='${data.panchayati}',villagename='${data.villagename}',ward='${data.ward}'
   where id ='${data.usr_id}'and d_in=0  `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.editpastororgainsationmdl = function (data, callback) {
	var cntxtDtls = "in editpastororgainsationmdl";
  var QRY_TO_EXEC = `update pastors_associations set  paname='${data.pa_name}',headname='${data.pastor_id}',
  level='${data.level}',phonenumber='${data.phonenumber}',whatsapp_number='${data.whatsapp_number}',totalleadrs='${data.totalleadrs}',address='${data.address}',districtname='${data.district_id}',
  constituencyname='${data.constituency_id}',mandals='${data.mandal_id}',panchaiti='${data.village_id}', website='${data.website}',workingareas='${data.workingareas}',
   description='${data.description}',  password='${data.password}', terms='${data.term}'
   where id ='${data.usr_id}'and d_in=0  `;
   console.log(QRY_TO_EXEC);
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.searchingmarriagesmdl = function (data, callback) {
	var cntxtDtls = "in searchingmarriagesmdl";
	if (data.columnid==1){
	     var QRY_TO_EXEC = `SELECT *  FROM marriages WHERE denomination_id LIKE '%${data.name}%'`;
	}else if(data.columnid==2){
	     var QRY_TO_EXEC = `SELECT *  FROM marriages WHERE ministry_id LIKE '%${data.name}%'`;
	}else if(data.columnid==3){
	     var QRY_TO_EXEC = `SELECT *  FROM marriages WHERE gender LIKE '%${data.name}%'`;
	}else if(data.columnid==4){
	     var QRY_TO_EXEC = `SELECT *  FROM marriages WHERE status LIKE '%${data.name}%'`;
	}else if(data.columnid==5){
	     var QRY_TO_EXEC = `SELECT *  FROM marriages WHERE caste LIKE '%${data.name}%'`;
	}else if(data.columnid==6){
	     var QRY_TO_EXEC = `SELECT *  FROM marriages WHERE 	spirti LIKE '%${data.name}%'`;
	}
	console.log(QRY_TO_EXEC);
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



exports.getjobmdl = function (data, callback) {
	var cntxtDtls = "in getjobmdl";
	var QRY_TO_EXEC = `select id,jobtitle, qualification, experience from jobs where d_in=0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.searchjobswisemdl = function (data, callback) {
	var cntxtDtls = "in searchjobswisemdl";
	if (data.colid==1){
	     var QRY_TO_EXEC = `SELECT *  FROM jobs WHERE jobtitle LIKE '%${data.name}%'`;
	}else if(data.colid==2){
	     var QRY_TO_EXEC = `SELECT *  FROM jobs WHERE qualification LIKE '%${data.name}%'`;
	}else if(data.colid==3){
	     var QRY_TO_EXEC = `SELECT *  FROM jobs WHERE experience LIKE '%${data.name}%'`;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getattmdl = function (data, callback) {
	var cntxtDtls = "in getattmdl";
	var QRY_TO_EXEC = `select  * from attacks  where approval_ind = 1 and d_in = 0 `;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.addvideossubmitMdl = function (data, callback) {
	var cntxtDtls = "in addvideossubmitMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = `insert into video (category_id,categoryname,image,cts)
			  values('${data.project_id}','${data.project_name}','${data.data.banner_url}','${date}');`
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.getvideoCatenamedataMdl = function (callback) {
	var cntxtDtls = "in getvideoCatenamedataMdl";
	var QRY_TO_EXEC = `select * from video_category where d_in = 0`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.addvideoCatenamedataMdl = function (data, img_links, callback) {
	var cntxtDtls = "in addvideoCatenamedataMdl";
	var QRY_TO_EXEC = `insert into video_category (categoryname,image) values( '${data.data.catename}','${img_links}') ; `;
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.getvideodata11Mdl = function (callback) {
	var cntxtDtls = "in getvideodata11Mdl";
	var QRY_TO_EXEC = `select * from video where  d_in=0 order by id desc`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}

exports.searchinorganizationsmdl = function (data, callback) {
	var cntxtDtls = "in searchinorganizationsmdl";
	if (data.columnid==1){
	     var QRY_TO_EXEC = `SELECT *  FROM independentorganisation_reg WHERE denomation LIKE '%${data.name}%'`;
	}else if(data.columnid==2){
	     var QRY_TO_EXEC = `SELECT *  FROM independentorganisation_reg WHERE ministry_id LIKE '%${data.name}%'`;
	}else if(data.columnid==3){
	     var QRY_TO_EXEC = `SELECT *  FROM independentorganisation_reg WHERE service_name LIKE '%${data.name}%'`;
	}else if(data.columnid==4){
	     var QRY_TO_EXEC = `SELECT *  FROM independentorganisation_reg WHERE districts LIKE '%${data.name}%'`;
	}else if(data.columnid==5){
	     var QRY_TO_EXEC = `SELECT *  FROM independentorganisation_reg WHERE constituencyname LIKE '%${data.name}%'`;
	}else if(data.columnid==6){
	     var QRY_TO_EXEC = `SELECT *  FROM independentorganisation_reg WHERE mandals LIKE '%${data.name}%'`;
	}else if(data.columnid==7){
	     var QRY_TO_EXEC = `SELECT *  FROM independentorganisation_reg WHERE panchayati LIKE '%${data.name}%'`;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.searchorganizationmdl = function (data, callback) {
	var cntxtDtls = "in searchorganizationmdl";
	if (data.df == 1) {
		var QRY_TO_EXEC = `select * from independentorganisation_reg where d_in=0 and denomation= '${data.denomation_id}'`;
	} else if (data.df == 2) {
		var QRY_TO_EXEC = `select * from independentorganisation_reg where d_in=0 and denomation= '${data.denomation_id}' and ministry_id = '${data.ministry_id}' `;
	}
	else if (data.df == 3) {
		var QRY_TO_EXEC = `select * from independentorganisation_reg where d_in=0 and  denomation= '${data.denomation_id}' and ministry_id = '${data.ministry_id}' and service_name = '${data.service_name}'; `
	} else if (data.df == 4) {
		var QRY_TO_EXEC = `select * from independentorganisation_reg where d_in=0 and denomation= '${data.denomation_id}' and ministry_id = '${data.ministry_id}' and service_name = '${data.service_name}' and districts='${data.district_id}' `
	} else if (data.df == 5) {
		var QRY_TO_EXEC = `select * from independentorganisation_reg where d_in=0 and  denomation= '${data.denomation_id}' and ministry_id = '${data.ministry_id}' and service_name = '${data.service_name}' and districts='${data.district_id}' and constituencyname ='${data.constenncy_id}'; `
	} else if (data.df == 6) {
		var QRY_TO_EXEC = `select * from independentorganisation_reg where d_in=0 and  denomation= '${data.denomation_id}' and ministry_id = '${data.ministry_id}' and service_name = '${data.service_name}' and districts='${data.district_id}' and constituencyname ='${data.constenncy_id}'  and mandals ='${data.mandal_id}'; `
	} else if (data.df == 7) {
		var QRY_TO_EXEC = `select * from independentorganisation_reg where d_in=0 and  denomation= '${data.denomation_id}' and ministry_id = '${data.ministry_id}' and service_name = '${data.service_name}' and districts='${data.district_id}' and constituencyname ='${data.constenncy_id}'  and mandals ='${data.mandal_id}' and panchayati ='${data.panchayati_id}'; `
	} 
	else {
		var QRY_TO_EXEC = `select * from independentorganisation_reg where d_in=0 and denomation= '${data.denomation_id}' and ministry_id = '${data.ministry_id}' and ministry_id = '${data.ministry_id}' and service_name = '${data.service_name}'`;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getorganizationsMdl = function (id, callback) {
	var cntxtDtls = "in getorganizationsMdl";
	var QRY_TO_EXEC = `SELECT * from independentorganisation_reg where d_in=0 order by id desc;`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getpastorsfiltersMdl = function (data, callback) {
	var cntxtDtls = "in getpastorsfiltersMdl";
	var QRY_TO_EXEC = `SELECT * FROM pastor_reg  where d_in=0   AND district_id  = '${data.districts}' AND constituency_id  = '${data.constituencyname}' AND mandal_id='${data.mandal_id}'`;
	console.log(QRY_TO_EXEC);
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getchurchesdatafiltersMdl = function (data, callback) {
	var cntxtDtls = "in getchurchesdatafiltersMdl";
	var QRY_TO_EXEC = `SELECT * FROM church_reg   where d_in=0   AND district_id  = '${data.districts}' AND constituency_id   = '${data.constituencyname}' AND mandal_id='${data.mandal_id}'`;
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
///////church view///////////////////
exports.viewupdatesMdl = function (data, callback) {
	var cntxtDtls = "in viewupdatesMdl";
	var QRY_TO_EXEC = `SELECT * FROM church_reg as a join pastor_reg as b on a.pastor_id=b.id   AND a.district_id  = '${data.districts}' AND a.constituency_id   = '${data.constituencyname}' AND a.mandal_id='${data.mandal_id}' AND a.church_name   = '${data.church}'`;
	console.log(QRY_TO_EXEC);
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
// constit level view in search

// exports.pastorviewupdatesMdl = function (data, callback) {
// 	var cntxtDtls = "in pastorviewupdatesMdl";
// 	var QRY_TO_EXEC = `SELECT * FROM pastor_reg   where d_in=0   AND district_id  = '${data.districts}' AND constituency_id   = '${data.constituencyname}'  AND pastorname   = '${data.pastor_id}'`;
// 	console.log(QRY_TO_EXEC);
// 	if (callback && typeof callback == "function") {
// 		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
// 			callback(err, results);
// 			return;
// 		});
// 	}
// 	else
// 		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
// };
////////pastor view/////////////////////////

exports.pastorviewupdatesMdl = function (data, callback) {
	var cntxtDtls = "in pastorviewupdatesMdl";
	var QRY_TO_EXEC = `SELECT * FROM pastor_reg   where d_in=0   AND district_id  = '${data.districts}' AND constituency_id   = '${data.constituencyname}' AND mandal_id='${data.mandal_id}' AND pastorname   = '${data.pastor_id}'`;
	console.log(QRY_TO_EXEC);
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};


exports.checknumberrmdl = function (data, callback) {
	var cntxtDtls = "in checknumberrmdl";
	if (data.category == 1) {
	  var QRY_TO_EXEC = `select * from signup_form where mobile_number ='${data.number}'and d_in=0 `;
	} else if (data.category == 2) {
	     var QRY_TO_EXEC = `select * from student_reg where number ='${data.number}'and d_in=0 `;
	} else if (data.category == 3) {
	       var QRY_TO_EXEC = `select * from ministry_signup where headnmber ='${data.number}'and d_in=0 `;
	} else if (data.category == 4) {
	     var QRY_TO_EXEC = `select * from pastor_reg where phonenumber ='${data.number}'and d_in=0 `;
	} else if (data.category == 5) {
	     var QRY_TO_EXEC = `select * from church_reg where contactnumber ='${data.number}'and d_in=0 `;
	} else if (data.category == 6) {
	    var QRY_TO_EXEC = `select * from independentorganisation_reg where contact_num ='${data.number}'and d_in=0 `;
	} else if (data.category == 7) {
	     var QRY_TO_EXEC = `select * from pastors_associations where phonenumber ='${data.number}'and d_in=0 `;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.postinfo = function (data, callback) {
	var cntxtDtls = "in postinfo";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	 if (data.category == 1) {
	     	     var QRY_TO_EXEC = ` insert into  signup_form  (fname,mobile_number,district_id,constituency_id,mandal_id,panchayat_id,password,cts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.password}','${date}') `
	    } else if (data.category == 2) {
            	var QRY_TO_EXEC = `insert into  student_reg  (studentname,number,district_id,constituency_id,mandal_id,village_id,password,i_ts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.password}','${date}')`
          } else if (data.category == 3) {
           	var QRY_TO_EXEC = `insert into  ministry_signup  (ministryname,headnmber,district_id,constituency_id,mandal_id,panchayat_id,password,dts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.password}','${date}') `
          } else if (data.category == 4) {
          	var QRY_TO_EXEC = `  insert into  pastor_reg  (pastorname,phonenumber,district_id,constituency_id,mandal_id,village_id,password,i_ts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.password}','${date}') `
          } else if (data.category == 5) {
           	var QRY_TO_EXEC = ` insert into  church_reg  (church_name,contactnumber,denomination_id,district_id,constituency_id,mandal_id,village_id,password,cts)values( '${data.name}','${data.number}','1', '${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.password}','${date}') `
          } else if (data.category == 6) {
          	var QRY_TO_EXEC = ` insert into  independentorganisation_reg  (	organisation_name,contact_num,districts,constituencyname,mandals,panchayati,password,ctsdate)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.password}','${date}') `
          } else if (data.category == 7) {
          	var QRY_TO_EXEC = ` insert into  pastors_associations  (paname,phonenumber,districtname,constituencyname,mandals,panchaiti,password,cts)values( '${data.name}','${data.number}','${data.district_id}','${data.constituency_id}','${data.mandal_id}','${data.village_id}','${data.password}' ,'${date}') `
          }
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



exports.updatecount = function (callback) {
	var cntxtDtls = "in updatecount";
	var QRY_TO_EXEC = `update visitor_count set count = count+ 1 ;`
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getcount = function (callback) {
	var cntxtDtls = "in getcount";
	var QRY_TO_EXEC = `Select * from visitor_count ; `
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.checknumberpassword = function (data , callback) {
	var cntxtDtls = "in checknumberpassword";
		if (data.category == 1) {
	  var QRY_TO_EXEC = `select * from signup_form where mobile_number ='${data.number}'and d_in=0 `;
	} else if (data.category == 2) {
	     var QRY_TO_EXEC = `select * from student_reg where number ='${data.number}'and d_in=0 `;
	} else if (data.category == 3) {
	       var QRY_TO_EXEC = `select * from ministry_signup where headnmber ='${data.number}'and d_in=0 `;
	} else if (data.category == 4) {
	     var QRY_TO_EXEC = `select * from pastor_reg where phonenumber ='${data.number}'and d_in=0 `;
	} else if (data.category == 5) {
	     var QRY_TO_EXEC = `select * from church_reg where contactnumber ='${data.number}'and d_in=0 `;
	} else if (data.category == 6) {
	    var QRY_TO_EXEC = `select * from independentorganisation_reg where contact_num ='${data.number}'and d_in=0 `;
	} else if (data.category == 7) {
	     var QRY_TO_EXEC = `select * from pastors_associations where phonenumber ='${data.number}'and d_in=0 `;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};



exports.upadtedpassword = function (data , callback) {
	var cntxtDtls = "in upadtedpassword";
		if (data.category == 1) {
	  var QRY_TO_EXEC = `Update signup_form set password='${data.password}' where mobile_number ='${data.number}'`;
	} else if (data.category == 2) {
	     var QRY_TO_EXEC = `Update student_reg set password='${data.password}' where number ='${data.number}'`;
	} else if (data.category == 3) {
	       var QRY_TO_EXEC = `Update ministry_signup set password='${data.password}' where headnmber ='${data.number}'`;
	} else if (data.category == 4) {
	     var QRY_TO_EXEC = `Update pastor_reg set password='${data.password}' where phonenumber ='${data.number}'`;
	} else if (data.category == 5) {
	     var QRY_TO_EXEC = `Update church_reg set password='${data.password}' where contactnumber ='${data.number}'`;
	} else if (data.category == 6) {
	    var QRY_TO_EXEC = `Update independentorganisation_reg set password='${data.password}' where contact_num ='${data.number}'`;
	} else if (data.category == 7) {
	     var QRY_TO_EXEC = `Update pastors_associations set password='${data.password}' where phonenumber ='${data.number}'`;
	}
	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
}

