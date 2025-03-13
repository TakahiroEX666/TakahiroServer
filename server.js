const express = require('express');
const levenshtein = require('fast-levenshtein');

const app = express();
const port = process.env.PORT || 3000;

app.get('/levenshtein-similarity', (req, res) => {
    const str1 = req.query.str1;
    const str2 = req.query.str2;

    if (!str1 || !str2) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    // คำนวณ Levenshtein Distance
    const distance = levenshtein.get(str1, str2);
    
    // คำนวณ Levenshtein Similarity
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = 1 - (distance / maxLength);

    res.json({
        similarity: similarity,
        distance: distance
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
