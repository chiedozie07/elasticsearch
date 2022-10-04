const express = require('express');
const searchEngineRoutes = require('./api/routes/routes');

const app = express();

//elasticsearch port configuration
app.use('/api/elasticsearch', searchEngineRoutes);
//products route
app.use('/api', searchEngineRoutes);

const port = process.env.PORT || 9200;

app.listen(port, () => console.log(`Dispatch-zee seach engine server is runing on http://localhost${port}`));