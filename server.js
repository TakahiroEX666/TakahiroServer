const express = require('express');
const levenshtein = require('js-levenshtein');
const wordcut = require("wordcut");

const app = express();
const PORT = process.env.PORT || 3000;
wordcut.init();

// API endpoint for calculating Levenshtein Similarity
app.get('/levenshtein-similarity', (req, res) => {
    // Get str1 and str2 from query parameters
    const str1 = req.query.str1 || '';
    const str2 = req.query.str2 || '';

    // Check if both strings are provided
    if (!str1 || !str2) {
        return res.status(400).json({ error: 'Please provide both str1 and str2 as query parameters.' });
    }

    // Calculate Levenshtein Distance
    const distance = levenshtein(str1, str2);

    // Calculate Levenshtein Similarity
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = 1 - distance / maxLength;

    // Return the result as JSON
    res.json({
        str1,
        str2,
        levenshteinDistance: distance,
        levenshteinSimilarity: similarity,
        levenshteinSimilarityPercentage: (similarity * 100).toFixed(2) + '%'
    });
});

app.post("/tokenize", (req, res) => {
    const text = req.body.text;
    if (!text) {
        return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    const tokens = wordcut.cut(text).split("|");
    res.json({ tokens });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
