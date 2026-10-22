var fso = new ActiveXObject("Scripting.FileSystemObject");
var chunks = ["23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js"];
var loc = "C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\";

for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    var path = loc + chunk;
    try {
        var file = fso.OpenTextFile(path, 1, false, -1); // UTF-16 or -2 (default)
        // Read file
        // Or using ADODB.Stream for UTF-8
        var stream = new ActiveXObject("ADODB.Stream");
        stream.Type = 2; // adTypeText
        stream.Charset = "utf-8";
        stream.Open();
        stream.LoadFromFile(path);
        var content = stream.ReadText();
        stream.Close();

        // Check syntax by parsing with eval or Function
        var testCode = "(function() { var webpackJsonp = function(){}; " + content + " \n})();";
        eval(testCode);
        WScript.Echo("[PASS] " + chunk);
    } catch (e) {
        WScript.Echo("[FAIL] " + chunk + ": " + e.name + " - " + e.message + " (Line: " + (e.line || "unknown") + ")");
    }
}
