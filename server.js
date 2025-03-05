const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Added axios
const DDG = require('duckduckgo-images-api'); // Corrected package name


const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: 'https://search-beta-six.vercel.app'
}));

// Search route
app.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const ddg = new DDG();  // Instantiate the DDG class
        const results = await ddg.image_search({
            query: query,
            moderate: true,  // Equivalent to safesearch=moderate
            iterations: 1     // Limit the number of iterations
        });

        // Adapt results to match the desired output format
        const formattedResults = results.results.map(result => ({
            title: result.title,
            url: result.image, // Use result.image for the image URL
            snippet: result.snippet  // This might need to be adapted based on actual API response
        }));
        res.json(formattedResults);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Failed to fetch data from DuckDuckGo' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
