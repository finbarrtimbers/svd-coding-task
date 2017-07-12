const keyword_extractor = require('keyword-extractor');
const fs = require('fs');
const numeric = require('numeric');


/**
 * creates a row of the term document matrix. A[i] == 1 if word i is in the
 * document.
 * @param {string} document
 * @param {string} allWords
 * @return {Array<numeric>}
 */
const createTermDocumentRow = function createRow(document, allWords) {
    // We create a binary array A where A[i] == 1 if word is in the document.
    const currRow = allWords.map(
        word => (document.includes(word) ? 1 : 0),
    );
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

    /** to calculate SVD using numeric.js, we need to have the number of rows
     *  be greater than the number of columns. If that's not true, we pad
     *  the term document matrix with zeros.
     */
    if (matrix.length <= allWords.length) {
        const zeroArray = Array.from(Array(allWords.length), () => 0);
        while (matrix.length <= allWords.length) {
            matrix.push(zeroArray);
        }
    }
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
    const keywords = documents.map(
        document => keyword_extractor.extract(document, keywordExtractionConfig),
    );

    // we need to calculate the term-document matrix to extract the keywords.
    const result = createTermDocumentMatrix(keywords);
    const td_matrix = result.matrix;
    const allKeywords = result.allWords;

    // once we have the matrix, we can use the SVD function to calculate
    // the principal components, and use that to find the top keywords
    const res = numeric.svd(td_matrix);

    // principal components = US
    const principal_components = numeric.dot(res.U, res.S);

    // We get the indices for the N biggest unique components
    const keyword_indices = getNBiggestIndices(principal_components, N);
    const topKeywords = keyword_indices.map(
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
    if (err) {
        throw err;
    }
    let strings = cleanDocument(document).split('.');
    strings = strings.filter(string => string !== ' ');
    const result = getTopKeywords(strings, 10);
    console.log(result);
    return result;
};

fs.readFile('article.txt', 'utf8', processDocument);
