const fs = require('fs');

const f22 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/22.js', 'utf8');
const f49 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

console.log('--- Compare Module Declarations ---');
console.log('22.js module matches:');
const m22 = f22.match(/webpackJsonp\(\[(\d+)\],\s*\{/);
console.log(m22 ? m22[0] : 'no match');

console.log('49.js module matches:');
const m49 = f49.match(/webpackJsonp\(\[(\d+)\],\s*\{/);
console.log(m49 ? m49[0] : 'no match');

console.log('--- Compare NgModule in 22.js vs 49.js ---');
const ng22 = f22.match(/NgModule\(\{[\s\S]*?\}\)/);
console.log('22.js NgModule:', ng22 ? ng22[0] : 'none');

const ng49 = f49.match(/NgModule\(\{[\s\S]*?\}\)/);
console.log('49.js NgModule:', ng49 ? ng49[0] : 'none');

console.log('--- Compare Component Decorator ---');
const comp22 = f22.match(/Component\(\{[\s\S]*?selector:\s*'([^']+)'/);
console.log('22.js selector:', comp22 ? comp22[1] : 'none');

const comp49 = f49.match(/Component\(\{[\s\S]*?selector:\s*'([^']+)'/);
console.log('49.js selector:', comp49 ? comp49[1] : 'none');
