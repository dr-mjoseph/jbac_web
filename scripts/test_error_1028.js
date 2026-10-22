try {
    eval("var obj = { a: 1,\\n b: 2 };");
} catch(e) {
    WScript.Echo("Test error: " + e.description + " (Number: " + (e.number & 0xFFFF) + ")");
}
