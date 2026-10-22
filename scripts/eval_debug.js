var stream = new ActiveXObject("ADODB.Stream");
stream.Type = 2; // adTypeText
stream.Charset = "utf-8";
stream.Open();
stream.LoadFromFile("C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\18.js");
var content = stream.ReadText();
stream.Close();

// Let's find syntax error by splitting into statements or blocks
// Replace the webpackJsonp call with eval
var prefix = "var webpackJsonp = function(a, b) { for(var k in b) { (b[k])({}, {}, function(){}); } };\n";

try {
    eval(prefix + content);
    WScript.Echo("Full eval PASSED!");
} catch (e) {
    WScript.Echo("Eval error: " + e.description + " (Number: " + (e.number & 0xFFFF) + ")");
}
