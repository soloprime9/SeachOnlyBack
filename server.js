const express = require('express');
const cors = require('cors');
const axios = require('axios'); 
const duckduckgo = require('duckduckgo-images-api'); 


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
    const results = await duckduckgo.image_search({
      query: query,
      moderate: true,  
      iterations: 1     
    });

    // Adapt results to match the desired output format
    const formattedResults = results.results.map(result => ({
      title: result.title,
      url: result.image, 
      snippet: result.snippet  
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
