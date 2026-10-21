/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.postchurchregisterctrldenomationctrl
 */
var moment = require('moment');
// var http = require("https");
var fs = require('fs');
process.env.SECRET_KEY = "thisismysecretkey";
var appmdl = require('../models/mainModel');
var AWS = require('aws-sdk');
var awsS3 = 'config/aws.config.json';
var request = require('request'); //for otp
var unirest = require('unirest'); //for whtsapp 
var ImageKit = require("imagekit");
var masterVldtr = require('../validators/mstrVldt');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//single start
exports.getdashotpCtrl = function (req, res) {
  req.checkBody(masterVldtr.loginvalidations.body);
  req.getValidationResult(req.body).then(function (result) {
    if (!result.isEmpty()) {
      res.send({ "status": 601, "message": 'Invalid parameters send', "data": [], "errors": util.inspect(result.array()[0].msg_tx) });
    } else {
      var data = req.body;
      appmdl.getdashotpMdl(data, function (err, results) {
        if (err) {
          res.send({ "status": 500, "msg": "Server Error" });
          return;
        }
        if (results && results.length > 0) {
          var mobilenumber="91"+ results[0].number;
          var loginotp = Math.floor(1001 + Math.random() * 9000);
          var sms=loginotp+" is the OTP to set new Login Password. Jesus Believers Association Council (JBAC) - AP is Associating with One Crore Believers.in AP, JBACAP";
          //  var message = 'Dear Your One Time Password Is -' + loginotp;
          var message = loginotp + ' is the OTP to complete your login. It is valid for 5 minutes. Please do not share with anyone. Team Amaravathi.';
          
        // Whatsapp notification start
        //   var req = unirest("POST", "https://live-server-6023.wati.io/api/v1/sendTemplateMessages");
        //   req.headers({
        //     "postman-token": "1bd5d6f3-15e6-ffd8-4f3a-39fd50d26819",
        //     "cache-control": "no-cache",
        //     "content-type": "application/json",
        //     "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYTI5YmI2MS04ZmJlLTQzMDQtODkwYi0zMGI5YjRiMzJmZjIiLCJ1bmlxdWVfbmFtZSI6ImNtZEBhbWFyYXZhdGhpc29mdHdhcmUuY29tIiwibmFtZWlkIjoiY21kQGFtYXJhdmF0aGlzb2Z0d2FyZS5jb20iLCJlbWFpbCI6ImNtZEBhbWFyYXZhdGhpc29mdHdhcmUuY29tIiwiYXV0aF90aW1lIjoiMDQvMTEvMjAyMiAwNDowMzoyOSIsImRiX25hbWUiOiI2MDIzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQURNSU5JU1RSQVRPUiIsImV4cCI6MjUzNDAyMzAwODAwLCJpc3MiOiJDbGFyZV9BSSIsImF1ZCI6IkNsYXJlX0FJIn0.idTE2FTcuJz9tGRGDVvOsxQRZU9FzLhBGz_ItrbM5kk"
        //   });
        //   req.type("json");
        //   req.send({
        //     "template_name": "otp",
        //     "broadcast_name": "string",
        //     "receivers": [
        //       {
        //         "whatsappNumber": "91" + results[0].number,
        //         "customParams": [
        //           {
        //             "name": "name",
        //             "value": results[0].name
        //           },
        //           {
        //             "name": "shop_name",
        //             "value": 'Jbac Church'
        //           },
        //           {
        //             "name": "id",
        //             "value": loginotp
        //           }
        //         ]
        //       }
        //     ]
        //   });
        //   req.end(function (res) {
        //     if (res.error) throw new Error(res.error);
        //   });
        // Whatsapp notification end
        //   request(`http://sms.sunstechit.com/app/smsapi/index.php?key=55C4941BC46BE5&campaign=0&routeid=13&type=text&contacts=${results[0].number}&senderid=AMVTIT&msg=${message}&template_id=1207165884239050921`, function (error, response, body) {
        //   })
var options = {
  'method': 'POST',
  'url': `http://103.241.136.228/api/mt/SendSMS?APIKey=0ZH9ky5ak0Kx6DwDgCbrnw&senderid=JBACAP&channel=2&DCS=0&flashsms=0&number=${mobilenumber}&text=${sms}&route=31`,
  'headers': {
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
});
          appmdl.addOtpMdl(loginotp, results[0].number, function (err, results) {
            if (err) {
              res.send({ "status": 500, "msg": err });
              return;
            }
            res.send({ 'status': 200, 'usr_data': results });
          });
        } else {
          res.send({ "status": 202, "message": 'invalid UserName or Password' });
        }
      });
    }
  });
};




exports.getUserDataCtrl = function (req, res) {
  var phone = req.body.phone;
  var usr_pwd = req.body.usr_pwd;
  appmdl.checkUserExistMdl(phone, usr_pwd, function (err, results) {
    if (err) {
      res.send({ "status": 500, "msg": "Server Error" });
      return;
    }
    if (results && results.length > 0) {
      appmdl.getUserDataMdl(results[0].id, function (err, usrMenu) {
        if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        usrMenu[1].map(res => {
          res.submenu = [];
        })
        usrMenu[0].map(res => {
          var subdata = usrMenu[1].filter(obj => {
            return obj.module_id == res.id;
          })
          if (subdata.length) {
            res.submenu = subdata;
          } else {
            res.submenu = [];
          }
        })
        //
        res.send({ 'status': 200, 'data': usrMenu[0], 'usr_data': results });
      });
    } else {
      res.send({ "status": 202, "message": 'invalid UserName or Password' });
    }
  });
}
exports.deleteUsersCtrl = function (req, res) {
  var ind = req.params.ind;
  appmdl.deleteUsersMdl(ind, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.addUsersCtrl = function (req, res) {
  var data = req.body;
  appmdl.getdashotpMdl(data, function (err, results) {
    if (err) {
      res.send({ "status": 500, "msg": "Server Error" });
      return;
    }
    if (results && results.length > 0) {
      res.send({ "status": 202, "message": 'User Already Exist' });
    } else {
      appmdl.addUsersMdl(data, function (err, results) {
        if (err) {
          res.send({ 'status': 500, 'data': results });
          return;
        }
        res.send({ 'status': 200, 'data': results });
      });

    }
  });
}

exports.globalGeCtrl = function (req, res) {
  var tablename = req.params.tablename;
  appmdl.globalGetMdl(tablename, function (err, results) {

    //encrypt start
    var cipher = crypto.createCipher('aes-256-cbc', '123456');
    var encrypted = Buffer.concat([cipher.update(new Buffer(JSON.stringify(results), "utf8")), cipher.final()]);
    //encrypt end
    //decrypt start
    var decipher = crypto.createDecipher("aes-256-cbc", '123456');
    var decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    var decrypted_result = JSON.parse(decrypted.toString());
    //decrypt end

    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.getUserPermissionsCtrl = function (req, res) {
  appmdl.getUserPermissionsMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.getModulesCtrl = function (req, res) {
  var id = req.params.id
  appmdl.getModulesMdl(id, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    // var module = results[0].filter( resp => { 
    //     return !results[2].find( obj => {
    //         return resp.id == obj.module_id
    //     })
    // })

    var sub = results[1].filter(resp => {
      return !results[2].find(obj => {
        return resp.id == obj.sub_module_id
      })
    })

    var module = results[0].filter(resp => {
      return sub.find(obj => {
        return resp.id == obj.module_id
      })
    })
    module.map(res => {
      res.sub = sub.filter(pogo => {
        return pogo.module_id == res.id;
      })
    })
    // module = module.filter( fes => {})

    // results[0].map( mod => {
    //     mod.sub = results[1].filter( sub => { 
    //         return !results[2].find( user => {
    //             return user.sub_module_id == sub.id ;
    //         })
    //      })
    // })

    res.send({ 'status': 200, 'data': [module, sub], 'permissions': results[3] });
  });
}

exports.submitpermissionsCtrl = function (req, res) {
  var data = req.body;
  appmdl.submitpermissionsMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.deletePermissionsCtrl = function (req, res) {
  var data = req.body
  appmdl.deletePermissionsMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
//add category start

// user permission start
exports.getmodulelistdetailsCtrl = function (req, res) {
  var usr_id = req.params.usr_id;
  appmdl.getmodulelistdetailsMdl(usr_id, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }

    res.send({ 'status': 200, 'data': results });


  });
}

exports.userpermissiondatactrl = function (req, res) {
  appmdl.userpermissiondatactrlmd1(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.getemployeelistdataCtrl = function (req, res) {
  appmdl.getemployeelistdataMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }

    res.send({ 'status': 200, 'data': results });


  });
}

exports.postusermenulistCtrl = function (req, res) {
  var dataarr = req.body;
  var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");

  var module_id = dataarr[0].module_id;
  var user_id = dataarr[0].user_id;
  dataarr = dataarr.map(obj => {
    return [obj.user_id, obj.module_id, obj.id]
  })
  appmdl.postusermenulistMdl(dataarr, module_id, user_id, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }

    res.send({ 'status': 200, 'data': results });


  });
}


// user permission end

// exports.updateprofileCtrl = function (req, res) {
//   var data = req.body;
//   if (data.imageupdatestatus == true) {
//     var reviewImgArr1 = data.image_array;
//     var imageupload1 = '';
//     var array = reviewImgArr1[0].reviewimg1.split(',');
//     var datetimestamp = Date.now();
//     var random_number = Math.floor(100000 + Math.random() * 900000);
//     var unicnumber = random_number + '' + datetimestamp;
//     var base64Data = array[1];
//     var filetype = reviewImgArr1[0].filetype;
//     fs.writeFile("../public_html/uploads/gallery/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
//     var imglink = "http://texturespace.in/uploads/gallery/" + unicnumber + '.' + filetype;

//   } else {
//     var imglink = data.imageurl;
//   }
//   appmdl.updateprofileMdl(data, imglink, function (err, results) {
//     if (err) {
//       res.send({ 'status': 500, 'data': results });
//       return;
//     }
//     res.send({ 'status': 200, 'data': results });

//   });
// }
//Analysis

exports.getusersanalysisCtrl = function (req, res) {
  appmdl.getusersanalysisMdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.toatlcntsordersCtrl = function (req, res) {
  appmdl.toatlcntsordersMdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.toatlcntstudentsordersDataCtrl = function (req, res) {
  appmdl.toatlcntstudentsordersDataMdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.toatlcntbelieversDataCtrl = function (req, res) {
  appmdl.toatlcntbelieversDataMdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.totalcountsCtrl = function (req, res) {
  appmdl.totalcountsMdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.toatlchurchcntsordersCtrl = function (req, res) {
  appmdl.toatlchurchcntsordersmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.toatlcntsindchurchCtrl = function (req, res) {
  appmdl.toatlcntsindchurchmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.toatlreggchurchcountsCtrl = function (req, res) {
  appmdl.toatlreggchurchcountsmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.totalpastordistcntCtrl = function (req, res) {
  appmdl.totalpastordistcntmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.ministry_cntsCtrl = function (req, res) {
  appmdl.ministry_cntsmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.attackas_cntsCtrl = function (req, res) {
  appmdl.attackas_cntsmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.jobs_cntsCtrl = function (req, res) {
  appmdl.jobs_cntsCtrlmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.marriages_cuntssCtrl = function (req, res) {
  appmdl.marriages_cuntssCtrlmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.attacks_cuntsCtrl = function (req, res) {
  appmdl.attacks_cuntsCtrlmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.institutes_cuntsCtrl = function (req, res) {
  appmdl.institutes_cuntsCtrlmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.topfiveItemsCtrl = function (req, res) {
  appmdl.topfiveItemsMdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}



//notifiction method start
singlevendornotifications = function (device, msgtext, seckey, appid, android_channel_id, sound, small_icon, titleHeading) {
  var restKey = '';
  var respon;
  var appID = '';
  var message = {
    "android_visibility": 1,
    // "android_sound": sound,
    // "sound": sound,
    app_id: appid,
    contents: { "en": msgtext },
    "headings": {
      "en": titleHeading
    },
    // "android_channel_id": android_channel_id,
    include_player_ids: device,
    "priority": 10,
    "playSound": true,
    "small_icon": small_icon
  };
  var headers = {
    "Content-Type": "application/json;",
    "Authorization": "Basic " + seckey
  };
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  var https = require('https');
  var req = https.request(options, function (res) {
    res.on('data', function (data) {
      respon = data;
      //   //
    });
  });
  req.on('error', function (e) {
  });
  req.write(JSON.stringify(message));
  req.end();
};
//notifiction method end

// mis reports start
exports.getExpandDataCtrl = function (req, res) {
  appmdl.getExpandDataMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.addExpandCtrl = function (req, res) {
  var data = req.body;
  appmdl.addExpandMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.getAccountCtrl = function (req, res) {
  appmdl.getAccountMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.datewiseExpandCtrl = function (req, res) {
  var ind = req.params.ind;
  appmdl.datewiseExpandMdl(ind, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.getEnquiryCtrl = function (req, res) {
  appmdl.getEnquiryMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.addEnquiryCtrl = function (req, res) {
  var data = req.body;
  appmdl.addEnquiryMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.deleteEnquiryCtrl = function (req, res) {
  var id = req.params.id
  appmdl.deleteEnquiryMdl(id, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
// // mis reports end

exports.getaboutwebsitectrl = function (req, res) {
  var data = req.body;
  appmdl.getaboutwebsiteMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.submiteventCtrl = function (req, res) {
  var data = req.body;
  appmdl.submiteventMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.passwordwebsiteloginctrl = function (req, res) {
  var data = req.body;
  appmdl.checkloginwebsitenumbermdl(data, function (err, numresults) {
    if (numresults.length) {
      appmdl.passwordwebsiteloginmdl(data, function (err, results) {
        if (results.length == 0) {
          res.send({ 'status': 600 });
        } else {
          res.send({ 'status': 200, 'data': results });
        }
      });
    } else {
      res.send({ 'status': 250 });
    }
  });
}

exports.getupdatesctrl = function (req, res) {
  var data = req.body;
  appmdl.getupdatesMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}




exports.denomationctrl = function (req, res) {
  var data = req.body;
  appmdl.denomationMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.leaderlevelctrl = function (req, res) {
  var data = req.body;
  appmdl.leaderlevelMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.educationctrl = function (req, res) {
  var data = req.body;
  appmdl.educationMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

// exports.patternctrl = function (req, res) {
//   var data = req.body;
//   appmdl.patternMdl(data, function (err, results) {
//     if (err) {
//       res.send(500, "Server Error");
//       return;
//     }
//     res.send({ 'status': 200, 'data': results });
//   });
// }


exports.getdistrictsctrl = function (req, res) {
  var data = req.body;
  console.log(data);
  appmdl.getdistrictsMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getmandalsctrl = function (req, res) {
  var data = req.body;
  appmdl.getmandalsMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.gepanchayatictrl = function (req, res) {
  var data = req.body;
  appmdl.gepanchayatiMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.getbeliversctrl = function (req, res) {
  var data = req.body;
  appmdl.getbeliversMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getservicesctrl = function (req, res) {
  var data = req.body;
  appmdl.getservicesMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.addNewCtrl = function (req, res) {
  var proofdata = req.body;
  appmdl.checkserviceMdl(proofdata, function (err, results) {
    if (results.length) {
      res.send({ 'status': 300, 'data': [] });
    }
    else {
      appmdl.addNewpageMdl(proofdata, function (err, results) {
        if (err) {
          res.send({ 'status': 500, 'data': results });
          return;
        }
        res.send({ 'status': 200, 'data': results });
      });
    }
  });
}




exports.getconsistencysctrl = function (req, res) {
  var data = req.body;
  appmdl.getconsistencysMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getchurchctrl = function (req, res) {
  var data = req.body;
  appmdl.getchurchMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getpastorctrl = function (req, res) {
  var data = req.body;
  appmdl.getpastorMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.postmeetingsCtrl = function (req, res) {
  var data = req.body;
  var img_links = [];
  var reviewImgArr = data.reviewImg
  reviewImgArr.forEach(element => {
    var image_url = element.reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = element.filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  appmdl.postmeetingsMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.postchurchmeetingsCtrl = function (req, res) {
  var data = req.body;
  appmdl.postchurchmeetingsMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.postinsututiesCtrl = function (req, res) {
  var data = req.body;
  var reviewImgArr1 = data.image[0];
  
  if(data.image.length == 0){
      appmdl.postinsututiesMdl(data,function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
  }else{
  var imageupload = '';
  var array = reviewImgArr1.reviewimg.split(',');
  var base64Data = array[1];
  var datetimestamp = Date.now();
  var random_number = Math.floor(100000 + Math.random() * 900000);
  var unicnumber = random_number + '' + datetimestamp;
  var filetype = reviewImgArr1.filetype;
  fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
  });
  imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
  appmdl.postinsututiesMdl(data, imageupload, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
  }
  
}

exports.postcollegesCtrl = function (req, res) {
  var data = req.body;
  appmdl.postcollegesMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
// exports.postjobsCtrl = function (req, res) {
//   var data = req.body;
//   appmdl.postjobsMdl(data, function (err, results) {
//     if (err) {
//       res.send(500, "Server Error");
//       return;
//     }
//     res.send({ 'status': 200, 'data': results });
//   });
// }
exports.postjobsCtrl = function (req, res) {
  var data = req.body;
  var img_links = [];
  var reviewImgArr = data.reviewImg
  reviewImgArr.forEach(element => {
    var image_url = element.reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = element.filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  appmdl.postjobsMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

//////////////////////////////////////////////////////////////////////////////Login////////////////////////////////////////////

exports.postbeliversignupCtrl = function (req, res) {
  var data = req.body;
  appmdl.postbeliversignupMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.studentsignupCtrl = function (req, res) {
  var data = req.body;
  appmdl.studentsigniupMdl(data, function (err, results) {
        if (err) {
          res.send(500, "Server Error");
          return;
        }
        res.send({ 'status': 200, 'data': results });
      });
}

exports.postministrysignupCtrl = function (req, res) {
  var data = req.body;
  appmdl.postministrysignupMdl(data, function (err, results) {
        if (err) {
          res.send(500, "Server Error");
          return;
        }
        res.send({ 'status': 200, 'data': results });
      });
}
exports.postregformCtrl = function (req, res) {
  var data = req.body;
  appmdl.postregformMdl(data, function (err, results) {
        if (err) {
          res.send(500, "Server Error");
          return;
        }
        res.send({ 'status': 200, 'data': results });
      });
}



exports.postwishformCtrl = function (req, res) {
  var data = req.body;
  var img_links = [];
  var reviewImgArr = data.reviewImg
  reviewImgArr.forEach(element => {
    var image_url = element.reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = element.filetype;
    fs.writeFile("../public_html/wishimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/wishimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  appmdl.postwishformMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.postpastorctrl = function (req, res) {
  var data = req.body;
  appmdl.postpastorMdl(data, function (err, results) {
        if (err) {
          res.send(500, "Server Error");
          return;
        }
        res.send({ 'status': 200, 'data': results });
      });
}

exports.postchurchregisterctrl = function (req, res) {
  var data = req.body;
  appmdl.postchurchregistermdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
     res.send({ 'status': 200, 'data': results });
   });
}

exports.postpastorassociationsctrl = function (req, res) {
  var data = req.body;
  appmdl.postpastorassociationsmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.postindepedentorganisationctrl = function (req, res) {
  var data = req.body;
  appmdl.postindepedentorganisationmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
         return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

// exports.postindepedentchurchctrl = function (req, res) {
//   var data = req.body;
//       var reviewImgArr = data.church_img;
//       var img_links = [];
//       reviewImgArr.forEach(element => {
//         var image_url = reviewImgArr[0].reviewimg;
//         var array = image_url.split(',');
//         var base64Data = array[1];
//         var datetimestamp = Date.now();
//         var random_number = Math.floor(100000 + Math.random() * 900000);
//         var unicnumber = random_number + '' + datetimestamp;
//         var filetype = reviewImgArr[0].filetype;
//         fs.writeFile("../public_html/jaimage/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
//         });
//         imageupload = "https://jcijcom.com/jaimage/" + unicnumber + '.' + filetype;
//         img_links.push(imageupload)
//       });
//       appmdl.postindepedentchurchMdl(imageupload, data, function (err, results) {
//         if (results) {
//           appmdl.postindependentchurchlogin('Independent Church', '7', results.insertId, data, function (err, results) {
//             if (err) {
//               res.send(500, "Server Error");
//               return;
//             }
//             res.send({ 'status': 200, 'data': results });
//           });
//         } else {
//           res.send({ 'status': 500 });
//         }
//       });

// }


exports.getpersonalctrl = function (req, res) {
  var data = req.body;
  appmdl.getpersonalmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.getyouthmeetingctrl = function (req, res) {
  var data = req.body;
  appmdl.getyouthmeetingMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getrevivalctrl = function (req, res) {
  var data = req.body;
  appmdl.getrevivalMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getwomenctrl = function (req, res) {
  var data = req.body;
  appmdl.getwomenMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getpastormeetingctrl = function (req, res) {
  var data = req.body;
  appmdl.getpastormeetingMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getchildernctrl = function (req, res) {
  var data = req.body;
  appmdl.getchildernMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getmusicalctrl = function (req, res) {
  var data = req.body;
  appmdl.getmusicalMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.searchingdataCtrl = function (req, res) {
  var data = req.body;
  appmdl.searchingdatamdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.searchingchurchdataCtrl = function (req, res) {
  var data = req.body;
  appmdl.searchingchurchdatamdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.getchurchesctrl = function (req, res) {
  var data = req.body;
  appmdl.getchurchesMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getwingCtrl = function (req, res) {
  var data = req.body;
  appmdl.getwingmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}



// exports.postattackCtrl = function (req, res) {
//   var data = req.body;

//   var image_url = data.videoa;
//   var array = image_url.split(',');
//   var base64Data = array[1];
//   var datetimestamp = Date.now();
//   var random_number = Math.floor(100000 + Math.random() * 900000);
//   var unicnumber = random_number + '' + datetimestamp;
//   fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + 'mp4', base64Data, 'base64', function (err) { });
//   var video1 = "https://jbac.in/websiteimages/" + unicnumber + '.' + 'mp4';

//   var image_url = data.videob;
//   var array = image_url.split(',');
//   var base64Data = array[1];
//   var datetimestamp = Date.now();
//   var random_number = Math.floor(100000 + Math.random() * 900000);
//   var unicnumber = random_number + '' + datetimestamp;
//   fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + 'mp4', base64Data, 'base64', function (err) { });
//   var video2 = "https://jbac.in/websiteimages/" + unicnumber + '.' + 'mp4';

//   var image_url = data.audio;
  
//   var array = image_url.split(',');
//   var base64Data = array[1];
//   var datetimestamp = Date.now();
//   var random_number = Math.floor(100000 + Math.random() * 900000);
//   var unicnumber = random_number + '' + datetimestamp;
//   fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + 'mp3', base64Data, 'base64', function (err) { });
//   var audio = "https://jbac.in/websiteimages/" + unicnumber + '.' + 'mp3';

//   appmdl.postattackMdl(data, video1, video2, audio, function (err, results) {
//     var reviewImgArr = data.image;
//     if (results) {
//       var imgCnt = 0;
//       for (var j = 0; j < reviewImgArr.length; j++) {
//         (function (i) {
//           setTimeout(function () {
//             var image_url = reviewImgArr[i].reviewImg;
//             var array = image_url.split(',');
//             var base64Data = array[1];
//             var datetimestamp = Date.now();
//             var random_number = Math.floor(100000 + Math.random() * 900000);
//             var unicnumber = random_number + '' + datetimestamp;
//             var filetype = reviewImgArr[i].filetype;
//             fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
//             });
//             var imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
//             if (i == 0) {
//               var img = 'image1';
//             }
//             if (i == 1) {
//               var img = 'image2';
//             }
//             if (i == 2) {
//               var img = 'image3';
//             }
//             appmdl.updateimagesattackMdl(imageupload, results.insertId, img, function (err, reresults) {
//               if (err) {
//                 res.status(500).send("Server Error");
//                 return;
//               }
//               imgCnt++;
//               if (imgCnt == reviewImgArr.length) {
//                 for (var j = 0; j < data.document.length; j++) {
//                   (function (i) {
//                     setTimeout(function () {

//                       var image_url = data.document[i].reviewimg;
//                       var array = image_url.split(',');
//                       var base64Data = array[1];
//                       var datetimestamp = Date.now();
//                       var random_number = Math.floor(100000 + Math.random() * 900000);
//                       var unicnumber = random_number + '' + datetimestamp;
//                       fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + 'pdf', base64Data, 'base64', function (err) {
//                       });
//                       var docupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + 'pdf';
//                       if (i == 0) {
//                         var doc = 'document1';
//                       }
//                       if (i == 1) {
//                         var doc = 'document2';
//                       }
//                       if (i == 2) {
//                         var doc = 'document3';
//                       }
//                       appmdl.updatedocattackMdl(docupload, results.insertId, doc, function (err, results) {
//                         if (err) {
//                           res.status(500).send("Server Error");
//                           return;
//                         }
//                         imgCnt++;
//                       })
//                     }, (i % reviewImgArr.length) * 800);
//                   })(j);
//                 }
//                 res.send({ 'status': 200, 'data': results });
//               }
//             })
//           }, (i % reviewImgArr.length) * 800);
//         })(j);
//       }
//     } else {
//       res.send({ 'status': 500 });
//     }
//   });
// }

exports.postattackCtrl = function (req, res) {
  var data = req.body;
   console.log(data);
  var video1 = '';
  var video2 = '';
  if (data.videoa != undefined) {
    var image_url = data.videoa;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + 'mp4', base64Data, 'base64', function (err) { });
    var video1 = "https://jbac.in/websiteimages/" + unicnumber + '.' + 'mp4';
  } else {
    var video1 = '';
  }
  if (data.videob != undefined) {
    var image_url = data.videob;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + 'mp4', base64Data, 'base64', function (err) { });
    var video2 = "https://jbac.in/websiteimages/" + unicnumber + '.' + 'mp4';
  } else {
    var video2 = '';
  }
  if (data.audio != undefined) {
    var image_url = data.audio;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + 'mp3', base64Data, 'base64', function (err) { });
    var audio = "https://jbac.in/websiteimages/" + unicnumber + '.' + 'mp3';
  } else {
    var audio = '';
  }
  appmdl.postattackMdl(data, video1, video2, audio, function (err, results) {
    var reviewImgArr = data.image;
    if (data.image.length != 0) {
      if (results) {
        var imgCnt = 0;
        for (var j = 0; j < reviewImgArr.length; j++) {
          (function (i) {
            setTimeout(function () {
              var image_url = reviewImgArr[i].reviewImg;
              var array = image_url.split(',');
              var base64Data = array[1];
              var datetimestamp = Date.now();
              var random_number = Math.floor(100000 + Math.random() * 900000);
              var unicnumber = random_number + '' + datetimestamp;
              var filetype = reviewImgArr[i].filetype;
              fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
              });
              var imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
              if (i == 0) {
                var img = 'image1';
              }
              if (i == 1) {
                var img = 'image2';
              }
              if (i == 2) {
                var img = 'image3';
              }
              appmdl.updateimagesattackMdl(imageupload, results.insertId, img, function (err, reresults) {
                if (err) {
                  res.status(500).send("Server Error");
                  return;
                }
                imgCnt++;
                if (imgCnt == reviewImgArr.length) {
                  for (var j = 0; j < data.document.length; j++) {
                    (function (i) {
                      setTimeout(function () {

                        var image_url = data.document[i].reviewimg;
                        var array = image_url.split(',');
                        var base64Data = array[1];
                        var datetimestamp = Date.now();
                        var random_number = Math.floor(100000 + Math.random() * 900000);
                        var unicnumber = random_number + '' + datetimestamp;
                        fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + 'pdf', base64Data, 'base64', function (err) {
                        });
                        var docupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + 'pdf';
                        if (i == 0) {
                          var doc = 'document1';
                        }
                        if (i == 1) {
                          var doc = 'document2';
                        }
                        if (i == 2) {
                          var doc = 'document3';
                        }
                        appmdl.updatedocattackMdl(docupload, results.insertId, doc, function (err, results) {
                          if (err) {
                            res.status(500).send("Server Error");
                            return;
                          }
                          imgCnt++;
                        })
                      }, (i % reviewImgArr.length) * 800);
                    })(j);
                  }
                  res.send({ 'status': 200, 'data': results });
                }
              })
            }, (i % reviewImgArr.length) * 800);
          })(j);
        }
      } else {
        res.send({ 'status': 500 });
      }
    } else {
      res.send({ 'status': 200, 'data': results });
    }
  });
}


exports.getwebsitegalleryctrl = function (req, res) {
  var data = req.body;
  appmdl.getwebsitegallerymdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

//prasad start//


exports.posthomebannersctrl = function (req, res) {
  var data = req.body;
  var reviewImgArr = data.reviewImg;
  //image start
  var img_links = [];
  reviewImgArr.forEach(element => {
    var image_url = reviewImgArr[0].reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();

    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = reviewImgArr[0].filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  //image End
  appmdl.pposthomebannersSubmitmdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.gethomebannersCtrl = function (req, res) {
  appmdl.gethomebannersMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.deletehomepagedatactrl = function (req, res) {
  var id = req.params.id;
  appmdl.deletehomepagedatamdl(id, function (err, results) {
    if (err) {

      res.send(500, "Server Error");
      return;
    }
    res.send({ "status": 200, "data": results });
  });
}
exports.updatepposthomebannersSubmitctrl = function (req, res) {
  var data = req.body;
  appmdl.updatepposthomebannersSubmitmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.edithomebannerimageCtrl = function (req, res) {
  var data = req.body;
  var reviewImgArr = data.img;
  //image start
  var img_links = [];
  reviewImgArr.forEach(element => {
    var image_url = reviewImgArr[0].reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = reviewImgArr[0].filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  //image End
  appmdl.edithomebannerimagemdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.addCatenamedataCtrl = function (req, res) {
  var data = req.body;
  var reviewImgArr = data.reviewImg;
  //image start
  var img_links = [];
  reviewImgArr.forEach(element => {
    var image_url = reviewImgArr[0].reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = reviewImgArr[0].filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  //image End
  appmdl.addCatenamedataMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getCatenamedataCtrl = function (req, res) {
  appmdl.getCatenamedataMdl(function (err, results) {
    if (err) {

      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });

}
exports.addgallerysubmitctrl = function (req, res) {
  var data = req.body;
  var reviewImgArr = data.reviewImg;
  //image start
  var img_links = [];
  reviewImgArr.forEach((element, i) => {
    var image_url = reviewImgArr[i].reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = reviewImgArr[0].filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  //image End
  appmdl.addgallerysubmitMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getgallerydata11ctrl = function (req, res) {

  appmdl.getgallerydata11Mdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.updategalleryInfodatactrl = function (req, res) {
  var data = req.body;
  var reviewImgArr = data.image_array;
  // //image start
  // var img_links = [];
  // reviewImgArr.forEach((element, i) => {
  //   var image_url = reviewImgArr[i].reviewimg;
  //   var array = image_url.split(',');
  //   var base64Data = array[1];
  //   var datetimestamp = Date.now();
  //   var random_number = Math.floor(100000 + Math.random() * 900000);
  //   var unicnumber = random_number + '' + datetimestamp;
  //   var filetype = reviewImgArr[0].filetype;
  //   fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
  //   });
  //   imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
  //   img_links.push(imageupload)
  // });
  var imageupload = '';
  var array = reviewImgArr[0].reviewimg1.split(',');
  var datetimestamp = Date.now();
  var random_number = Math.floor(100000 + Math.random() * 900000);
  var unicnumber = random_number + '' + datetimestamp;
  var base64Data = array[1];
  var filetype = reviewImgArr[0].filetype;
  fs.writeFile("../public_html/websiteimages/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
  imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
  appmdl.updategalleryInfodatanew(data, imageupload, function (err, imgresults) {
    if (err) {
      res.send({ "status": 500, "msg": 'Data Submitted Failed' });
      return;
    }
    res.send({ 'status': 200, 'data': imgresults });
  });
}
exports.deletegallerydatactrl = function (req, res) {
  var id = req.params.id;
  appmdl.deletegallerydatamdl(id, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.deletecatenamedatactrl = function (req, res) {
  var id = req.params.id;
  appmdl.deletecatenamedatamdl(id, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}




exports.aboutpostCtrl = function (req, res) {
  var data = req.body
  var reviewImg = data.image;
  var imageupload = '';
  var array = reviewImg[0].reviewimg.split(',');
  var datetimestamp = Date.now();
  var random_number = Math.floor(100000 + Math.random() * 900000);
  var unicnumber = random_number + '' + datetimestamp;
  var base64Data = array[1];
  var filetype = reviewImg[0].filetype;
  fs.writeFile("../public_html/websiteimages/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
  imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
  appmdl.aboutpostmdl(data, imageupload, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.getaboutCtrl = function (req, res) {
  appmdl.getaboutMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.deleteaboutctrl = function (req, res) {
  var id = req.params.id;
  appmdl.deleteaboutmdl(id, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.updateaboutdatactrl = function (req, res) {
  var data = req.body
  appmdl.updateaboutdatamdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.editimageaboutctrl = function (req, res) {
  var data = req.body
  var reviewImg = data.image;
  var imageupload = '';
  var array = reviewImg[0].reviewimg.split(',');
  var datetimestamp = Date.now();
  var random_number = Math.floor(100000 + Math.random() * 900000);
  var unicnumber = random_number + '' + datetimestamp;
  var base64Data = array[1];
  var filetype = reviewImg[0].filetype;
  fs.writeFile("../public_html/websiteimages/" + unicnumber + "." + filetype, base64Data, 'base64', function (err) { });
  imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
  appmdl.editimageaboutmdl(data, imageupload, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.eventspostingdatactrl = function (req, res) {
  var data = req.body;
  var reviewImgArr = data.reviewImg;
  //image start
  var img_links = [];
  reviewImgArr.forEach(element => {
    var image_url = reviewImgArr[0].reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = reviewImgArr[0].filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  //image End
  appmdl.eventspostingdataMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}




// exports.postingmarriagesCtrl = function (req, res) {
//   var data = req.body;
//   var reviewImgArr = data.reviewImg;
//   //image start
//     var image_url = reviewImgArr[0].reviewimg;

//     var array = image_url.split(',');
//     var base64Data = array[1];
//     var datetimestamp = Date.now();
//     var random_number = Math.floor(100000 + Math.random() * 900000);
//     var unicnumber = random_number + '' + datetimestamp;
//     var filetype = reviewImgArr[0].filetype;
//     fs.writeFile("../public_html/dashboardimgs/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
//     });
//     imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;

//   appmdl.postingmarriagesmdl(data, imageupload, function (err, results) {
//     if (err) {
//       res.send(500, "Server Error");
//       return;
//     }
//     res.send({ 'status': 200, 'data': results });
//   });
// }

exports.postingmarriagesCtrl = function (req, res) {
  var data = req.body;
  var img_links = [];
  var reviewImgArr = data.reviewImg
  reviewImgArr.forEach(element => {
    var image_url = element.reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = element.filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  appmdl.postingmarriagesmdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}



exports.geteventpostingdataCtrl = function (req, res) {
  appmdl.geteventpostingdataMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.updateeventspostingdatactrl = function (req, res) {
  //  var id = req.params.id;
  var data = req.body;
  appmdl.updateeventspostingdataMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.deleteeventsupdatedatactrl = function (req, res) {
  var id = req.params.id;
  appmdl.deleteeventsupdatedatamdl(id, function (err, results) {
    if (err) {

      res.send(500, "Server Error");
      return;
    }
    res.send({ "status": 200, "data": results });
  });
}
exports.editscheduleimageCtrl = function (req, res) {
  var data = req.body;
  var reviewImgArr = data.img;
  //image start
  var img_links = [];
  reviewImgArr.forEach(element => {
    var image_url = reviewImgArr[0].reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = reviewImgArr[0].filetype;
    fs.writeFile("../public_html/dashboard_imgs/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://localhost.com/dashboard_imgs/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  //image End
  appmdl.editscheduleimagemdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.gatcontactusctrl = function (req, res) {
  appmdl.gatcontactusMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.getsignupregctrl = function (req, res) {
  appmdl.getsignupregMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.deleteProductDataCtrl = function (req, res) {
  var data = req.body;
  appmdl.deleteProductDataCtrlMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.getpastorregisctrl = function (req, res) {
  appmdl.getpastorregisMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.believerregctrl = function (req, res) {
  appmdl.believerregMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.studentregctrl = function (req, res) {
  appmdl.studentregMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.churchregctrl = function (req, res) {
  appmdl.churchregMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.independentchurchctrl = function (req, res) {
  appmdl.independentchurchMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.ministryregsctrl = function (req, res) {
  appmdl.ministryregsMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.ministryservicesctrl = function (req, res) {
  appmdl.ministryservicesMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.remarkssubmitdataCtrl = function (req, res) {
  var data = req.body;
  appmdl.remarkssubmitdataMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.believerremarksdataCtrl = function (req, res) {
  var data = req.body;
  appmdl.believerremarksdataMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.getjobsdatactrl = function (req, res) {
  appmdl.getjobsdataMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.churchtimingsctrl = function (req, res) {
  appmdl.churchtimingsMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.institutesctrl = function (req, res) {
  appmdl.institutesMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}




exports.getattackersdatactrl = function (req, res) {
  appmdl.getattackersdataMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.pastorleadershipregctrl = function (req, res) {
  var data = req.body;
  appmdl.pastorleadershipregMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.searchingbelieverdatactrl = function (req, res) {
  var data = req.body;
  appmdl.searchingbelieverdatactrlMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.searchingstudentsdatactrl = function (req, res) {
  var data = req.body;
  appmdl.searchingstudentsdataMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.updatevolunteersindctrl = function (req, res) {
  var data = req.body;
  var item_data = data.item_data;
  appmdl.updatevolunteersindMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.volunteerbelieverctrl = function (req, res) {
  var data = req.body;
  var item_data = data.item_data;
  appmdl.volunteerbelieverMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.volunteerstudentctrl = function (req, res) {
  var data = req.body;
  var item_data = data.item_data;
  appmdl.volunteerstudentMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.volunteerwingapprovalctrl = function (req, res) {
  var data = req.body;
  var item_data = data.item_data;
  appmdl.volunteerwingapprovalmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.volunteerbelieverwingapprovalctrl = function (req, res) {
  var data = req.body;
  var item_data = data.item_data;
  appmdl.volunteerbelieverwingapprovalmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.volunteerstudentwingapprovalctrl = function (req, res) {
  var data = req.body;
  var item_data = data.item_data;
  appmdl.volunteerstudentwingapprovalmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.getdocumentctrl = function (req, res) {
  appmdl.getdocumentMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}



exports.getaddsdataapprovalctrl = function (req, res) {
  appmdl.getaddsdataapprovalMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}





exports.getadocumentsdataactrl = function (req, res) {
  appmdl.getadocumentsdataaMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}





//prasad  end//

exports.Searchinstitutectrl = function (req, res) {
  var data = req.body;
  appmdl.Searchinstitutemdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}



exports.getcatewebsitegalleryctrl = function (req, res) {
 var data = req.body;
  appmdl.getcatewebsitegallerymdl(data,function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.Searchmarriagesctrl = function (req, res) {
  var data = req.body;
  appmdl.Searchmarriagesmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.marriagespregctrl = function (req, res) {
  var data = req.body;
  appmdl.marriagespregctrlMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.deleteattackersCtrl = function (req, res) {
  var id = req.params.id
  appmdl.deleteattackersMdl(id, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.updateattacksapprovalindctrl = function (req, res) {
  var data = req.body;
  var item_data = data.item_data;
  appmdl.updateattacksapprovalindMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.postaddsCtrl = function (req, res) {
  var data = req.body;
  var img_links = [];
  var reviewImgArr = data.reviewImg
  reviewImgArr.forEach(element => {
    var image_url = element.reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = element.filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    
    });


    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  appmdl.postaddsMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.pastorwingleadershipregctrl = function (req, res) {
  var data = req.body;
  appmdl.pastorwingleadershipregMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.searchingbelieverchurchdatactrl = function (req, res) {
  var data = req.body;
  appmdl.searchingbelieverchurchdataMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.searchingstudentchurchdatactrl = function (req, res) {
  var data = req.body;
  appmdl.searchingstudentchurchdataMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.adddocumentctrl = function (req, res) {
  var data = req.body;
  var reviewImgArr = data.image;
  //image start
  var img_links = [];
  reviewImgArr.forEach(element => {
    var image_url = reviewImgArr[0].reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = reviewImgArr[0].filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  //image End
  appmdl.adddocumentctrlmdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.deletedocumentCtrl = function (req, res) {
  var id = req.params.id
  appmdl.deletedocumentCtrlMdl(id, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}




exports.getpastorwingdataasctrl = function (req, res) {
  var data = req.body;
  appmdl.getpastorwingdataasMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.getbelieverwingdataasMdlctrl = function (req, res) {
  var data = req.body;
  appmdl.getbelieverwingdataasMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getstudentwingchurchdatactrl = function (req, res) {
  var data = req.body;
  appmdl.getstudentwingchurchdataMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getpastorsgendatactrl = function (req, res) {
  var data = req.body;
  appmdl.getpastorsgendataMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.getbelievergendatactrl = function (req, res) {
  var data = req.body;
  appmdl.getbelievergendataMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getstudentgenchurchdatactrl = function (req, res) {
  var data = req.body;
  appmdl.getstudentgenchurchdataMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.searchgetmarriagesctrl = function (req, res) {
  var data = req.body;
  appmdl.searchgetmarriagesMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.addsapprovaldatactrl = function (req, res) {
  var data = req.body;
  var item_data = data.item_data;
  appmdl.addsapprovaldatamdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.addapprovalindnewsctrl = function (req, res) {
  var data = req.body;
  var item_data = data.item_data;
  appmdl.addapprovalindnewsmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.addapprovalindforhelpctrl = function (req, res) {
  var data = req.body;
  var item_data = data.item_data;
  appmdl.addapprovalindforhelpmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.deleteaddsdataactrl = function (req, res) {
  var id = req.params.id;
  appmdl.deleteaddsdataamdl(id, function (err, results) {
    if (err) {

      res.send(500, "Server Error");
      return;
    }
    res.send({ "status": 200, "data": results });
  });
}

exports.searchjobctrl = function (req, res) {
  var data = req.body;
  appmdl.searchjobmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.contactCtrl = function (req, res) {
  var data = req.body;
  appmdl.contactMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}




exports.getaddsdatactrl = function (req, res) {
  var data = req.body;
  appmdl.getaddsdataMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.totalpastorconcstcntCtrl = function (req, res) {
  appmdl.totalpastorconcstcntmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.mndlpastorldrsCtrl = function (req, res) {
  appmdl.mndlpastorldrsmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.pnchytpastorldrsCtrl = function (req, res) {
  appmdl.pnchytpastorldrsmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.districtwiseblvrsCtrl = function (req, res) {
  appmdl.districtwiseblvrsmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.constwiseblvrsCtrl = function (req, res) {
  appmdl.constwiseblvrsmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.mndlwiseblvrsCtrl = function (req, res) {
  appmdl.mndlwiseblvrsmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.vlgwiseblvrsssCtrl = function (req, res) {
  appmdl.vlgwiseblvrsssmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.distwisestdntssCtrl = function (req, res) {
  appmdl.distwisestdntssmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.cnctcwisestndtsCtrl = function (req, res) {
  appmdl.cnctcwisestndtsCtrlmdll(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.mndlwisestndlrdsCtrl = function (req, res) {
  appmdl.mndlwisestndlrdsCtrlmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.vlgwisestntssCtrl = function (req, res) {
  appmdl.vlgwisestntssCtrlmdl(function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.getreferalcodeCtrl = function (req, res) {
  var usr_id = req.params.usr_id;
  appmdl.getreferalcodeMdl(usr_id, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}




exports.getuserprofilereportctrl = function (req, res) {
  var data = req.body;
  appmdl.getuserprofilereportmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}



exports.updateprofilectrl = function (req, res) {
  var data = req.body;
  appmdl.updateprofilemdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.updatebeliverctrl = function (req, res) {
  var data = req.body;
  appmdl.updatebelivermdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getLeaderswebsiteCtrl = function (req, res) {
  var data = req.body;
  appmdl.getLeaderswebsiteMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getLeaderswebsitewing = function (req, res) {
  var data = req.body;
  appmdl.getLeaderswebsitewing(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getUserMainCtrl = function (req, res) {
  var data = req.body;
  appmdl.getUserMainMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.gebeliverctrl = function (req, res) {
  var data = req.body;
  appmdl.gebeliverMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.gethomebannersctrl = function (req, res) {
  var data = req.body;
  appmdl.gethomebannersMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.searchingdemonationCtrl = function (req, res) {
  var data = req.body;
  appmdl.searchingdemonationmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.searchingbusinessCtrl = function (req, res) {
  var data = req.body;
  appmdl.searchingbusinessmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.posthelpingCtrl = function (req, res) {
  var data = req.body;
  var img_links = [];
  var reviewImgArr = data.reviewImg
  reviewImgArr.forEach(element => {
    var image_url = element.reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = element.filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  appmdl.posthelpingMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.gethelpingctrl = function (req, res) {
  var data = req.body;
  appmdl.gethelpingMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.postnewsCtrl = function (req, res) {
  var data = req.body;
  var img_links = [];
  var reviewImgArr = data.reviewImg
  reviewImgArr.forEach(element => {
    var image_url = element.reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = element.filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  appmdl.postnewsMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });

}

exports.getnewsctrl = function (req, res) {
  var data = req.body;
  appmdl.getnewsMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}



exports.postbusinessCtrl = function (req, res) {
  var data = req.body;
  var img_links = [];
  var reviewImgArr = data.reviewImg
  reviewImgArr.forEach(element => {
    var image_url = element.reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = element.filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });


    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  appmdl.postbusinessMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getbusinessctrl = function (req, res) {
  var data = req.body;
  appmdl.getbusinessMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.updatenewsdataactrl = function (req, res) {
  appmdl.updatenewsdataaMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getlookingforhelppctrl = function (req, res) {
  appmdl.getlookingforhelppMdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.searchgetbusinessctrl = function (req, res) {
  var data = req.body;
  appmdl.searchgetbusinessMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}





exports.searchbusinessctrl = function (req, res) {
  var data = req.body;
  appmdl.searchbusinessmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.updatebeliverctrl = function (req, res) {
  var data = req.body;
  appmdl.updatebelivermdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.updateconsisctrl = function (req, res) {
  var data = req.body;
  appmdl.updateconsisctrlMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.deleteboardmemberctrl = function (req, res) {
 var data = req.body;
  appmdl.deleteboardmemberMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getinstitutesctrl = function (req, res) {
  var data = req.body;
  appmdl.getinstitutesMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.getpastorassociationctrl = function (req, res) {
  var data = req.body;
  appmdl.getpastorassciationMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.addurlctrl = function (req, res) {
  var data = req.body;
  appmdl.addurlmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.postvideolinkdataCtrl = function (req, res) {
   var data = req.body;
   appmdl.postvideolinkdatamdl(data, function (err, results) {
     if (err) {
       res.send({ 'status': 500, 'data': results });
       return;
     }
    res.send({ 'status': 200, 'data': results });
   });
 }
exports.getvideourlctrl = function (req, res) {
  appmdl.getvideourlmdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.deleteUrlctrl = function (req, res) {
  var id = req.params.id;
  appmdl.deleteUrlmdl(id, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ "status": 200, "data": results });
  });
}

exports.checkemailctrl = function (req, res) {
  var data = req.body;
  appmdl.checkemailforgetMdl(data, function (err, results2) {
    if (results2.length == 0) {
      res.send({ 'status': 202, "message": 'Your Number not found Please Sign Up' });
    } else {
        
      var loginotp = Math.floor(1001 + Math.random() * 9000);
      
      var message = loginotp + ' is the OTP to complete your login. It is valid for 5 minutes. Please do not share with anyone. Team Amaravathi.';
      
      request(`http://103.241.136.228/Account/Login/WebAPI/APICodesindex.php?key=0ZH9ky5ak0Kx6DwDgCbrnw&campaign=0&routeid=13&type=text&contacts=${results[0].number}&senderid=AMVTIT&msg=${message}&template_id=1707169090454274342`, function (error, response, body) {
          })
      appmdl.muramallaloginotpupdate(loginotp, results2[0].number, function (err, results) {
        if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results2   });
      });
    }
  });
}

exports.checknumberctrl = function (req, res) {
  var data = req.body;
  appmdl.checknumbermdl(data, function (err, results) {
    if (results.length==0 ) {
      res.send({ 'status': 202, "message": 'Your Number not found Please Sign Up' });
    } else {
        var mobilenumber="91" +results[0].mobile_number;
          var loginotp = Math.floor(1001 + Math.random() * 9000);
          var sms=loginotp+" is the OTP to set new Login Password. Jesus Believers Association Council (JBAC) - AP is Associating with One Crore Believers.in AP, JBACAP";
    //   var loginotp = Math.floor(1001 + Math.random() * 9000);
    //   var message = loginotp + ' is the OTP to complete your login. It is valid for 5 minutes. Please do not share with anyone. Team Amaravathi.';
    //   request(`http://103.241.136.228/Account/Login/WebAPI/APICodesindex.php?key=0ZH9ky5ak0Kx6DwDgCbrnw&campaign=0&routeid=13&type=text&contacts=${results[0].number}&senderid=AMVTIT&msg=${message}&template_id=1707169090454274342`, function (error, response, body) {
    //       })
          var options = {
              
  'method': 'POST',
  'url': `http://103.241.136.228/api/mt/SendSMS?APIKey=0ZH9ky5ak0Kx6DwDgCbrnw&senderid=JBACAP&channel=2&DCS=0&flashsms=0&number=${mobilenumber}&text=${sms}&route=31`,
  'headers': {
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
});
          
      appmdl.uploadotp(data.mobile_number, loginotp, function (err, results) {
        if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results });
      });
    }
  });
}


exports.checkotpctrl = function (req, res) {
   var data = req.body;
   appmdl.checkotpmdl(data, function (err, results) {
     if (results.length==0) {
       res.send({ 'status': 402 });
       return;
     }else{
         res.send({ 'status': 200});
     }
   });
 }

exports.createfrgetpasswordctrl = function (req, res) {
   var data = req.body;
   appmdl.createfrgetpasswordmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }

exports.updatedetailsctrl = function (req, res) {
   var data = req.body;
   appmdl.updatedetailsmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }


exports.geteditdtailsctrl = function (req, res) {
   var data = req.body;
   appmdl.geteditdtailsmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
 
 
exports.editpastorctrl = function (req, res) {
   var data = req.body;
   appmdl.editpastormdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }

 
exports.editchurchctrl = function (req, res) {
   var data = req.body;
   appmdl.editchurchmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
 exports.editministryctrl = function (req, res) {
   var data = req.body;
   appmdl.editministrymdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
  exports.editbeliverctrl = function (req, res) {
   var data = req.body;
   appmdl.editbelivermdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
  exports.editstudentctrl = function (req, res) {
   var data = req.body;
   appmdl.editstudentmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
exports.searchingmarriagesctrl = function (req, res) {
   var data = req.body;
   appmdl.searchingmarriagesmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
 
 exports.getjobctrl = function (req, res) {
   var data = req.body;
   appmdl.getjobmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
 
  exports.searchjobswisectrl = function (req, res) {
   var data = req.body;
   appmdl.searchjobswisemdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
 
 exports.getattctrl = function (req, res) {
   var data = req.body;
   appmdl.getattmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
 
 
 
 exports.addvideosubmitctrl = function (req, res) {
  var data = req.body;
  appmdl.addvideossubmitMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
 
exports.getvideoCatenamedataCtrl = function (req, res) {
  appmdl.getvideoCatenamedataMdl(function (err, results) {
    if (err) {

      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });

}

exports.addvideoCatenamedataCtrl = function (req, res) {
  var data = req.body;
  var reviewImgArr = data.reviewImg;
  //image start
  var img_links = [];
  reviewImgArr.forEach(element => {
    var image_url = reviewImgArr[0].reviewimg;
    var array = image_url.split(',');
    var base64Data = array[1];
    var datetimestamp = Date.now();
    var random_number = Math.floor(100000 + Math.random() * 900000);
    var unicnumber = random_number + '' + datetimestamp;
    var filetype = reviewImgArr[0].filetype;
    fs.writeFile("../public_html/websiteimages/" + unicnumber + '.' + filetype, base64Data, 'base64', function (err) {
    });
    imageupload = "https://jbac.in/websiteimages/" + unicnumber + '.' + filetype;
    img_links.push(imageupload)
  });
  //image End
  appmdl.addvideoCatenamedataMdl(data, img_links, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.getvideodata11ctrl = function (req, res) {

  appmdl.getvideodata11Mdl(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.editindependentorgainsationctrl = function (req, res) {
   var data = req.body;
   appmdl.editindependentorgainsationmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
 exports.editpastororgainsationctrl = function (req, res) {
   var data = req.body;
   appmdl.editpastororgainsationmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
 
 exports.searchorganizationctrl = function (req, res) {
  var data = req.body;
  appmdl.searchorganizationmdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.searchinorganizationsctrl = function (req, res) {
   var data = req.body;
   appmdl.searchinorganizationsmdl(data, function (err, results) {
    if (err) {
          res.send({ "status": 500, "msg": err });
          return;
        }
        res.send({ 'status': 200 ,'data': results});
   });
 }
 exports.getorganizationsctrl = function (req, res) {
  var data = req.body;
  appmdl.getorganizationsMdl(data, function (err, results) {
    if (err) {
      res.send(500, "Server Error");
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.getpastorsfiltersctrl = function (req, res) {
  var data = req.body;
  appmdl.getpastorsfiltersMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.getchurchesdatafiltersctrl = function (req, res) {
  var data = req.body;
  appmdl.getchurchesdatafiltersMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.viewupdatesctrl = function (req, res) {
  var data = req.body;
  appmdl.viewupdatesMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
exports.pastorviewupdatesctrl = function (req, res) {
  var data = req.body;
  appmdl.pastorviewupdatesMdl(data, function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.postinfo = function (req, res) {
  var data = req.body;
    appmdl.checknumberrmdl(data, function (err, results) {
    if (results.length) {
      res.send({ 'status': 606});
    }else{
      appmdl.postinfo(data, function (err, results) {
        if (err) {
          res.send({ 'status': 500, 'data': results });
          return;
        }
        res.send({ 'status': 200, 'data': results });
      });  
    }
  });
}

exports.updatecount = function (req, res) {
  appmdl.updatecount(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}


exports.getcount = function (req, res) {
  appmdl.getcount(function (err, results) {
    if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}

exports.checknumberpassword = function (req, res) {
  appmdl.checknumberpassword(req.body, function (err, results) {
     if (results.length) {
      res.send({ 'status': 200});
    }else{
         res.send({ 'status': 404 });
    }
  });
}

exports.upadtedpassword = function (req, res) {
  appmdl.upadtedpassword(req.body, function (err, results) {
     if (err) {
      res.send({ 'status': 500, 'data': results });
      return;
    }
    res.send({ 'status': 200, 'data': results });
  });
}
