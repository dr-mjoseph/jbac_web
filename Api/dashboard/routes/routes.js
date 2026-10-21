var express = require('express');
router = express.Router();
// var jwt = require('jsonwebtoken');
var sampleRoutes = require('../controllers/mainCtrl');
process.env.SECRET_KEY = "thisismysecretkey";
//single start
//User Adding
router.post('/getdashotp', sampleRoutes.getdashotpCtrl);

router.post('/getUserData', sampleRoutes.getUserDataCtrl);

router.get('/deleteUsers/:ind', sampleRoutes.deleteUsersCtrl);

router.post('/addUsers', sampleRoutes.addUsersCtrl);

router.get('/globalGet/:tablename', sampleRoutes.globalGeCtrl);

//permissions
router.get('/getUserPermissions', sampleRoutes.getUserPermissionsCtrl);

router.get('/getModules/:id', sampleRoutes.getModulesCtrl);

router.post('/submitpermissions', sampleRoutes.submitpermissionsCtrl);

router.post('/deletePermissions', sampleRoutes.deletePermissionsCtrl);

// user permission start
router.get('/getmodulelistdetails/:usr_id', sampleRoutes.getmodulelistdetailsCtrl);

router.get('/userpermissiongetdata', sampleRoutes.userpermissiondatactrl);

router.get('/getemployeelistdata', sampleRoutes.getemployeelistdataCtrl);

router.post('/postusermenulist', sampleRoutes.postusermenulistCtrl);

// user permission end
//Analysis


router.get('/getusersanalysisData', sampleRoutes.getusersanalysisCtrl);

router.get('/toatlcntsordersData', sampleRoutes.toatlcntsordersCtrl);

router.get('/toatlcntstudentsordersData', sampleRoutes.toatlcntstudentsordersDataCtrl);

router.get('/toatlcntbelieversData', sampleRoutes.toatlcntbelieversDataCtrl);

router.get('/totalcountsData', sampleRoutes.totalcountsCtrl);

router.get('/topfiveItemsData', sampleRoutes.topfiveItemsCtrl);

router.get('/totalpastordistcnt', sampleRoutes.totalpastordistcntCtrl);

router.get('/toatlchurchcntsorders', sampleRoutes.toatlchurchcntsordersCtrl);

router.get('/toatlcntsindchurch', sampleRoutes.toatlcntsindchurchCtrl);

router.get('/toatlreggchurchcounts', sampleRoutes.toatlreggchurchcountsCtrl);

router.get('/ministry_cnts', sampleRoutes.ministry_cntsCtrl);

router.get('/attackas_cnts', sampleRoutes.attackas_cntsCtrl);

router.get('/jobs_cnts', sampleRoutes.jobs_cntsCtrl);

router.get('/marriages_cuntss', sampleRoutes.marriages_cuntssCtrl);

router.get('/attacks_cunts', sampleRoutes.attacks_cuntsCtrl);

router.get('/institutes_cunts', sampleRoutes.institutes_cuntsCtrl);

router.get('/totalpastorconcstcnt', sampleRoutes.totalpastorconcstcntCtrl);

router.get('/mndlpastorldrs', sampleRoutes.mndlpastorldrsCtrl);

router.get('/pnchytpastorldrs', sampleRoutes.pnchytpastorldrsCtrl);

router.get('/districtwiseblvrs', sampleRoutes.districtwiseblvrsCtrl);

router.get('/constwiseblvrs', sampleRoutes.constwiseblvrsCtrl);

router.get('/mndlwiseblvrs', sampleRoutes.mndlwiseblvrsCtrl);

router.get('/vlgwiseblvrsss', sampleRoutes.vlgwiseblvrsssCtrl);

router.get('/distwisestdntss', sampleRoutes.distwisestdntssCtrl);

router.get('/cnctcwisestndts', sampleRoutes.cnctcwisestndtsCtrl);

router.get('/mndlwisestndlrds', sampleRoutes.mndlwisestndlrdsCtrl);

router.get('/vlgwisestntss', sampleRoutes.vlgwisestntssCtrl);


// mis reports start
router.get('/getExpandData', sampleRoutes.getExpandDataCtrl);

router.post('/addExpand', sampleRoutes.addExpandCtrl);

router.get('/getAccount', sampleRoutes.getAccountCtrl);

router.get('/datewiseExpand/:ind', sampleRoutes.datewiseExpandCtrl);

router.get('/getEnquiry', sampleRoutes.getEnquiryCtrl);

router.post('/addEnquiry', sampleRoutes.addEnquiryCtrl);

router.get('/deleteEnquiry/:id', sampleRoutes.deleteEnquiryCtrl);
// mis reports edn

/////////////////////////////////jesus raju///////////////////////////////////////////////

router.post('/getaboutwebsite', sampleRoutes.getaboutwebsitectrl); /////get about CALL

router.post('/postwebsitesignup', sampleRoutes.submiteventCtrl); ////eventform

router.post('/passwordwebsitelogin', sampleRoutes.passwordwebsiteloginctrl); ////login form checking

router.post('/getupdateevents', sampleRoutes.getupdatesctrl); ////update events

router.post('/denomations', sampleRoutes.denomationctrl);   //////denomation get  call
router.post('/leaderlevels', sampleRoutes.leaderlevelctrl);   //////leaderlevel get  call
router.post('/educationalq', sampleRoutes.educationctrl);   //////education get  call
// router.post('/pattern', sampleRoutes.patternctrl);   ////// Pattern get call

router.post('/getdistricts', sampleRoutes.getdistrictsctrl); ////distrct names

router.post('/getmandals', sampleRoutes.getmandalsctrl); ////Mandals names

router.post('/gepanchayati', sampleRoutes.gepanchayatictrl); ////Panchayati names

router.post('/getbelivers', sampleRoutes.getbeliversctrl);

router.post('/getservices', sampleRoutes.getservicesctrl); ////Panchayati names

router.post('/addNew', sampleRoutes.addNewCtrl); ///add new service 

router.post('/getconsistencys', sampleRoutes.getconsistencysctrl); ////distrct names

router.post('/getchurch', sampleRoutes.getchurchctrl); /////getchurch

router.post('/getpastor', sampleRoutes.getpastorctrl); /////getpastor

router.post('/postmeetings', sampleRoutes.postmeetingsCtrl); //meetings upload form

router.post('/postchuechmeetings', sampleRoutes.postchurchmeetingsCtrl); // Church Timings form

router.post('/postinsututies', sampleRoutes.postinsututiesCtrl); //Insututies form

router.post('/postcolleges', sampleRoutes.postcollegesCtrl); //colleges

router.post('/postjobs', sampleRoutes.postjobsCtrl); // Jobs form

router.post('/getwing', sampleRoutes.getwingCtrl); // Jobs form

router.post('/postattacks', sampleRoutes.postattackCtrl);

router.post('/postingmarriages', sampleRoutes.postingmarriagesCtrl);

router.post('/postadds', sampleRoutes.postaddsCtrl); // posts form

router.post('/getbeliversdata', sampleRoutes.gebeliverctrl); /////getbeliver

/////////////////////////////////////////////////////////////////////login ///////////////////////////////////////

router.post('/postbeliversignup', sampleRoutes.postbeliversignupCtrl); // beliver sign up 

router.post('/studentsignup', sampleRoutes.studentsignupCtrl); // student sign up 

router.post('/postministrysignup', sampleRoutes.postministrysignupCtrl); ////ministry sign up 
router.post('/postregform', sampleRoutes.postregformCtrl); // registration form
router.post('/postwishform', sampleRoutes.postwishformCtrl); // wish form
router.post('/postpastor', sampleRoutes.postpastorctrl);  // pastor Sign up

router.post('/postchurchregister', sampleRoutes.postchurchregisterctrl); // church signup

router.post('/postpastorassociations', sampleRoutes.postpastorassociationsctrl); // postpastorassociations signup

router.post('/postindepedentorganisation', sampleRoutes.postindepedentorganisationctrl);

// router.post('/postindepedentchurch', sampleRoutes.postindepedentchurchctrl);

router.post('/getpersonal', sampleRoutes.getpersonalctrl);

router.post('/getyouth', sampleRoutes.getyouthmeetingctrl); /////get youth CALL

router.post('/getrevival', sampleRoutes.getrevivalctrl); ///get revival CALL

router.post('/getwomen', sampleRoutes.getwomenctrl); ///get women CALL

router.post('/getpastormeeting', sampleRoutes.getpastormeetingctrl); ///get pastor CALL

router.post('/getchildern', sampleRoutes.getchildernctrl); ///get childerns CALL

router.post('/getmusical', sampleRoutes.getmusicalctrl); ///get musicals CALL

router.post('/searchingdata', sampleRoutes.searchingdataCtrl); ////searching

router.post('/getchurches', sampleRoutes.getchurchesctrl); ////churches data

router.post('/searchingchurchdata', sampleRoutes.searchingchurchdataCtrl); ////searchingchurchdata

router.post('/getwebsitegallery', sampleRoutes.getwebsitegalleryctrl);

router.post('/searchingmarriages', sampleRoutes.searchingmarriagesctrl);

///prasad start ////

//home banners//
router.post('/posthomebanners', sampleRoutes.posthomebannersctrl);

router.get('/gethomebanners', sampleRoutes.gethomebannersCtrl);

router.get('/deletehomepagedata/:id', sampleRoutes.deletehomepagedatactrl);

router.post('/updateposthomebanners', sampleRoutes.updatepposthomebannersSubmitctrl);

router.post('/edithomebannerimage', sampleRoutes.edithomebannerimageCtrl);

//gallery//

router.post('/addCatenamedata', sampleRoutes.addCatenamedataCtrl);

router.get('/getCatenamedata', sampleRoutes.getCatenamedataCtrl);

router.post('/addgallerysubmit', sampleRoutes.addgallerysubmitctrl);

router.get('/getgalleryimagesdata',sampleRoutes.getgallerydata11ctrl);

router.post('/updategalleryInfodata', sampleRoutes.updategalleryInfodatactrl);

router.get('/deletegallerydata/:id',sampleRoutes.deletegallerydatactrl);

router.get('/deletecatenamedata/:id',sampleRoutes.deletecatenamedatactrl);

router.post('/addabout', sampleRoutes.aboutpostCtrl);

router.get('/getabout', sampleRoutes.getaboutCtrl);

router.get('/deleteabout/:id', sampleRoutes.deleteaboutctrl);

router.post('/updateaboutdata', sampleRoutes.updateaboutdatactrl);

router.post('/editimageabout', sampleRoutes.editimageaboutctrl);

//events//

router.post('/eventspostingdata', sampleRoutes.eventspostingdatactrl);

router.get('/geteventpostingdata', sampleRoutes.geteventpostingdataCtrl);

router.post('/updateeventspostingdata', sampleRoutes.updateeventspostingdatactrl);

router.get('/deleteeventsupdatedata/:id', sampleRoutes.deleteeventsupdatedatactrl);

router.post('/editscheduleimage', sampleRoutes.editscheduleimageCtrl);

router.post('/deleteProductData', sampleRoutes.deleteProductDataCtrl);

//contact//
router.get('/gatcontactus', sampleRoutes.gatcontactusctrl);

router.get('/getsignupreg', sampleRoutes.getsignupregctrl);

router.get('/getpastorregis', sampleRoutes.getpastorregisctrl);

router.get('/believerreg', sampleRoutes.believerregctrl);

router.get('/studentreg', sampleRoutes.studentregctrl);

router.get('/churchreg', sampleRoutes.churchregctrl);

router.get('/independentchurch', sampleRoutes.independentchurchctrl);

router.get('/ministryregs', sampleRoutes.ministryregsctrl);

router.get('/ministryservices', sampleRoutes.ministryservicesctrl);

router.post('/remarkssubmitdata', sampleRoutes.remarkssubmitdataCtrl);

router.post('/believerremarksdata', sampleRoutes.believerremarksdataCtrl);

router.get('/getjobsdata', sampleRoutes.getjobsdatactrl);

router.get('/churchtimings', sampleRoutes.churchtimingsctrl);

router.get('/institutes', sampleRoutes.institutesctrl);

router.post('/pastorleadershipreg', sampleRoutes.pastorleadershipregctrl);

router.post('/updatevolunteersind', sampleRoutes.updatevolunteersindctrl);

router.post('/volunteerbeliever', sampleRoutes.volunteerbelieverctrl);

router.post('/searchingbelieverdata', sampleRoutes.searchingbelieverdatactrl);

router.post('/searchingstudentsdata', sampleRoutes.searchingstudentsdatactrl);

router.post('/volunteerstudent', sampleRoutes.volunteerstudentctrl);

//attacks//

router.get('/getattackersdata', sampleRoutes.getattackersdatactrl);

//marriages
router.post('/marriagespreg', sampleRoutes.marriagespregctrl);

router.get('/deleteattackers/:id', sampleRoutes.deleteattackersCtrl);

router.post('/updateattacksapprovalind', sampleRoutes.updateattacksapprovalindctrl);

router.post('/pastorwingleadershipreg', sampleRoutes.pastorwingleadershipregctrl);

router.post('/searchingbelieverchurchdata', sampleRoutes.searchingbelieverchurchdatactrl);

router.post('/searchingstudentchurchdata', sampleRoutes.searchingstudentchurchdatactrl);

router.post('/volunteerwingapproval', sampleRoutes.volunteerwingapprovalctrl);

router.post('/volunteerbelieverwingapproval', sampleRoutes.volunteerbelieverwingapprovalctrl);

router.post('/volunteerstudentwingapproval', sampleRoutes.volunteerstudentwingapprovalctrl);

router.post('/adddocument', sampleRoutes.adddocumentctrl);

router.get('/getdocument', sampleRoutes.getdocumentctrl);

router.get('/deletedocument/:id', sampleRoutes.deletedocumentCtrl);


router.post('/getpastorwingdataasMdl', sampleRoutes.getpastorwingdataasctrl);

router.post('/getbelieverwingdataasMdl', sampleRoutes.getbelieverwingdataasMdlctrl);

router.post('/getstudentwingchurchdata', sampleRoutes.getstudentwingchurchdatactrl);

router.post('/getpastorsgendata', sampleRoutes.getpastorsgendatactrl);

router.post('/getbelievergendata', sampleRoutes.getbelievergendatactrl);

router.post('/getstudentgenchurchdata', sampleRoutes.getstudentgenchurchdatactrl);

router.post('/searchgetmarriages', sampleRoutes.searchgetmarriagesctrl);

router.get('/getaddsdataapproval', sampleRoutes.getaddsdataapprovalctrl);

router.post('/addapprovalind', sampleRoutes.addsapprovaldatactrl);

router.post('/addapprovalindnews', sampleRoutes.addapprovalindnewsctrl);

router.post('/addapprovalindforhelp', sampleRoutes.addapprovalindforhelpctrl);

router.get('/deleteaddsdataa/:id', sampleRoutes.deleteaddsdataactrl);

router.get('/updatenewsdataa', sampleRoutes.updatenewsdataactrl);

router.get('/getlookingforhelpp', sampleRoutes.getlookingforhelppctrl);

router.post('/searchgetbusiness', sampleRoutes.searchgetbusinessctrl);

//prasad website 
router.get('/getadocumentsdataa', sampleRoutes.getadocumentsdataactrl);

router.post('/searchbusiness', sampleRoutes.searchbusinessctrl);

////prasad end //// 

router.post('/Searchinstitute', sampleRoutes.Searchinstitutectrl);

router.get('/getcatewebsitegallery', sampleRoutes.getcatewebsitegalleryctrl);

router.post('/Searchmarriages', sampleRoutes.Searchmarriagesctrl);

router.post('/searchjob', sampleRoutes.searchjobctrl);

router.post('/contact', sampleRoutes.contactCtrl); //contact form

router.post('/getaddsdata', sampleRoutes.getaddsdatactrl);

router.get('/getreferalcode/:usr_id', sampleRoutes.getreferalcodeCtrl);// get profile and referal data;

router.post('/getuserprofilereport', sampleRoutes.getuserprofilereportctrl);

router.post('/updateprofile', sampleRoutes.updateprofilectrl); 

router.post('/updatebeliver', sampleRoutes.updatebeliverctrl);

router.post('/getLeaderswebsiteData', sampleRoutes.getLeaderswebsiteCtrl); 

router.post('/getLeaderswebsitewing', sampleRoutes.getLeaderswebsitewing);

router.post('/getUserMainData', sampleRoutes.getUserMainCtrl); 

router.post('/gethomebanners', sampleRoutes.gethomebannersctrl);

router.post('/searchingdemonation', sampleRoutes.searchingdemonationCtrl); ////searching

router.post('/searchingbusiness', sampleRoutes.searchingbusinessCtrl);

router.post('/posthelping', sampleRoutes.posthelpingCtrl); //helps upload form

router.post('/gethelps', sampleRoutes.gethelpingctrl); /////get helps CALL

router.post('/postnews', sampleRoutes.postnewsCtrl); //postnews upload form

router.post('/getnews', sampleRoutes.getnewsctrl); /////get helps CALL

router.post('/postbusiness', sampleRoutes.postbusinessCtrl); // posts business form

router.post('/getbusiness', sampleRoutes.getbusinessctrl);

router.post('/getinstitutes', sampleRoutes.getinstitutesctrl);   //////denomation get  call

router.post('/getpastorassociation', sampleRoutes.getpastorassociationctrl); /////getpastor associations

router.post('/addurl', sampleRoutes.addurlctrl);

router.post('/postvideolink', sampleRoutes.postvideolinkdataCtrl);

router.get('/getvideourl', sampleRoutes.getvideourlctrl);

router.get('/deleteUrl/:id', sampleRoutes.deleteUrlctrl); 

router.post('/updateconsis', sampleRoutes.updateconsisctrl); //

router.post('/deleteboardmember', sampleRoutes.deleteboardmemberctrl); //delete

router.post('/checknumber', sampleRoutes.checknumberctrl);

router.post('/checkotp', sampleRoutes.checkotpctrl);

router.post('/createfrgetpassword', sampleRoutes.createfrgetpasswordctrl);

router.post('/updatedetails', sampleRoutes.updatedetailsctrl);

router.post('/geteditdtails', sampleRoutes.geteditdtailsctrl);

router.post('/editpastor', sampleRoutes.editpastorctrl);

router.post('/editindependentorgainsation', sampleRoutes.editindependentorgainsationctrl);

router.post('/editpastororgainsation', sampleRoutes.editpastororgainsationctrl);

router.post('/editchurch', sampleRoutes.editchurchctrl);

router.post('/editministry', sampleRoutes.editministryctrl);

router.post('/editbeliver', sampleRoutes.editbeliverctrl);

router.post('/editstudent', sampleRoutes.editstudentctrl);

router.post('/getjob', sampleRoutes.getjobctrl);

router.post('/searchjobswise', sampleRoutes.searchjobswisectrl);

router.post('/getatt', sampleRoutes.getattctrl);

router.post('/addvideosubmit', sampleRoutes.addvideosubmitctrl);

router.get('/getvideoCatenamedata', sampleRoutes.getvideoCatenamedataCtrl);

router.post('/addvideoCatenamedata', sampleRoutes.addvideoCatenamedataCtrl);

router.get('/getvideosdata',sampleRoutes.getvideodata11ctrl);

router.post('/searchorganization', sampleRoutes.searchorganizationctrl);

router.post('/searchinorganizations', sampleRoutes.searchinorganizationsctrl);

router.post('/getorganizations', sampleRoutes.getorganizationsctrl);

/////////rajkumar//////////////////

router.post('/getpastorsfilters', sampleRoutes.getpastorsfiltersctrl);

router.post('/getchurchesdatafilters', sampleRoutes.getchurchesdatafiltersctrl);

router.post('/viewupdates', sampleRoutes.viewupdatesctrl);

router.post('/pastorviewupdates', sampleRoutes.pastorviewupdatesctrl);

router.post('/postinfo', sampleRoutes.postinfo);

router.post('/updatecount', sampleRoutes.updatecount);

router.post('/getcount', sampleRoutes.getcount);

//-------------------------------------------------------------------------------

router.post('/checknumberpassword', sampleRoutes.checknumberpassword);

router.post('/upadtedpassword', sampleRoutes.upadtedpassword);


module.exports = router;

