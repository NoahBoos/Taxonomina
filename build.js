const fs = require('fs');

try {
    // fs.copyFileSync("./src/views/pages/index/index.html", "./dist/views/pages/index/index.html");
    fs.cp("./src/views", "./dist/views", {
        recursive: true,
        filter: (src) => src.endsWith(".html") || fs.statSync(src).isDirectory(),
    }, () => {});
    fs.unlink("./dist/views/pages/index/renderer.js", (error) => {
       if (error) throw error;
    });
} catch (error) {
    console.log(error);
}
