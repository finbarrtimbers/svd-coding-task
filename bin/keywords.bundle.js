!function(r){function t(e){if(n[e])return n[e].exports;var u=n[e]={i:e,l:!1,exports:{}};return r[e].call(u.exports,u,u.exports,t),u.l=!0,u.exports}var n={};t.m=r,t.c=n,t.d=function(r,n,e){t.o(r,n)||Object.defineProperty(r,n,{configurable:!1,enumerable:!0,get:e})},t.n=function(r){var n=r&&r.__esModule?function(){return r.default}:function(){return r};return t.d(n,"a",n),n},t.o=function(r,t){return Object.prototype.hasOwnProperty.call(r,t)},t.p="",t(t.s=0)}([function(r,t,n){"use strict";var e=n(1),u=n(2),o=n(3),i=n(4),c=function(r){return r.reduce(function(r,t){return r+t})},a=function(r,t){o.notStrictEqual(r,[]);var n=t.map(function(t){return r.includes(t)?1:0});return 0===c(n)&&console.log(r),o.notEqual(c(n),0),n},f=function(r){var t=[].concat.apply([],r),n=Array.from(new Set(t)),e=r.map(function(r){return a(r,n)});return o.notStrictEqual(c(e),0),{matrix:e,allWords:n}},l=function(r,t){var n=r.concat().sort(function(r,t){return t-r});n=Array.from(new Set(n));var e=n.slice(0,t);return o.strictEqual(e.length,t),e.map(function(t){return r.indexOf(t)})},s=function(r,t){var n={language:"english",remove_digits:!0,return_changed_case:!0,remove_duplicates:!1},u=r.map(function(r){return e.extract(r,n)});u=u.filter(function(r){return r.length>0});var o=f(u),c=o.matrix,a=o.allWords;c.length<=a.length&&(c=i.transpose(c));var s=i.svd(c),p=i.dot(s.U,s.S);return l(p,t).map(function(r){return a[r]})},p=function(r){var t=r.replace(/(?:\r\n|\r|\n)/g," ");return t=t.replace(/\s\s+/g," ")};r.exports=function(r){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5;return s(r,t)};var v=function(r,t){if(r)throw r;var n=p(t).split(".");n=n.filter(function(r){return" "!==r&&""!==r});var e=s(n,5);return o.strictEqual(e.length,5),e.map(function(r){return console.log(r)}),e};u.readFile("article.txt","utf8",v)},function(r,t){r.exports=require("keyword-extractor")},function(r,t){r.exports=require("fs")},function(r,t){r.exports=require("assert")},function(r,t){r.exports=require("numeric")}]);