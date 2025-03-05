const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://search-beta-six.vercel.app'
}));

app.get('/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const response = await axios.get(`https://api.duckduckgo.com/?q=${query}&format=json&no_html=1&skip_disambig=1&safe=moderate`);
    const results = response.data.RelatedTopics;

    const requestList = results.map(result => ({
      title: result.FirstURL,
      url: result.FirstURL,
      snippet: result.Text
    }));

    res.json(requestList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from DuckDuckGo' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
