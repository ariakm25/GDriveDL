#!/usr/bin/env node

const 
    _proggers = require('cli-progress'),
    _commander = require('commander'),
    _colors = require('colors'),
    _fs = require('fs'),
    _axios = require('axios');
    _url = require('url'),
    _https = require('https'),
    _async = require('async'),
    _version = '2.0.1';

const clacSize = (a, b) => {
    if (0 == a) return "0 Bytes";
    var c = 1024,
        d = b || 2,
        e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

const GetLink = (url, cb) => {
    id = url.match(/(file\/d\/|open\?id=)(.*?)(\/view|$)/si)[2];
    const urlx = `https://drive.google.com/uc?id=${id}&authuser=0&export=download` 
    const gd = _https.get(urlx);

    gd.on('response', (res) => {
        console.log(_colors.green('Done'));
        console.log(_colors.yellow('Fetch Link Download...'));
        res.setEncoding('utf8');
        let body = '';
        res.on('data', (data) => {
            body += data;
        });
        res.on('end', () => {
            _axios.post(urlx, {}, {
                headers: {
                    'accept-encoding': 'gzip, deflate, br',
                    'content-length': 0,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'origin': 'https://drive.google.com',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                    'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
                    'x-drive-first-party': 'DriveWebUi',
                    'x-json-requested': 'true'
                }
            }).then(data => {
                var result = data.data;
                _json = result.slice(4);
                dlurl = JSON.parse(_json);
                console.log(_colors.green('Done'));
                console.log(_colors.yellow('Start Download From URL : ' + dlurl.downloadUrl));
                dLoad(dlurl, cb);
            }).catch(e => console.log(e))

        });
    });
}

const dLoad = (url, cb) => {
    const req = _https.get(url.downloadUrl);

    console.log(_colors.yellow('Waiting Server Response...'));
    req.on('response', (res) => {

        console.log(_colors.green('Server Response OK'));

        let size = parseInt(url.sizeBytes, 10),
            currentSize = 0,
            filename = decodeURIComponent(res.headers['content-disposition'].match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/)[1]);

        console.log(_colors.blue('Start Downloading File : ' + filename));

        const file = _fs.createWriteStream(filename);
        res.pipe(file)

        const loadbar = new _proggers.Bar({
            format: 'Downloading ' + _colors.green('{bar}') + ' {percentage}% | {current}/{size}'
        }, _proggers.Presets.shades_classic);
        loadbar.start(size, 0, {
            size: clacSize(size, 3),
            current: clacSize(currentSize, 3)
        });

        res.on('data', (c) => {
            currentSize += c.length;
            loadbar.increment(c.length, {
                current: clacSize(currentSize, 3)
            });
        });
        res.on('end', () => {
            loadbar.stop();
            file.close();
            console.log(_colors.green('Success Download File : ' + filename));
            cb()
        });
        res.on('error', () => {
            _fs.unlink(filename);
            cb()
        })
    })
}

_commander.version(`Version: ${_version}`, '-v, --version').usage('[options] <args>')
_commander.option('-d, --download <URL>', 'Download From URL, Can Be Multiple URL With Comma', (a) => {

    a = a.split(',')

    if (a.length > 1) {
        _async.eachSeries(a,
            (a, b) => {
                console.log(_colors.yellow(`Get Page From : ${a}`))
                GetLink(a.trim(), b)
            },
            (err, res) => {
                console.log(`Batch Download Done`)
            })
    } else {
        console.log(_colors.yellow(`Get Page From : ${a[0]}`))
        GetLink(a[0], () => {})
    }
})

_commander.option('-b, --batch <FILE>', 'Get URL Download From File', (a) => {

    if (!_fs.existsSync(a)) {
        console.log(_colors.bgRed.white(`  File ${a} Not Found  `));
    } else {
        let file = _fs.readFileSync(a, 'utf8')
        file = file.split(/\r\n|\r|\n/)

        _async.eachSeries(file,
            (a, b) => {
                console.log(_colors.yellow(`Get Page From : ${a}`))
                GetLink(a.trim(), b)
            },
            (err, res) => {
                console.log(`Batch Download Done`)
            })
    }
})

_commander.parse(process.argv)

if (!process.argv.slice(2).length) {
    _commander.outputHelp()
    return;
}