const PriceReference = require('../models/PriceReference');
const Listing = require('../models/Listing');

// @desc    Get reference price for a commodity/category in a location
// @route   GET /api/prices/reference
// @access  Public
const getReferencePrice = async (req, res, next) => {
  try {
    const { category, location, unit, commodity } = req.query;

    // Try to find reference price data
    const filter = {};
    if (category) filter.category = category;
    if (unit) filter.unit = unit;
    if (commodity) {
      const terms = String(commodity).slice(0, 80).split(/[^a-z0-9]+/i).filter((term) => term.length >= 4);
      const pattern = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/s$/i, '') + 's?').join('|');
      if (pattern) filter.commodity = { $regex: pattern, $options: 'i' };
    }
    if (location) {
      // location can be "state" or "state,district"
      const parts = location.split(',').map(s => s.trim());
      if (parts[0]) filter.state = { $regex: parts[0], $options: 'i' };
      if (parts[1]) filter.district = { $regex: parts[1], $options: 'i' };
    }

    const refPrices = await PriceReference.find(filter)
      .sort({ date: -1 })
      .limit(5);

    if (refPrices.length > 0) {
      const latest = refPrices[0];
      return res.status(200).json({
        success: true,
        data: {
          commodity: latest.commodity,
          category: latest.category,
          minPrice: latest.minPrice,
          maxPrice: latest.maxPrice,
          avgPrice: latest.modalPrice || Math.round((latest.minPrice + latest.maxPrice) / 2),
          unit: latest.unit,
          confidence: latest.confidence,
          trend: latest.trend,
          sources: refPrices.length,
          source: latest.source,
          lastUpdated: latest.date
        }
      });
    }

    // Fallback: calculate from active listings
    const listingFilter = { status: 'active' };
    if (category) listingFilter.category = category;
    if (unit) listingFilter.unit = unit;
    if (location) {
      const parts = location.split(',').map((part) => part.trim());
      if (parts[0]) listingFilter['location.state'] = { $regex: parts[0], $options: 'i' };
      if (parts[1]) listingFilter['location.district'] = { $regex: parts[1], $options: 'i' };
    }
    if (commodity) {
      const terms = String(commodity).slice(0, 80).split(/[^a-z0-9]+/i).filter((term) => term.length >= 4);
      const pattern = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/s$/i, '') + 's?').join('|');
      if (pattern) listingFilter.$or = [
        { title: { $regex: pattern, $options: 'i' } },
        { variety: { $regex: pattern, $options: 'i' } },
        { subCategory: { $regex: pattern, $options: 'i' } },
      ];
    }

    const priceStats = await Listing.aggregate([
      { $match: listingFilter },
      {
        $group: {
          _id: '$unit',
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' },
          count: { $sum: 1 }
        }
      }
    ]);

    if (priceStats.length > 0) {
      const stats = priceStats[0];
      return res.status(200).json({
        success: true,
        data: {
          category,
          minPrice: stats.minPrice,
          maxPrice: stats.maxPrice,
          avgPrice: Math.round(stats.avgPrice),
          unit: stats._id,
          confidence: stats.count >= 10 ? 'high' : stats.count >= 3 ? 'medium' : 'low',
          trend: 'flat',
          sources: stats.count,
          source: 'active-listings'
        }
      });
    }

    // No data available
    res.status(200).json({
      success: true,
      data: { category, minPrice: 0, maxPrice: 0, avgPrice: 0, confidence: 'low', trend: 'flat', sources: 0 }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard price ticker data
// @route   GET /api/prices/dashboard
// @access  Public
const getDashboardPrices = async (req, res, next) => {
  try {
    const { location } = req.query;
    const filter = {};
    if (location) {
      const parts = location.split(',').map(s => s.trim());
      if (parts[0]) filter.state = { $regex: parts[0], $options: 'i' };
    }

    const prices = await PriceReference.find(filter).sort({ date: -1 }).limit(50);

    if (prices.length > 0) {
      const grouped = {};
      prices.forEach(p => {
        if (!grouped[p.commodity]) grouped[p.commodity] = p;
      });
      const tickerData = Object.values(grouped).map(p => ({
        id: p._id,
        product: p.commodity,
        emoji: getEmojiForCommodity(p.commodity),
        min: p.minPrice,
        max: p.maxPrice,
        unit: p.unit,
        trend: p.trend,
        source: p.source,
        lastUpdated: p.date,
      }));
      return res.status(200).json({ success: true, data: tickerData });
    }

    // If no reference market rates exist yet, show observed active listing prices
    // as asking-price ranges. Keep units separate and do not present them as mandi rates.
    const listingFilter = { status: 'active' };
    if (location) listingFilter['location.state'] = { $regex: location.split(',')[0].trim(), $options: 'i' };
    const listingRanges = await Listing.aggregate([
      { $match: listingFilter },
      { $group: { _id: { product: { $ifNull: ['$subCategory', '$category'] }, unit: '$unit' }, min: { $min: '$price' }, max: { $max: '$price' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 10 },
    ]);
    const observedPrices = listingRanges.map((item) => ({
      id: `${item._id.product}-${item._id.unit}`,
      product: String(item._id.product).replace(/-/g, ' '),
      emoji: getEmojiForCommodity(item._id.product),
      min: item.min,
      max: item.max,
      unit: item._id.unit,
      trend: 'flat',
      source: 'active-listings',
      count: item.count,
    }));
    res.status(200).json({ success: true, data: observedPrices });
  } catch (error) {
    res.status(503).json({ success: false, message: 'Price data is unavailable while the database is disconnected.', data: [] });
  }
};

function getEmojiForCommodity(name) {
  const map = {
    wheat: '🌾', rice: '🍚', onion: '🧅', potato: '🥔', tomato: '🍅',
    cotton: '🌱', soybean: '🫘', sugarcane: '🍬', maize: '🌽', mango: '🥭'
  };
  return map[name.toLowerCase()] || '🌿';
}

module.exports = { getReferencePrice, getDashboardPrices };
