var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var uglify = require('uglify-js');
var package = require('../package.json');
var version = process.env.VERSION || package.version;
var banner = `/*! UIkit ${version} | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */\n`;

buildthemes();

function buildthemes() {


    if (!fs.existsSync('themes.json') && !fs.existsSync('custom')) {
        return write('themes.json', '{}');
    }

    if (!fs.existsSync('custom')) {
        return;
    }

    var themes = {};

    fs.readdirSync('custom').filter(function(file) {
        return fs.statSync(path.join('custom', file)).isDirectory();
    }).forEach(function(folder) {

        themes[folder] = {
            file: `../css/uikit.${folder}.css`,
            components: []
        };

        exec(`lessc --relative-urls --rootpath=../custom/${folder}/ custom/${folder}/_import.less > css/uikit.${folder}.css`, function() {
            console.log(`${cyan('css/uikit.'+folder+'.css')} build`);
        });
    });

    if (Object.keys(themes).length) {
        write('themes.json', JSON.stringify(themes));
    }

}

function write(dest, code) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(dest, code, function (err) {
            if (err) return reject(err);
            console.log(`${cyan(dest)} ${getSize(code)}`);
            resolve();
        });
    });
}

function getSize(code) {
    return `${(code.length / 1024).toFixed(2)}kb`;
}

function cyan(str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
}