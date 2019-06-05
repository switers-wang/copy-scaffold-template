#!/usr/bin/env node

var program = require('commander');
var execSync = require('child_process').execSync;
var inquirer = require('inquirer');
var fs = require('fs');
var path =  require('path');
var stat=fs.stat;


/**
 * Usage.
 */
var exists=function(src,dst,callback){
    //测试某个路径下文件是否存在
    fs.exists(dst,function(exists){
        if(exists){//不存在
            callback(src,dst);
        }else{//存在
            fs.mkdir(dst,function(){//创建目录
                callback(src,dst)
            })
        }
    })
}

var copy = function( src, dst, projectName) {
    //读取目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach( function (path) {
            var _src=src+'/'+path;
            var _dst=dst+'/'+path;
            var readable;
            var writable;
            stat(_src,function(err,st){
                if(err){
                    throw err;
                }
                
                if(st.isFile()){
                    readable=fs.createReadStream(_src);//创建读取流
                    writable=fs.createWriteStream(_dst);//创建写入流
                    readable.pipe(writable);
                }else if(st.isDirectory()){
                    exists(_src,_dst,copy);
                }
            });
        });
        execSync(`rm -rf ${projectName}`, {encoding: 'utf-8'})
    });
}

program
.command('generate')
.description('quick generate your file')
.alias('copy')
.action(function(type, name){
    inquirer
    .prompt([
        {
            type: 'input',
            message: '请输入脚手架git地址',
            name: 'gitUrl'
        }
    ]).then((answer) => {
        gitUrl = answer.gitUrl;
        try {
            result = execSync(`git clone ${gitUrl}`, {encoding: 'utf-8'})
            console.log(result);
            projectName = RegExp("\/(.*).git").exec(gitUrl);
            projectName = projectName[1]
            copy(`${projectName}`, '', projectName);
        } catch (e) {
            console.log(e);
        }
    })
    
})
program.parse(process.argv);
