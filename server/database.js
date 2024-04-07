const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
};

const transactionSchema = new mongoose.Schema({
  transactionType: { type: String, required: true },
  category: { type: String, required: false },
  amount: { type: Number, required: true },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

const models = {
  Transaction: Transaction,
};

module.exports = { connectDB, models };