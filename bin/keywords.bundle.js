!function(r){function n(e){if(t[e])return t[e].exports;var o=t[e]={i:e,l:!1,exports:{}};return r[e].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};n.m=r,n.c=t,n.d=function(r,t,e){n.o(r,t)||Object.defineProperty(r,t,{configurable:!1,enumerable:!0,get:e})},n.n=function(r){var t=r&&r.__esModule?function(){return r.default}:function(){return r};return n.d(t,"a",t),t},n.o=function(r,n){return Object.prototype.hasOwnProperty.call(r,n)},n.p="",n(n.s=0)}([function(r,n,t){"use strict";var e=t(1),o=t(2),u=t(3),i=function(r,n){return n.map(function(n){return r.includes(n)?1:0})},c=function(r){var n=[].concat.spread([],r),t=Array.from(new Set(n));return{matrix:r.map(function(r){return i(r,t)}),allWords:t}},a=function(r,n){return Array.from(new Set(r.concat().sort(function(r,n){return n-r}))).slice(0,n).map(function(n){return r.indexOf(n)})},f=function(r,n){var t={language:"english",remove_digits:!0,return_changed_case:!0,remove_duplicates:!1},o=r.map(function(r){return e.extract(r,t)}),i=c(o),f=i.matrix,s=i.all_words,l=u.svd(u.transpose(f)),p=u.dot(l.U,l.S);return a(p,n).map(function(r){return s[r]})},s=function(r){var n=r.replace(/(?:\r\n|\r|\n)/g," ");return n=n.replace(/\s\s+/g," ")};r.exports=function(r){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5;return f(r,n)};var l=function(r,n){if(r)throw r;var t=s(n).split(".");t=t.filter(function(r){return" "!==r});var e=f(t,10);console.log(e)};o.readFile("article.txt","utf8",l)},function(r,n){r.exports=require("keyword-extractor")},function(r,n){r.exports=require("fs")},function(r,n){r.exports=require("numeric")}]);