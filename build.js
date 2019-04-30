const fs = require('fs');

//Building order

const buildOrder = [
    'core.js',
    '~',
    '~objects',
    '~ui'
];

//Build all modules following the build order

const builded = {};

const buildFramework = async () => {
    console.log('Attempting to build the framework...');

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

            //Add comment

            if (actual > 0) {
                actual = actual[0].toUpperCase() + actual.substr(1, actual.length-1);
                build += '/* ' + actual + ' */';
            }

            //Grab all files

            let files = await fs.readdirSync(dir);

            for (let f = 0; f < files.length; f++) 
                if (files[f].indexOf('.js') !== -1)
                    build += await buildModule(dir + files[f], actual.length > 0);
        }
    }

    build +=    '};\n' + 
            '};';

    //Add initialization

    build += '\n\n/* Create Lynx2D instance */\n\nconst lx = new Lynx2D();';

    //Save build

    fs.writeFile('build/lynx2d.js', build, (err) => {
        if (err)
            throw err;

        console.log('Build successful, check build folder.');
    });
};

const buildModule = async (src, isObject) => {
    if (builded[src])
        return '';
    
    //Read JS module

    let js = await fs.readFileSync(src);

    //Add to builded

    builded[src] = true;
    
    //Create module comment
    
    let name = src.substr(src.lastIndexOf('/')+1, src.lastIndexOf('.')-src.lastIndexOf('/')-1);
    name = name[0].toUpperCase() + name.substr(1, name.length-1);
    
    let comment = '/* ' + name + (isObject ? ' Object */' : ' */');
    
    //Output
    
    console.log('Builded "' + name + '"');

    //Return JS module

    return comment + '\n\n' + js + '\n\n';
};

//Attempt to build framework

buildFramework();