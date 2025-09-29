const fs = require('fs');

try {
    fs.copyFileSync("./src/index/index.html", "./dist/index/index.html");
} catch (error) {
    console.log(error);
}