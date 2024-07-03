import express from 'express';
import helloRoute from '../routes/route.js' // Adjust the path as necessary

const app = express();

app.use(helloRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
