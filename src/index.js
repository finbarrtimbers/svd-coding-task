const keyword_extractor = require('keyword-extractor');
const fs = require('fs');
const assert = require('assert');
const numeric = require('numeric');
const process = require('process');

/**
 * Sums an array.
 * @param {Array<numeric>} arr
 * @return {numeric}
 */
const sumArray = function sumArray(arr) {
    return arr.reduce((sum, x) => sum + x);
};

/**
 * creates a row of the term document matrix. A[i] == 1 if word i is in the
 * document.
 * @param {string} document
 * @param {string} allWords
 * @return {Array<numeric>}
 */
const createTermDocumentRow = function createRow(document, allWords) {
    assert.notStrictEqual(document, []);
    // We create a binary array A where A[i] == 1 if word is in the document.
    const currRow = allWords.map(
        word => (document.includes(word) ? 1 : 0),
    );
    if (sumArray(currRow) === 0) {
        console.log(document);
    }
    assert.notEqual(sumArray(currRow), 0);
    return currRow;
};


/**
 * Creates the term document matrix for the set of documents. A[i][j] = 1 if
 * term i is in document j.
 * @param {Array<string>} documents
 * @return {Array<Array<numeric>>}
 */
const createTermDocumentMatrix = function createMatrix(documents) {
    // we merge all of the documents so that we can get an array of the unique
    // words
    const merged = [].concat.apply([], documents);
    const allWords = Array.from(new Set(merged));

    // we create the matrix row by row
    const matrix = documents.map(
        document => createTermDocumentRow(document, allWords),
    );

    assert.notStrictEqual(sumArray(matrix), 0);
    return {
        matrix,
        allWords,
    };
};

/**
 * Gets the indices for the N biggest unique elements of an array.
 * @param {Array<numeric>} arr
 * @param {number} N
 * @return {Array<numeric>}
 */
const getNBiggestIndices = function argMaxN(arr, N) {
    // we sort the array in ascending order
    let sorted = arr.concat().sort(
        (a, b) => b - a,
    );
    // we only care about the unique elements
    sorted = Array.from(new Set(sorted));
    const biggest = sorted.slice(0, N);

    assert.strictEqual(biggest.length, N);
    const indices = biggest.map(
        numb => arr.indexOf(numb),
    );
    return indices;
};

/**
 * Gets the top N keywords from a set of documents.
 * @param {Array<string>} documents
 * @param {number} N
 * @return {Array<string>}
 */
const getTopKeywords = function getKeywords(documents, N) {
    const keywordExtractionConfig = {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: false,
    };

    // We extract the keywords from each of the documents
    let keywords = documents.map(
        document => keyword_extractor.extract(document, keywordExtractionConfig),
    );
    keywords = keywords.filter(arr => arr.length > 0);
    // we need to calculate the term-document matrix to extract the keywords.
    const result = createTermDocumentMatrix(keywords);
    let td_matrix = result.matrix;
    const allKeywords = result.allWords;
    /** once we have the matrix, we can use the SVD function to calculate
     * the principal components, and use that to find the top keywords.
     * Note that to run SVD, we need to have the number of rows
     * be greater than the number of columns. If that's not true, we calculate
     * the SVD of the transpose, following Adachi (2016).
     */
    if (td_matrix.length <= allKeywords.length) {
        td_matrix = numeric.transpose(td_matrix);
    }
    const res = numeric.svd(td_matrix);
    const principalComponents = numeric.dot(res.U, res.S);

    // We get the indices for the N biggest unique components
    const keywordIndices = getNBiggestIndices(principalComponents, N);
    const topKeywords = keywordIndices.map(
        index => allKeywords[index],
    );
    return topKeywords;
};

/**
 * Cleans a document so that it can be processed.
 * @param {string} document
 * @return {string}
 */
const cleanDocument = function clean(document) {
    // We first remove all newlines
    let cleanedDocument = document.replace(/(?:\r\n|\r|\n)/g, ' ');
    // then we squash whitespace
    cleanedDocument = cleanedDocument.replace(/\s\s+/g, ' ');
    return cleanedDocument;
};

/**
 * Exports the getTopKeywords function
 * @param {Array<string>} strings
 * @param {number} N
 * @return {Array<string>}
 */
module.exports = function exports(strings, N = 5) {
    return getTopKeywords(strings, N);
};

/**
 * Given the data from a document, calculates the top 10 keywords.
 * @param {error} err
 * @param {string} document
 * @return {Array<string>}}
 */
const processDocument = function process(err, document) {
    const N = 5;
    if (err) {
        throw err;
    }
    let strings = cleanDocument(document).split('.');
    strings = strings.filter(string => (string !== ' ') && (string !== ''));
    const result = getTopKeywords(strings, N);
    assert.strictEqual(result.length, N);
    result.map(
        string => console.log(string),
    );
    return result;
};

fs.readFile(process.argv[2], 'utf8', processDocument);
