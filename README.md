# GDriveDL
## Google Drive Bulk Downloader

### Special thanks to https://github.com/anasrar/Zippy-DL for awesome code

### Clone This Repository

```
$ git clone https://github.com/ariakm25/GDriveDL.git
```

### Change Directory

```
$ cd GDriveDL-master
```

### Install Dependencies

```
$ npm install
```

### Link To Binary
```
$ npm link
```

# How To Use


## Download Single File
```
$ gddl -d <URL>
```
or
```
$ node app.js -d <URL>
```
## Download Batch Inline Command
```
$ gddl -d "<URL1>,<URL2>,..."
```
or
```
$ node app.js -d "<URL1>,<URL2>,..."
```
## Download Batch File From list.txt

first create list.txt
```
https://drive.google.com/xxxx
https://drive.google.com/xxxx
https://drive.google.com/xxxx
https://drive.google.com/xxxx
https://drive.google.com/xxxx
```
then run :
```
$ gddl -b list.txt
```

## Show Help
```
$ gddl -h
```