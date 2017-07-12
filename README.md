# Overview

Creates a term-document matrix using a binary weighting function (so for a
term-document matrix A, A[i][j] = 1 if term i is present in document j, and 0
if not). Then, uses numeric.js to calculate the principal component scores
using SVD, and uses the scores to find the top N keywords.

# Usage

The script will print out the top N keywords from `filename.txt` to `stdin` if
you run the following command:

`node index.js filename.txt`

There's an example document taken from the New York Times in `article.txt`. You
can run the script on it with `node index.js article.txt`.

# References

[1] Adachi, Kohei. Matrix-Based Introduction to Multivariate Data Analysis.
Springer Singapore, 2016.
