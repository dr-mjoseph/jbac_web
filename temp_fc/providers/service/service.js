var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
var testApi = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';
var ServiceProvider = /** @class */ (function () {
    // testApi = 'http://localhost:2303/dashboardapi/'
    function ServiceProvider(http) {
        this.http = http;
        this.testApi = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';
        console.log('Hello ServiceProvider Provider');
    }
    // <-------------------------------------------------------Meeting start----------------------------------------------->
    ServiceProvider.prototype.getdenomation = function () {
        return this.http.post(testApi + 'denomations', []);
    };
    ServiceProvider.prototype.getbeliversdata = function () {
        return this.http.post(this.testApi + 'getbeliversdata', []);
    };
    ServiceProvider.prototype.searchingdemonationdata = function (data) {
        return this.http.post(this.testApi + 'searchingdemonation', data);
    };
    ServiceProvider.prototype.getdistrict = function () {
        return this.http.post(this.testApi + 'getdistricts', []);
    };
    ServiceProvider.prototype.getconsistencys = function (districtId) {
        var payload = districtId ? { district_id: districtId } : {};
        return this.http.post(this.testApi + 'getconsistencys', payload);
    };
    ServiceProvider.prototype.getmandals = function (constId) {
        var payload = constId ? { const_id: constId } : {};
        return this.http.post(this.testApi + 'getmandals', payload);
    };
    ServiceProvider.prototype.gepanchayatis = function (mandalId) {
        var payload = mandalId ? { mandal_id: mandalId } : {};
        return this.http.post(this.testApi + 'gepanchayati', payload);
    };
    ServiceProvider.prototype.searchingdata = function (data) {
        return this.http.post(this.testApi + 'searchingdata', data);
    };
    ServiceProvider.prototype.getevents = function () {
        return this.http.post(this.testApi + 'getupdateevents', []);
    };
    ServiceProvider.prototype.getpastorsfilters = function (data) {
        return this.http.post(this.testApi + 'getpastorsfilters', data);
    };
    ServiceProvider.prototype.getwing = function () {
        return this.http.post(this.testApi + 'getwing', []);
    };
    ServiceProvider.prototype.getchurch = function () {
        return this.http.post(this.testApi + 'getchurch', []);
    };
    ServiceProvider.prototype.getbelivers = function () {
        return this.http.post(this.testApi + 'getbelivers', []);
    };
    ServiceProvider.prototype.getservices = function () {
        return this.http.post(this.testApi + 'getservices', []);
    };
    ServiceProvider.prototype.institutes = function () {
        return this.http.post(this.testApi + 'getinstitutes', []);
    };
    ServiceProvider.prototype.postbeliver = function (data) {
        return this.http.post(this.testApi + 'postbeliversignup', data);
    };
    ServiceProvider.prototype.poststudentsignup = function (data) {
        return this.http.post(this.testApi + 'studentsignup', data);
    };
    ServiceProvider.prototype.postministrysignup = function (data) {
        return this.http.post(this.testApi + 'postministrysignup', data);
    };
    ServiceProvider.prototype.postchurchregister = function (data) {
        return this.http.post(this.testApi + 'postchurchregister', data);
    };
    ServiceProvider.prototype.postpastor = function (data) {
        return this.http.post(this.testApi + 'postpastor', data);
    };
    ServiceProvider.prototype.postindepedentorganisation = function (data) {
        return this.http.post(this.testApi + 'postindepedentorganisation', data);
    };
    ServiceProvider.prototype.postpastorassociationss = function (data) {
        return this.http.post(this.testApi + 'postpastorassociations', data);
    };
    ServiceProvider.prototype.getimages = function () {
        return this.http.post(this.testApi + 'getwebsitegallery', []);
    };
    ServiceProvider.prototype.postupdatenews = function (data) {
        return this.http.post(this.testApi + 'postnews', data);
    };
    ServiceProvider.prototype.Searchinstitute = function (data) {
        return this.http.post(this.testApi + 'Searchinstitute', data);
    };
    ServiceProvider.prototype.searchmarriages = function (data) {
        return this.http.post(this.testApi + 'Searchmarriages', data);
    };
    ServiceProvider.prototype.searchingmarriages = function (data) {
        return this.http.post(this.testApi + 'searchingmarriages', data);
    };
    ServiceProvider.prototype.getjobs = function (data) {
        return this.http.post(this.testApi + 'searchjob', data);
    };
    ServiceProvider.prototype.getjob = function () {
        return this.http.post(this.testApi + 'getjob', []);
    };
    ServiceProvider.prototype.searchjobswise = function (data) {
        return this.http.post(this.testApi + 'searchjobswise', data);
    };
    ServiceProvider.prototype.posthelping = function (data) {
        return this.http.post(this.testApi + 'posthelping', data);
    };
    ServiceProvider.prototype.searchingbusiness = function (data) {
        return this.http.post(this.testApi + 'searchingbusiness', data);
    };
    ServiceProvider.prototype.getbusiness = function () {
        return this.http.post(this.testApi + 'getbusiness', []);
    };
    ServiceProvider.prototype.postattacks = function (data) {
        return this.http.post(this.testApi + 'postattacks', data);
    };
    ServiceProvider.prototype.postsmeetings = function (data) {
        return this.http.post(this.testApi + 'postmeetings', data);
    };
    ServiceProvider.prototype.searchorganization = function (data) {
        return this.http.post(this.testApi + 'searchorganization', data);
    };
    ServiceProvider.prototype.searchinorganizations = function (data) {
        return this.http.post(this.testApi + 'searchinorganizations', data);
    };
    ServiceProvider.prototype.getorganizations = function () {
        return this.http.post(this.testApi + 'getorganizations', []);
    };
    ServiceProvider.prototype.postchurchmeetings = function (data) {
        return this.http.post(this.testApi + 'postchuechmeetings', data);
    };
    ServiceProvider.prototype.postinsututies = function (data) {
        return this.http.post(this.testApi + 'postinsututies', data);
    };
    ServiceProvider.prototype.postbusiness = function (data) {
        return this.http.post(this.testApi + 'postbusiness', data);
    };
    ServiceProvider.prototype.postingmarriages = function (data) {
        return this.http.post(this.testApi + 'postingmarriages', data);
    };
    ServiceProvider.prototype.postjobs = function (data) {
        return this.http.post(this.testApi + 'postjobs', data);
    };
    ServiceProvider.prototype.postadds = function (data) {
        return this.http.post(this.testApi + 'postadds', data);
    };
    ServiceProvider.prototype.passwordlogin = function (data) {
        return this.http.post(this.testApi + 'passwordwebsitelogin', data);
    };
    ServiceProvider.prototype.getpastorassci = function () {
        return this.http.post(this.testApi + 'getpastorassociation', []);
    };
    ServiceProvider.prototype.getuserprofilereport = function (data) {
        return this.http.post(this.testApi + 'getuserprofilereport', data);
    };
    ServiceProvider.prototype.geteditdtails = function (data) {
        return this.http.post(this.testApi + 'geteditdtails', data);
    };
    ServiceProvider.prototype.editbeliver = function (data) {
        return this.http.post(this.testApi + 'editbeliver', data);
    };
    ServiceProvider.prototype.editstudent = function (data) {
        return this.http.post(this.testApi + 'editstudent', data);
    };
    ServiceProvider.prototype.editministry = function (data) {
        return this.http.post(this.testApi + 'editministry', data);
    };
    ServiceProvider.prototype.editindependentorgainsation = function (data) {
        return this.http.post(this.testApi + 'editindependentorgainsation', data);
    };
    ServiceProvider.prototype.editpastororgainsation = function (data) {
        return this.http.post(this.testApi + 'editpastororgainsation', data);
    };
    ServiceProvider.prototype.editpastorsassociations = function (data) {
        return this.http.post(this.testApi + 'editpastororgainsation', data);
    };
    ServiceProvider.prototype.editchurch = function (data) {
        return this.http.post(this.testApi + 'editchurch', data);
    };
    ServiceProvider.prototype.editpastor = function (data) {
        return this.http.post(this.testApi + 'editpastor', data);
    };
    ServiceProvider.prototype.getcatewebsitegallery = function () {
        return this.http.get(this.testApi + 'getcatewebsitegallery');
    };
    ServiceProvider.prototype.getvideourl = function () {
        return this.http.get(this.testApi + 'getvideourl');
    };
    ServiceProvider.prototype.getUserMainData = function (data) {
        return this.http.post(this.testApi + 'getUserMainData', data);
    };
    ServiceProvider.prototype.getLeaderswebsiteD = function (data) {
        return this.http.post(this.testApi + 'getLeaderswebsiteData', data);
    };
    ServiceProvider.prototype.getLeaderswebsitewing = function (data) {
        return this.http.post(this.testApi + 'getLeaderswebsitewing', data);
    };
    ServiceProvider.prototype.deleteleaders = function (data) {
        return this.http.post(this.testApi + 'deleteboardmember', data);
    };
    ServiceProvider.prototype.updateconsistency = function (data) {
        return this.http.post(this.testApi + "updateconsis", data);
    };
    ServiceProvider.prototype.postinfo = function (data) {
        return this.http.post(this.testApi + "postinfo", data);
    };
    ServiceProvider.prototype.getupdatenews = function () {
        return this.http.get(this.testApi + "updatenewsdataa");
    };
    ServiceProvider.prototype.getchurchesdatafilters = function (data) {
        return this.http.post(this.testApi + "getchurchesdatafilters", data);
    };
    ServiceProvider.prototype.getchurches = function () {
        return this.http.post(this.testApi + "getchurches", []);
    };
    ServiceProvider.prototype.searchingchurchdata = function (data) {
        return this.http.post(this.testApi + 'searchingchurchdata', data);
    };
    ServiceProvider.prototype.getadds = function () {
        return this.http.post(this.testApi + 'searchingchurchdata', []);
    };
    ServiceProvider.prototype.updatecount = function () {
        return this.http.post(this.testApi + 'updatecount', []);
    };
    ServiceProvider.prototype.getcount = function () {
        return this.http.post(this.testApi + 'getcount', []);
    };
    // <-------------------------------------------------------Meeting End----------------------------------------------->
    ServiceProvider.prototype.checknumberpassword = function (data) {
        return this.http.post(this.testApi + 'checknumberpassword', data);
    };
    ServiceProvider.prototype.upadtedpassword = function (data) {
        return this.http.post(this.testApi + 'upadtedpassword', data);
    };
    // <--------------------- Family Counselling Endpoints --------------------->
    ServiceProvider.prototype.getcouncellingdoctors = function () {
        return this.http.post(this.testApi + 'getcouncellingdoctors', {});
    };
    ServiceProvider.prototype.savecouncellingdoctor = function (data) {
        return this.http.post(this.testApi + 'savecouncellingdoctor', data);
    };
    ServiceProvider.prototype.deletecouncellingdoctor = function (data) {
        return this.http.post(this.testApi + 'deletecouncellingdoctor', data);
    };
    ServiceProvider.prototype.getcouncellingappointments = function (data) {
        return this.http.post(this.testApi + 'getcouncellingappointments', data);
    };
    ServiceProvider.prototype.bookcouncellingappointment = function (data) {
        return this.http.post(this.testApi + 'bookcouncellingappointment', data);
    };
    ServiceProvider.prototype.updateappointmentstatus = function (data) {
        return this.http.post(this.testApi + 'updateappointmentstatus', data);
    };
    ServiceProvider.prototype.registercouncellingdoctor = function (data) {
        return this.http.post(this.testApi + 'registerdoctor', data);
    };
    var _a;
    ServiceProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [typeof (_a = typeof HttpClient !== "undefined" && HttpClient) === "function" ? _a : Object])
    ], ServiceProvider);
    return ServiceProvider;
}());
export { ServiceProvider };
