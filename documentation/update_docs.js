const fs = require('fs');


// ------ IMPORTANT ------

//Kind of hardcoded but it works!
//Make sure to change this when adding classes.

let amountOfClasses = 11;

// -------- END -----------


//Filter index.html

console.log('Started updating docs, please wait..');

fs.readFile('output/index.html', 'utf-8', (err, data) => {
    if (err)
        throw err;

    let lines = data.split('\n');

    //Set title

    lines[4] = '  <title>Lynx2D - Documentation</title>';

    console.log('Set title!');

    //Line filtering

    let classes = 0;

    for (let l = 0; l < lines.length; l++) {
        //Syntax filtering (classes)

        let syntaxId = lines[l].indexOf(">new ");

        if (syntaxId !== -1) {
            let start = lines[l].substr(0, lines[l].indexOf('>')),
                end = lines[l].substr(syntaxId+5, lines[l].length-syntaxId-5);

            lines[l] = start + '>new lx.' + end;

            continue;
        }

        if (lines[l].indexOf("<h3 class='fl m0'") !== -1)
            classes++;

        //Ignore method filtering before all
        //classes have been filtered.
        //This is kind of a hardcoded thing but it works!

        if (classes <= amountOfClasses)
            continue;

        //Syntax filtering (methods)

        syntaxId = lines[l].indexOf("<div class='pre p1 fill-light mt0'>");

        if (syntaxId !== -1) {
            let start = lines[l].substr(0, lines[l].indexOf('>')),
                end = lines[l].substr(syntaxId+35, lines[l].length-syntaxId-35);

            lines[l] = start + '>lx.' + end;
        }
    }

    console.log('Filtered all lines!');

    //Replace style.css

    fs.copyFileSync('style.css', 'output/assets/style.css');

    console.log('Replaced stylesheet!');

    console.log('Done updating docs, exporting...');

    fs.writeFileSync('output/index.html', lines.join('\n'));
});