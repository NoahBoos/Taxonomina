const fs = require('fs');

try {
    // fs.copyFileSync("./src/views/pages/index/index.html", "./dist/views/pages/index/index.html");
    fs.cp("./src/views", "./dist/views", {
        recursive: true,
        filter: (src) => src.endsWith(".html") || fs.statSync(src).isDirectory(),
    }, () => {});
} catch (error) {
    console.log(error);
}