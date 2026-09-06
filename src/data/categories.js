export const categories = [
  {
    id: 'agricultural-produce',
    key: 'categories.agriculturalProduce',
    icon: '🌾',
    color: 'bg-green-100 text-green-800',
    subcategories: [
      { id: 'cereals', key: 'categories.cereals', icon: '🌾' },
      { id: 'pulses', key: 'categories.pulses', icon: '🫘' },
      { id: 'fruits', key: 'categories.fruits', icon: '🍎' },
      { id: 'vegetables', key: 'categories.vegetables', icon: '🥬' },
      { id: 'flowers', key: 'categories.flowers', icon: '🌻' },
      { id: 'spices', key: 'categories.spices', icon: '🌶️' },
      { id: 'oilseeds', key: 'categories.oilseeds', icon: '🥜' },
      { id: 'cashcrops', key: 'categories.cashCrops', icon: '🍬' },
    ],
    transactionTypes: ['sell', 'buy']
  },
  {
    id: 'plants-nursery',
    key: 'categories.plantsNursery',
    icon: '🌱',
    color: 'bg-emerald-100 text-emerald-800',
    subcategories: [
      { id: 'saplings', key: 'categories.saplings', icon: '🌱' },
      { id: 'seeds', key: 'categories.seeds', icon: '🌰' },
    ],
    transactionTypes: ['sell', 'buy']
  },
  {
    id: 'machinery',
    key: 'categories.machinery',
    icon: '🚜',
    color: 'bg-blue-100 text-blue-800',
    subcategories: [
      { id: 'tractors', key: 'categories.tractors', icon: '🚜' },
      { id: 'implements', key: 'categories.implements', icon: '🔧' },
      { id: 'harvesters', key: 'categories.harvesters', icon: '⚙️' },
      { id: 'irrigation', key: 'categories.irrigation', icon: '💧' },
    ],
    transactionTypes: ['sell', 'buy', 'rent']
  },
  {
    id: 'services',
    key: 'categories.services',
    icon: '👨‍🌾',
    color: 'bg-purple-100 text-purple-800',
    subcategories: [
      { id: 'labor', key: 'categories.labor', icon: '👷' },
      { id: 'consulting', key: 'categories.consulting', icon: '💼' },
      { id: 'soilTesting', key: 'categories.soilTesting', icon: '🧪' },
    ],
    transactionTypes: ['sell', 'buy']
  },
  {
    id: 'agri-inputs',
    key: 'categories.agriInputs',
    icon: '🧪',
    color: 'bg-yellow-100 text-yellow-800',
    subcategories: [
      { id: 'seeds', key: 'categories.seeds', icon: '🌰' },
      { id: 'fertilizers', key: 'categories.fertilizers', icon: '🧂' },
      { id: 'pesticides', key: 'categories.pesticides', icon: '🧪' },
    ],
    transactionTypes: ['sell', 'buy']
  },
  {
    id: 'materials',
    key: 'categories.materials',
    icon: '🧱',
    color: 'bg-orange-100 text-orange-800',
    subcategories: [
      { id: 'packaging', key: 'categories.packaging', icon: '📦' },
      { id: 'greenhouse', key: 'categories.greenhouse', icon: '🏠' },
    ],
    transactionTypes: ['sell', 'buy']
  },
  {
    id: 'transportation',
    key: 'categories.transportation',
    icon: '🚚',
    color: 'bg-indigo-100 text-indigo-800',
    subcategories: [
      { id: 'trucks', key: 'categories.trucks', icon: '🚚' },
      { id: 'vans', key: 'categories.vans', icon: '🚐' },
    ],
    transactionTypes: ['sell', 'buy', 'rent']
  },
  {
    id: 'storage',
    key: 'categories.storage',
    icon: '🏭',
    color: 'bg-gray-100 text-gray-800',
    subcategories: [
      { id: 'coldStorage', key: 'categories.coldStorage', icon: '❄️' },
      { id: 'warehouses', key: 'categories.warehouses', icon: '🏭' },
    ],
    transactionTypes: ['sell', 'buy', 'rent']
  }
];
