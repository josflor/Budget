const express = require('express')
const { connectDB, models } = require('./database');

const app = express()
const port = 3000

// Connect to MongoDB Atlas
connectDB();

app.use(express.json());

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
})

// Get all transaction entries
app.get('/transaction', async (req, res) => {
    try {
      const transactionEntries = await models.Transaction.find();
      res.json(transactionEntries);
    } catch (error) {
      console.error('Error fetching transaction entries:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Create a new transaction entry
app.post('/transaction', async (req, res) => {
  const { transactionType, category, amount } = req.body;

  try {
    const newTransactionEntry = await models.Transaction.create({
      transactionType,
      category,
      amount,
    });

    res.json(newTransactionEntry);
  } catch (error) {
    console.error('Error creating transaction entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a transaction entry
app.put('/transaction/:id', async (req, res) => {
  const { id } = req.params;
  const { transactionType, category, amount } = req.body;

  try {
    const updatedTransactionEntry = await models.Transaction.findByIdAndUpdate(
      id,
      { transactionType, category, amount },
      { new: true }
    );

    res.json(updatedTransactionEntry);
  } catch (error) {
    console.error('Error updating transaction entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a transaction entry
app.delete('/transaction/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await models.Transaction.findByIdAndDelete(id);
    res.json({ message: 'Transaction entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})