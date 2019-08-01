const fs = require('fs');

//Build preferences

const buildPreferences = {
    removeComments: true
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
    
    '~objects',
    '~ui'
];

//Build all modules following the build order

let builded = {},
    amountOfBuilds = 0;

//Setup building functionality

const buildFramework = async () => {
    builded = {};
    amountOfBuilds++;

    console.log('Started building the framework (Attempt ' + amountOfBuilds + ').\n');

    //Build main class

    let build = 'class Lynx2D {\n' +
                    'constructor() {\n\n';

    for (let m = 0; m < buildOrder.length; m++) {
        //Single module

        if (buildOrder[m].indexOf('~') === -1) 
            build += await buildModule('modules/' + buildOrder[m], false);
        
        //Directory

        else {
            //Format dir location

            let actual = buildOrder[m].substr(1, buildOrder[m].length-1),
                dir = 'modules/' + actual + (actual.length > 0 ? '/' : '');
 
            //Output

            if (actual !== '')
            console.log('\n-- ' + actual.toUpperCase() + ' --');

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

    //Save build

    fs.writeFile('build/lynx2d.js', build, async (err) => {
        if (err)
            throw err;

        console.log('\nBuild successful, check build folder.');
    });
};

const buildModule = async (src, isObject) => {
    if (builded[src])
        return '';

    //Get start date

    let startTime = new Date().getTime();
    
    //Read JS module

    let js = await fs.readFileSync(src, 'utf-8');

    //Trim comments if prefered

    if (buildPreferences.removeComments) 
        js = trimComments(js);

    //Add to builded

    builded[src] = true;
    
    //Create module comment
    
    let name = src.substr(src.lastIndexOf('/')+1, src.lastIndexOf('.')-src.lastIndexOf('/')-1);
    name = name[0].toUpperCase() + name.substr(1, name.length-1);
    
    let comment = '/* ' + name + (isObject ? ' Object */' : ' */');
    
    //Output
    
    console.log('Builded "' + name + '" (' + (new Date().getTime()-startTime) + ' ms).');

    //Return JS module

    return comment + '\n\n' + js + '\n\n';
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

//Setup keypress functionality

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
      process.stdin.setRawMode(false)
      resolve()
    }))
  }

//Attempt to build framework

buildFramework();