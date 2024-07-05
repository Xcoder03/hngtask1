import express from 'express';
import helloRoute from '../routes/route.js';

const app = express();

app.use(helloRoute);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 3000;
app.set('trust proxy', true)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
