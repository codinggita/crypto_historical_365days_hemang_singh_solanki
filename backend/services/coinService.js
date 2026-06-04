import Coin from '../models/Coin.js';

const PERFORMANCE_METRIC_MAP = {
  volatility: ['coinId', 'volatility'],
  returns: ['coinId', 'dailyReturn', 'cumulativeReturn', 'growthPercentage'],
  'market-cap': ['coinId', 'averageMarketCap'],
  marketcap: ['coinId', 'averageMarketCap'],
  volume: ['coinId', 'averageVolume']
};

const createServiceError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const roundMetric = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  return Number(value.toFixed(2));
};

/**
 * Fetch all coin records with default pagination.
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getAllCoins = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const totalRecords = await Coin.countDocuments();
  const coins = await Coin.find()
    .skip(skip)
    .limit(limit)
    .sort({ timestamp: -1 });

  return {
    coins,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch a single coin record by MongoDB _id.
 * @param {String} id - MongoDB document ID
 * @returns {Object|null} - Coin document or null
 */
const getCoinById = async (id) => {
  const coin = await Coin.findById(id);
  return coin;
};

/**
 * Create a new coin record.
 * @param {Object} coinData - Coin document fields
 * @returns {Object} - Newly created coin document
 */
const createCoin = async (coinData) => {
  const coin = await Coin.create(coinData);
  return coin;
};

/**
 * Update an existing coin record.
 * @param {String} id - MongoDB document ID
 * @param {Object} updateData - Data to update
 * @returns {Object|null} - Updated coin document or null
 */
const updateCoin = async (id, updateData) => {
  const coin = await Coin.findByIdAndUpdate(id, updateData, {
    returnDocument: 'after',
    runValidators: true
  });
  return coin;
};

/**
 * Delete a coin record by ID.
 * @param {String} id - MongoDB document ID
 * @returns {Object|null} - Deleted coin document or null
 */
const deleteCoin = async (id) => {
  const coin = await Coin.findByIdAndDelete(id);
  return coin;
};

/**
 * Check if a coin record exists by ID.
 * @param {String} id - MongoDB document ID
 * @returns {Boolean} - True if exists, false otherwise
 */
const checkCoinExists = async (id) => {
  const exists = await Coin.exists({ _id: id });
  return exists !== null;
};

/**
 * Bulk create multiple coin records.
 * @param {Array} coinsArray - Array of coin data objects
 * @returns {Array} - Array of newly created documents
 */
const bulkCreateCoins = async (coinsArray) => {
  const coins = await Coin.insertMany(coinsArray);
  return coins;
};

/**
 * Bulk update multiple coin records.
 * @param {Array} updatesArray - Array of objects containing { id, updateData }
 * @returns {Object} - Bulk write result
 */
const bulkUpdateCoins = async (updatesArray) => {
  const bulkOps = updatesArray.map((item) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { $set: item.updateData }
    }
  }));
  const result = await Coin.bulkWrite(bulkOps);
  return result;
};

/**
 * Bulk delete multiple coin records by IDs.
 * @param {Array} idsArray - Array of MongoDB document IDs
 * @returns {Object} - Deletion result containing deletedCount
 */
const bulkDeleteCoins = async (idsArray) => {
  const result = await Coin.deleteMany({ _id: { $in: idsArray } });
  return result;
};

/**
 * Fetch coin records by name (case-insensitive).
 * @param {String} name - Coin name
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getCoinsByName = async (name, { page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const filter = { coin_name: { $regex: name, $options: 'i' } };
  
  const totalRecords = await Coin.countDocuments(filter);
  const coins = await Coin.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ timestamp: -1 });

  return {
    coins,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch coin records by symbol.
 * @param {String} symbol - Coin symbol
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getCoinsBySymbol = async (symbol, { page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const filter = { symbol: symbol.toUpperCase() };
  
  const totalRecords = await Coin.countDocuments(filter);
  const coins = await Coin.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ timestamp: -1 });

  return {
    coins,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch coin records by market cap rank.
 * @param {Number} rank - Market cap rank
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getCoinsByRank = async (rank, { page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  // Use $expr to handle the case where market_cap_rank might be stored as a string in the DB
  const filter = { $expr: { $eq: [{ $toInt: "$market_cap_rank" }, Number(rank)] } };
  
  const totalRecords = await Coin.countDocuments(filter);
  const coins = await Coin.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ timestamp: -1 });

  return {
    coins,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch coin records by month (e.g., "2025-01").
 * @param {String} month - Month string in YYYY-MM format
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getCoinsByMonth = async (month, { page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const filter = { month };

  const totalRecords = await Coin.countDocuments(filter);
  const coins = await Coin.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ timestamp: -1 });

  return {
    coins,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch coin records by date (e.g., "2025-01-15").
 * @param {String} date - Date string in YYYY-MM-DD format
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getCoinsByDate = async (date, { page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const filter = { date };

  const totalRecords = await Coin.countDocuments(filter);
  const coins = await Coin.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ timestamp: -1 });

  return {
    coins,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch the latest coin records (most recent timestamp per unique coin).
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getLatestCoins = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;

  const coins = await Coin.aggregate([
    { $sort: { timestamp: -1 } },
    { $group: { _id: '$coin_id', latestRecord: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$latestRecord' } },
    { $sort: { market_cap: -1 } },
    { $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }]
      }
    }
  ]);

  const data = coins[0].data;
  const totalRecords = coins[0].totalCount[0]?.count || 0;

  return {
    coins: data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch the full price history of a specific coin by coin_id.
 * @param {String} coinId - The coin_id field (e.g., "bitcoin")
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getCoinHistory = async (coinId, { page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const filter = { coin_id: coinId };

  const totalRecords = await Coin.countDocuments(filter);
  const coins = await Coin.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ timestamp: -1 });

  return {
    coins,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch top coins by market cap (descending).
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getTopMarketCapCoins = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;

  const coins = await Coin.aggregate([
    { $sort: { timestamp: -1 } },
    { $group: { _id: '$coin_id', latestRecord: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$latestRecord' } },
    {
      $addFields: {
        market_cap_num: { $toDouble: '$market_cap' }
      }
    },
    { $sort: { market_cap_num: -1 } },
    { $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }]
      }
    }
  ]);

  const data = coins[0].data;
  const totalRecords = coins[0].totalCount[0]?.count || 0;

  return {
    coins: data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch top coins by 24h volume (descending).
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getTopVolumeCoins = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;

  const coins = await Coin.aggregate([
    { $sort: { timestamp: -1 } },
    { $group: { _id: '$coin_id', latestRecord: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$latestRecord' } },
    {
      $addFields: {
        volume_num: { $toDouble: '$volume' }
      }
    },
    { $sort: { volume_num: -1 } },
    { $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }]
      }
    }
  ]);

  const data = coins[0].data;
  const totalRecords = coins[0].totalCount[0]?.count || 0;

  return {
    coins: data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch top gainers by daily return (descending).
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getTopGainersCoins = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;

  const coins = await Coin.aggregate([
    { $sort: { timestamp: -1 } },
    { $group: { _id: '$coin_id', latestRecord: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$latestRecord' } },
    {
      $addFields: {
        daily_return_num: { $toDouble: '$daily_return' }
      }
    },
    { $sort: { daily_return_num: -1 } },
    { $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }]
      }
    }
  ]);

  const data = coins[0].data;
  const totalRecords = coins[0].totalCount[0]?.count || 0;

  return {
    coins: data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch top losers by daily return (ascending).
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getTopLosersCoins = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;

  const coins = await Coin.aggregate([
    { $sort: { timestamp: -1 } },
    { $group: { _id: '$coin_id', latestRecord: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$latestRecord' } },
    {
      $addFields: {
        daily_return_num: { $toDouble: '$daily_return' }
      }
    },
    { $sort: { daily_return_num: 1 } },
    { $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }]
      }
    }
  ]);

  const data = coins[0].data;
  const totalRecords = coins[0].totalCount[0]?.count || 0;

  return {
    coins: data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch oldest coin records in chronological order (timestamp ascending).
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getOldestCoins = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const totalRecords = await Coin.countDocuments();
  const coins = await Coin.find()
    .skip(skip)
    .limit(limit)
    .sort({ timestamp: 1 });

  return {
    coins,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch newest coin records in chronological order (timestamp descending).
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getNewestCoins = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const totalRecords = await Coin.countDocuments();
  const coins = await Coin.find()
    .skip(skip)
    .limit(limit)
    .sort({ timestamp: -1 });

  return {
    coins,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch trending coin records (latest records grouped, sorted by 24h volume descending).
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getTrendingCoins = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;

  const coins = await Coin.aggregate([
    { $sort: { timestamp: -1 } },
    { $group: { _id: '$coin_id', latestRecord: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$latestRecord' } },
    {
      $addFields: {
        volume_num: { $toDouble: '$volume' }
      }
    },
    { $sort: { volume_num: -1 } },
    { $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }]
      }
    }
  ]);

  const data = coins[0].data;
  const totalRecords = coins[0].totalCount[0]?.count || 0;

  return {
    coins: data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch recent coin records (last 7 days of daily logs or latest timestamp records).
 * @param {Object} options - Query options (page, limit)
 * @returns {Object} - Paginated results with metadata
 */
const getRecentCoins = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const totalRecords = await Coin.countDocuments();
  const coins = await Coin.find()
    .skip(skip)
    .limit(limit)
    .sort({ timestamp: -1 });

  return {
    coins,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      limit
    }
  };
};

/**
 * Fetch performance statistics for a specific coin by ID.
 * Calculates historical averages, highs, and lows using optimized aggregation.
 * @param {string} coinId - The unique identifier of the coin (e.g. bitcoin)
 * @param {string} [metric] - Optional filter for specific metric
 * @returns {Object|null} - Performance data or null if not found
 */
const getCoinPerformance = async (coinId, metric = null) => {
  const normalizedCoinId = coinId?.trim();
  const normalizedMetric = metric?.trim().toLowerCase() || null;

  if (!normalizedCoinId) {
    throw createServiceError('coinId is required', 400);
  }

  if (normalizedMetric && !PERFORMANCE_METRIC_MAP[normalizedMetric]) {
    throw createServiceError(
      'Invalid metric. Allowed values are volatility, returns, market-cap, and volume',
      400
    );
  }

  const coinFilter = {
    coin_id: { $regex: new RegExp(`^${normalizedCoinId}$`, 'i') }
  };

  const performanceStats = await Coin.aggregate([
    { $match: coinFilter },
    { $sort: { timestamp: 1, _id: 1 } },
    {
      $project: {
        coin_id: 1,
        numericPrice: {
          $convert: { input: '$price', to: 'double', onError: null, onNull: null }
        },
        numericMarketCap: {
          $convert: { input: '$market_cap', to: 'double', onError: null, onNull: null }
        },
        numericVolume: {
          $convert: { input: '$volume', to: 'double', onError: null, onNull: null }
        },
        numericDailyReturn: {
          $convert: { input: '$daily_return', to: 'double', onError: null, onNull: null }
        },
        numericCumulativeReturn: {
          $convert: { input: '$cumulative_return', to: 'double', onError: null, onNull: null }
        }
      }
    },
    {
      $group: {
        _id: '$coin_id',
        coinId: { $first: '$coin_id' },
        recordCount: { $sum: 1 },
        latestDailyReturnField: { $last: '$numericDailyReturn' },
        latestCumulativeReturnField: { $last: '$numericCumulativeReturn' },
        averagePrice: { $avg: '$numericPrice' },
        highestPrice: { $max: '$numericPrice' },
        lowestPrice: { $min: '$numericPrice' },
        averageMarketCap: { $avg: '$numericMarketCap' },
        averageVolume: { $avg: '$numericVolume' },
        volatility: { $stdDevPop: '$numericPrice' },
        prices: { $push: '$numericPrice' }
      }
    }
  ]);

  if (!performanceStats.length) {
    throw createServiceError(`Coin '${normalizedCoinId}' does not exist`, 404);
  }

  const stats = performanceStats[0];

  if (!stats.recordCount || !stats.prices.length) {
    throw createServiceError(`No historical dataset found for coin '${normalizedCoinId}'`, 404);
  }

  const validPrices = stats.prices.filter((price) => typeof price === 'number');

  if (!validPrices.length) {
    throw createServiceError(`No valid price data found for coin '${normalizedCoinId}'`, 404);
  }

  const latestPrice = validPrices[validPrices.length - 1];
  const previousPrice = validPrices.length > 1 ? validPrices[validPrices.length - 2] : null;
  const firstPrice = validPrices[0];

  const calculatedDailyReturn =
    previousPrice && previousPrice !== 0
      ? ((latestPrice - previousPrice) / previousPrice) * 100
      : null;

  const calculatedGrowthPercentage =
    firstPrice && firstPrice !== 0
      ? ((latestPrice - firstPrice) / firstPrice) * 100
      : null;

  const performance = {
    coinId: stats.coinId,
    averagePrice: roundMetric(stats.averagePrice),
    highestPrice: roundMetric(stats.highestPrice),
    lowestPrice: roundMetric(stats.lowestPrice),
    dailyReturn: roundMetric(
      typeof stats.latestDailyReturnField === 'number'
        ? stats.latestDailyReturnField
        : calculatedDailyReturn
    ),
    cumulativeReturn: roundMetric(
      typeof stats.latestCumulativeReturnField === 'number'
        ? stats.latestCumulativeReturnField
        : calculatedGrowthPercentage
    ),
    growthPercentage: roundMetric(calculatedGrowthPercentage),
    averageMarketCap: roundMetric(stats.averageMarketCap),
    averageVolume: roundMetric(stats.averageVolume),
    volatility: roundMetric(stats.volatility)
  };

  if (!normalizedMetric) {
    return performance;
  }

  return PERFORMANCE_METRIC_MAP[normalizedMetric].reduce((accumulator, field) => {
    accumulator[field] = performance[field];
    return accumulator;
  }, {});
};

export {
  getAllCoins,
  getCoinById,
  createCoin,
  updateCoin,
  deleteCoin,
  checkCoinExists,
  bulkCreateCoins,
  bulkUpdateCoins,
  bulkDeleteCoins,
  getCoinsByName,
  getCoinsBySymbol,
  getCoinsByRank,
  getCoinsByMonth,
  getCoinsByDate,
  getLatestCoins,
  getCoinHistory,
  getTopMarketCapCoins,
  getTopVolumeCoins,
  getTopGainersCoins,
  getTopLosersCoins,
  getOldestCoins,
  getNewestCoins,
  getTrendingCoins,
  getRecentCoins,
  getCoinPerformance
};
