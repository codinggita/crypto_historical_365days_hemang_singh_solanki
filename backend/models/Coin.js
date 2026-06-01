import mongoose from 'mongoose';

const CoinSchema = new mongoose.Schema(
  {
    coin_id: {
      type: String,
      required: [true, 'Coin ID is required'],
      trim: true,
      index: true
    },
    coin_name: {
      type: String,
      required: [true, 'Coin name is required'],
      trim: true
    },
    symbol: {
      type: String,
      required: [true, 'Coin symbol is required'],
      trim: true,
      uppercase: true,
      index: true
    },
    market_cap_rank: {
      type: Number,
      required: [true, 'Market cap rank is required'],
      index: true
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
      index: true
    },
    date: {
      type: String,
      required: [true, 'Date string is required'],
      trim: true,
      index: true
    },
    month: {
      type: String,
      required: [true, 'Month string is required'],
      trim: true,
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required']
    },
    market_cap: {
      type: Number,
      required: [true, 'Market capitalization is required']
    },
    volume: {
      type: Number,
      required: [true, 'Trading volume is required']
    },
    daily_return: {
      type: Number,
      default: null
    },
    price_ma7: {
      type: Number,
      default: null
    },
    price_ma30: {
      type: Number,
      default: null
    },
    volatility_7d: {
      type: Number,
      default: null
    },
    cumulative_return: {
      type: Number,
      default: null
    }
  },
  {
    // Bind schema to the pre-existing MongoDB collection name
    collection: 'crypto_his',
    // Enable automated timestamp tracking for insertions and updates
    timestamps: true
  }
);

// Define any multi-key or complex compound indexes if needed in the future
// Example: CoinSchema.index({ coin_id: 1, date: -1 });

const Coin = mongoose.model('Coin', CoinSchema);

export default Coin;
