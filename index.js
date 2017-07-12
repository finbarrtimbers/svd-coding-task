'use strict';

let keyword_extractor = require("keyword-extractor");
let fs = require('fs');
let svd = require('node-svd').svd;

let createTermDocumentMatrix = function(strings) {
    let merged = [].concat.apply([], strings);
    let all_words = Array.from(new Set(merged));
    let matrix = [];
    for (let document of strings) {
        let curr_row = all_words.map(
            word => {return document.includes(word) ? 1: 0}
        )
        matrix.push(curr_row);
    }
    return matrix;
    // add check that sum === len(keywords)
};

let getTopNKeywords = function(strings, N) {
    // We extract the keywords from each of the strings
    let keywords = strings.map(
        string => {return keyword_extractor.extract(string,
                                             {language: "english",
                                              remove_digits: true,
                                              return_changed_case: true,
                                              remove_duplicates: false})});
    // To create the term-document matrix, we need a list of all the unique
    // words
    let td_matrix = createTermDocumentMatrix(strings);
    console.log(td_matrix.length, 'x', td_matrix[0].length);
    let res = svd(td_matrix, N, {U: true, V: false, debug: false});
}

let clean = function(string) {
    string = string.replace(/(?:\r\n|\r|\n)/g, ' ');
    string = string.replace(/\s\s+/g, ' ');
    return string;
}

/**
 * Adds commas to a number
 * @param {number} number
 * @param {string} locale
 * @return {string}
 */
module.exports = function(strings, N=5) {
    return getTopNKeywords(strings, 5);
};

var text = fs.readFile("article.txt", 'utf8', function(err, data) {
    if (err) {
        throw err;
    }
    let text = clean(data);
    let strings = text.split('.');
    strings = strings.filter(string => {return string !== ' '});
    var result = getTopNKeywords(strings, 10);
});
