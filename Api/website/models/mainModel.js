var sqldb = require('../../config/dbconnect');
var dbutil = require(appRoot + '/utils/dbutils');
var moment = require('moment');


// ************** Get Categories  ***************


exports.getgalleryMdl = function (callback) {
	var cntxtDtls = "in getgalleryMdl";
	var QRY_TO_EXEC = `select * from banner_dlt_t where d_in = 0 GROUP BY bannername`;
	// console.log(QRY_TO_EXEC);

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getprojectdataMdl = function (callback) {
	var cntxtDtls = "in getprojectdataMdl";
	var QRY_TO_EXEC = `select * from projects where d_in = 0 GROUP BY titlename`;
	// console.log(QRY_TO_EXEC);

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getprojectalldataMdl = function (callback) {
	var cntxtDtls = "in getprojectalldataMdl";
	var QRY_TO_EXEC = `select * from projects where d_in = 0`;
	// console.log(QRY_TO_EXEC);

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.contactdatapostMdl = function (user, callback) {
	var cntxtDtls = "in contactdatapostMdl";
	var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
	var QRY_TO_EXEC = ` insert into contactus (username, phone,company,email,message,i_ts) 
	values( '${user.username}', '${user.phone}', '${user.company}', '${user.email}', '${user.message}','${date}' ) ;`;
	// console.log(QRY_TO_EXEC);
	if (callback && typeof callback == "function")
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};
exports.getgalleryalldataMdl = function (callback) {
	var cntxtDtls = "in getgalleryalldataMdl";
	var QRY_TO_EXEC = `select * from banner_dlt_t where d_in = 0`;
	// console.log(QRY_TO_EXEC);

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getdesingdataMdl = function (callback) {
	var cntxtDtls = "in getdesingdataMdl";
	var QRY_TO_EXEC = `select * from desings where d_in = 0 GROUP BY desingname`;
	// console.log(QRY_TO_EXEC);

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};

exports.getdesingalldataMdl = function (data,callback) {
	var cntxtDtls = "in getdesingalldataMdl";
	var QRY_TO_EXEC = `select * from desings where d_in = 0 and desingname='${data.filtertypedesing}'`;
	// console.log(QRY_TO_EXEC);

	if (callback && typeof callback == "function") {
		dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, function (err, results) {
			callback(err, results);
			return;
		});
	}
	else
		return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls);
};