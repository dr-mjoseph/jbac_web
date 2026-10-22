var stream = new ActiveXObject("ADODB.Stream");
stream.Type = 2; // adTypeText
stream.Charset = "utf-8";
stream.Open();
stream.LoadFromFile("C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\18.js");
var content = stream.ReadText();
stream.Close();

// Binary search or incremental eval to find the exact line/character of the error
var lines = content.split("\n");
WScript.Echo("Total lines: " + lines.length);

for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf("state_id") >= 0) {
        WScript.Echo("Line " + (i+1) + ": " + lines[i]);
    }
}
