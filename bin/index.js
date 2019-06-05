#!/usr/bin/env node

process.title = 'cst';

require('commander')
.version(require('../package').version)
.usage('<command> [options]')
.command('sct copy', 'simple copy gitUrl cold to current folder')
.parse(process.argv)

require('./sct-function');