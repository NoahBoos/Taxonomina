const fs = require('fs');

try {
    fs.copyFileSync("./src/views/pages/index/index.html", "./dist/views/pages/index/index.html");
} catch (error) {
    console.log(error);
}