//----------| SETTINGS |-------------

//Build preferences

const buildPreferences = {
    createDevelopment: true, //Creates a development version
    createMinified: true,    //Creates a minified version
    removeComments: false    //Removes comments from development build, not recommended
};

//Building order

const buildOrder = [
    'core.js',

    'main.js',
    'settings.js',
    'finding.js',
    'events.js',
    'drawing.js',
    'tools.js',
    
    'objects/showable.js',
    'objects/collidable.js',
    '~objects',
    '~objects/colliders',
    
    'ui/element.js',
    '~ui'
];

//--------| PROCESS ARGS |----------

//Read specified arguments if
//they are available, otherwise
//deter to the current value

const readArguments = true;

if (readArguments) {
    let keys = Object.keys(buildPreferences),
        step = 2;
    
    if (process.argv.length > step)
        keys.forEach((key) => {
            if (process.argv[step] != undefined)
                buildPreferences[key] = (process.argv[step] == 'true');

            step++;
        });
}

//----------| BUILDING |------------

//Dependencies

const fs = require('fs'),
      https = require('https'),
      querystring = require('querystring');

//Build all modules following the build order

let built = {};

//Setup building functionality

const buildFramework = async () => {
    built = {};

    log('Started building the framework');

    //Build main class

    let build = '/* Created by Arthur Baars 2019 */\n\n' +
                'class Lynx2D {\n' +
                    'constructor() {\n\n';

    for (let m = 0; m < buildOrder.length; m++) {
        //Single module

        if (buildOrder[m].indexOf('~') === -1) 
            build += await buildModule('modules/' + buildOrder[m], false);
        
        //Directory (indicated with ~)

        else {
            //Format dir location

            let actual = buildOrder[m].substr(1, buildOrder[m].length-1),
                dir = 'modules/' + actual + (actual.length > 0 ? '/' : '');
 
            //Output

            if (actual !== '')
                log('Building ' + actual.toUpperCase());

            //Add comment

            if (actual > 0) {
                actual = actual[0].toUpperCase() + actual.substr(1, actual.length-1);
                build += '/* ' + actual + ' */';
            }

            //Grab all files

            let files = await fs.readdirSync(dir);

            //Build files

            for (let f = 0; f < files.length; f++) 
                if (files[f].indexOf('.js') !== -1)
                    build += await buildModule(dir + files[f], actual.length > 0);
        }
    }

    build +=    '};\n' + 
            '};';

    //Add initialization

    build += '\n\n/* Create Lynx2D instance */\n\nconst lx = new Lynx2D();';

    //Check if folder exists

    if (!fs.existsSync('build'))
        fs.mkdirSync('build');

    //Log

    log('Build completed, exporting to build folder');

    //Export builds

    if (buildPreferences.createDevelopment) {
        log('Exporting development build');
        
        fs.writeFile('build/lynx2d.js', build, (err) => {
            if (err) {
                error('Could not export development build - ' + err);
                return;
            }

            success('Exported development build!');

            //Create minified build if necessary

            if (buildPreferences.createMinified)
                minify(build);
        });
    }
    else if (buildPreferences.createMinified)
        minify(build);
};

const buildModule = async (src, isObject) => {
    if (built[src])
        return '';

    try {
        //Get start date

        let startTime = new Date().getTime();
        
        //Read JS module

        let js = await fs.readFileSync(src, 'utf-8');

        //Trim comments if prefered

        if (buildPreferences.removeComments) 
            js = trimComments(js);

        //Add to built

        built[src] = true;
        
        //Create module comment
        
        let name = src.substr(src.lastIndexOf('/')+1, src.lastIndexOf('.')-src.lastIndexOf('/')-1);
        name = name[0].toUpperCase() + name.substr(1, name.length-1);
        
        let comment = '/* ' + name + (isObject ? ' Object */' : ' */');
        
        //Output
        
        success('Built "' + name + '" (' + (new Date().getTime()-startTime) + ' ms)');

        //Return JS module

        return comment + '\n\n' + js + '\n\n';
    } catch (err) {
        //Output

        error('Could not build "' + name + '" - ' + err);

        //Return empty

        return '';
    }
};

//Setup comment trimming functionality

const trimComments = (input) => {
    let lines = input.split('\n');

    let start = -1;

    for (let l = 0; l < lines.length; l++) {
        if (lines[l].indexOf('/**') !== -1)
            start = l;
        else if 
            (lines[l].indexOf('*/') !== -1 &&
            start !== -1) {
            for (let s = start; s < l+2; s++)
                lines.splice(start, 1);

            start = -1;
        }
    }

    return lines.join('\n');
};

//Minify function

const minify = (build) => {
    log('Minifying build (requires internet!)');

    //Create query from build

    const query = querystring.stringify({
        input : build
    });

    //Send a HTTP request to javascript-minifier

    let body = '', chunks = 0;
    const req = https.request(
        {
            method   : 'POST',
            hostname : 'javascript-minifier.com',
            path     : '/raw',
        },
        function(resp) {
            //If the status code differs from 200, print error

            if (resp.statusCode !== 200) {
                error('Could not create minified version, status code ' + resp.statusCode);

                return;
            }
    
            //Response data chunk event listener

            resp.on('data', function(chunk) {
                chunks++;

                log('Recieved minified chunk ' + chunks);

                body += chunk;
            });

            //Response end event listener

            resp.on('end', function() {
                log('Exporting minified build');

                fs.writeFile('build/lynx2d-min.js', body, (err) => {
                    if (err) {
                        error('Could not export minified build - ' + err);
                        return;
                    }
            
                    success('Exported minified build!');
                });
            });
        }
    );

    //Error event listener

    req.on('error', function(err) {
        error('Could not create minified version - ' + err);
    });

    //Set headers

    req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setHeader('Content-length', query.length);

    //Send build query

    req.end(query, 'utf8');
};

//Logging functions

const log = (message) => {
    console.log(timeformat() + message);
};

const success = (message) => {
    console.log("\x1b[32m%s\x1b[0m", timeformat() + message);
};

const error = (message) => {
    console.log("\x1b[31m%s\x1b[0m", timeformat() + message);
};

const timeformat = () => {
    return '[' + new Date().toTimeString().substr(0, 8) + '] ';
}

//Attempt to build framework

buildFramework();