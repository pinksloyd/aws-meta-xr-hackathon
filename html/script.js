async function main() {
    try {
        console.log("Loading Pyodide...");
        let pyodide = await loadPyodide();
        console.log("Pyodide loaded successfully!");

        await pyodide.loadPackage(["micropip"]);
        console.log("Packages loaded successfully!");

        // Capture print output by redirecting Python's sys.stdout
        pyodide.runPython(`
            import sys
            from js import console, document
            
            class StdoutRedirector:
                def write(self, text):
                    if text.strip():  # Ignore empty lines
                        console.log(text)
                        document.body.innerHTML += "<p>" + text + "</p>"

                def flush(self):
                    pass

            sys.stdout = StdoutRedirector()
            
            def add(a, b):
                return a + b

            def multiply(a, b):
                return a * b

            print("Add result:", add(5, 10))
            print("Multiply result:", multiply(5, 10))
        `);
    } catch (error) {
        console.error("An error occurred:", error);
        document.body.innerHTML += "<p>Error: " + error.message + "</p>";
    }
}
main();
