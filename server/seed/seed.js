require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Store = require('../models/Store');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const Address = require('../models/Address');
const Cart = require('../models/Cart');

const img = (seed, w = 600, h = 600) => `https://images.unsplash.com/photo-1542838132-92c53300491e?w=${w}&auto=format&fit=crop`;

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/apk_grocery_db');
      console.log('✓ Connected to MongoDB for seeding...');
    }


    // Clear existing data
    await User.deleteMany({});
    await Store.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Wishlist.deleteMany({});
    await Address.deleteMany({});
    await Cart.deleteMany({});
    console.log('✓ Cleaned up old database collections');

    // Password hashing helper
    // 1. Create Users
    const adminUser = await User.create({
      name: 'GrocMart Admin',
      email: 'kumar@gmail.com',
      password: 'Kj1110;l',
      phone: '+91 9876543210',
      role: 'ADMIN'
    });

    const demoAdminUser = await User.create({
      name: 'APK Admin',
      email: 'admin@apkgrocery.demo',
      password: 'Admin@123',
      phone: '+91 9876543200',
      role: 'ADMIN'
    });

    const storeOwner = await User.create({
      name: 'Ramesh Kirana Owner',
      email: 'owner@apkgrocery.demo',
      password: 'Owner@123',
      phone: '+91 9876543211',
      role: 'STORE_OWNER'
    });

    const storeOwner2 = await User.create({
      name: 'Suresh Express Owner',
      email: 'owner2@apkgrocery.demo',
      password: 'Owner@123',
      phone: '+91 9876543212',
      role: 'STORE_OWNER'
    });

    const customerNames = [
      'Ananya Sharma',
      'Rahul Verma',
      'Priya Patel',
      'Vikram Singh',
      'Deepika Nair',
      'Karthik Raju',
      'Sneha Iyer',
      'Arjun Reddy',
      'Pooja Gupta',
      'Amitabh Joshi'
    ];

    const customers = [];

    // Create primary customer
    const primaryCustomer = await User.create({
      name: 'Demo Customer',
      email: 'customer@apkgrocery.demo',
      password: 'Customer@123',
      phone: '+91 9876543220',
      role: 'CUSTOMER'
    });
    customers.push(primaryCustomer);

    for (let i = 1; i <= 9; i++) {
      const c = await User.create({
        name: customerNames[i - 1],
        email: `customer${i}@apkgrocery.demo`,
        password: 'Customer@123',
        phone: `+91 98765432${20 + i}`,
        role: 'CUSTOMER'
      });
      customers.push(c);
    }
    console.log(`✓ Created 1 Admin, 2 Store Owners, and ${customers.length} Customers`);

    // 2. Create Stores
    const mainStore = await Store.create({
      owner: storeOwner._id,
      name: 'APK Grocery Stores - Indiranagar',
      slug: 'apk-grocery-stores-indiranagar',
      description: 'Your premier local neighborhood grocery destination for fresh daily essentials, grains, and produce.',
      logo: { url: img('apk-logo-store', 200, 200), publicId: 'mock_logo' },
      banner: { url: img('apk-banner-store', 1200, 400), publicId: 'mock_banner' },
      phone: '+91 (080) 4122-8900',
      address: {
        street: 'Shop #14, 100 Feet Road',
        area: 'HAL 2nd Stage, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      },
      openingTime: '07:00 AM',
      closingTime: '10:00 PM',
      deliveryFee: 30,
      minimumOrder: 100,
      deliveryRadius: 8,
      status: 'ACTIVE',
      rating: 4.9,
      reviewCount: 142
    });

    const secondStore = await Store.create({
      owner: storeOwner2._id,
      name: 'APK Express - Koramangala',
      slug: 'apk-express-koramangala',
      description: 'Fast 15-minute delivery for daily groceries and instant snacks in Koramangala.',
      logo: { url: img('apk-logo-store2', 200, 200), publicId: 'mock_logo2' },
      banner: { url: img('apk-banner-store2', 1200, 400), publicId: 'mock_banner2' },
      phone: '+91 (080) 4122-9911',
      address: {
        street: '#42, 80 Feet Road',
        area: '4th Block, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034'
      },
      openingTime: '06:30 AM',
      closingTime: '11:00 PM',
      deliveryFee: 25,
      minimumOrder: 99,
      deliveryRadius: 6,
      status: 'ACTIVE',
      rating: 4.7,
      reviewCount: 88
    });
    console.log('✓ Created 2 Stores');

const categoryImages = {
  'Fruits & Vegetables': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop',
  'Rice & Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop',
  'Pulses & Dal': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop',
  'Cooking Oil & Ghee': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop',
  'Dairy & Eggs': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop',
  'Bakery & Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop',
  'Snacks & Munchies': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop',
  'Beverages': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop',
  'Spices & Masalas': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop',
  'Personal Care': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
  'Household & Cleaning': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop',
  'Baby Care': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop',
  'Frozen Foods': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
  'Tea & Coffee': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop',
  'Instant & Ready Foods': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop'
};

const productImageMap = [
  { match: 'Atta', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop' },
  { match: 'Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop' },
  { match: 'Raw Rice', url: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop' },
  { match: 'Toor Dal', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop' },
  { match: 'Moong Dal', url: 'https://images.unsplash.com/photo-1585994191611-72b357ee515d?w=600&auto=format&fit=crop' },
  { match: 'Chana Dal', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop' },
  { match: 'Chana Whole', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop' },
  { match: 'Sunflower Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop' },
  { match: 'Ghee', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop' },
  { match: 'Mustard Oil', url: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&auto=format&fit=crop' },
  { match: 'Healthy Heart Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop' },
  { match: 'Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop' },
  { match: 'Butter', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop' },
  { match: 'Paneer', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop' },
  { match: 'Eggs', url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop' },
  { match: 'Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop' },
  { match: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop' },
  { match: 'Onions', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=600&auto=format&fit=crop' },
  { match: 'Potato', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop' },
  { match: 'Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop' },
  { match: 'Salt', url: 'https://images.unsplash.com/photo-1518110168401-f284358636cd?w=600&auto=format&fit=crop' },
  { match: 'Chilli Powder', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop' },
  { match: 'Garam Masala', url: 'https://images.unsplash.com/photo-1509358271058-acd05cc93898?w=600&auto=format&fit=crop' },
  { match: 'Turmeric', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop' },
  { match: 'Biscuits', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop' },
  { match: 'Bhujia', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?w=600&auto=format&fit=crop' },
  { match: 'Chips', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop' },
  { match: 'Makhana', url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop' },
  { match: 'Orange Juice', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop' },
  { match: 'Coca-Cola', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop' },
  { match: 'Mango Drink', url: 'https://images.unsplash.com/photo-1546171753-97d7676e4180?w=600&auto=format&fit=crop' },
  { match: 'Tea', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop' },
  { match: 'Coffee', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop' },
  { match: 'Noodles', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop' },
  { match: 'Ready to Eat', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop' },
  { match: 'Soup', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop' },
  { match: 'Detergent', url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop' },
  { match: 'Floor Cleaner', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop' },
  { match: 'Dishwash', url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop' },
  { match: 'Toilet Cleaner', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop' },
  { match: 'Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop' },
  { match: 'Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop' },
  { match: 'Soap', url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop' },
  { match: 'Toothpaste', url: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=600&auto=format&fit=crop' },
  { match: 'Shampoo', url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop' },
  { match: 'Diapers', url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop' },
  { match: 'Wipes', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop' },
  { match: 'Green Peas', url: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&auto=format&fit=crop' },
  { match: 'French Fries', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop' }
];

const getProductPhoto = (productName, categoryName) => {
  const found = productImageMap.find((item) => productName.toLowerCase().includes(item.match.toLowerCase()));
  if (found) return found.url;
  return categoryImages[categoryName] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop';
};

const categorySeeds = [
  { name: 'Fruits & Vegetables', desc: 'Farm fresh organic fruits and daily vegetables' },
  { name: 'Rice & Grains', desc: 'Premium basmati, raw rice, wheat flour & grains' },
  { name: 'Pulses & Dal', desc: 'Unpolished protein-rich dals and pulses' },
  { name: 'Cooking Oil & Ghee', desc: 'Pure refined oils, mustard oil, mustard oil & cow ghee' },
  { name: 'Dairy & Eggs', desc: 'Fresh milk, curd, paneer, butter & farm eggs' },
  { name: 'Bakery & Bread', desc: 'Freshly baked breads, buns & bakery snacks' },
  { name: 'Snacks & Munchies', desc: 'Biscuits, namkeen, chips & crispy munchies' },
  { name: 'Beverages', desc: 'Fruit juices, soft drinks, energy drinks & sodas' },
  { name: 'Spices & Masalas', desc: 'Aroma-locked pure ground spices & whole masalas' },
  { name: 'Personal Care', desc: 'Soaps, shampoos, toothpaste & grooming items' },
  { name: 'Household & Cleaning', desc: 'Detergents, floor cleaners & dishwash liquids' },
  { name: 'Baby Care', desc: 'Baby food, diapers, wipes & gentle bath items' },
  { name: 'Frozen Foods', desc: 'Frozen peas, french fries, parathas & ice creams' },
  { name: 'Tea & Coffee', desc: 'Premium tea leaves, CTC tea & filter coffee powder' },
  { name: 'Instant & Ready Foods', desc: 'Instant noodles, soups, pasta & ready-to-eat mixes' }
];

const categoryDocs = [];
for (const cat of categorySeeds) {
  const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const catImage = categoryImages[cat.name] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop';
  const doc = await Category.create({
    name: cat.name,
    slug,
    description: cat.desc,
    image: { url: catImage, publicId: `cat_${slug}` }
  });
  categoryDocs.push(doc);
}
    console.log(`✓ Created ${categoryDocs.length} Categories`);

    // Helper map for categories by name
    const getCatId = (name) => categoryDocs.find((c) => c.name.toLowerCase().includes(name.toLowerCase()))._id;

    // 4. Create 52 Indian Grocery Products
    const productSeeds = [
      // Rice & Grains
      { name: 'Aashirvaad Superior Sharbati Whole Wheat Atta', brand: 'Aashirvaad', category: 'Rice & Grains', weight: '5 kg Bag', mrp: 340, price: 295, stock: 45, isPopular: true, isBestSeller: true },
      { name: 'India Gate Super Aged Long Grain Basmati Rice', brand: 'India Gate', category: 'Rice & Grains', weight: '5 kg Bag', mrp: 680, price: 599, stock: 30, isPopular: true, isBestSeller: true },
      { name: 'Fortune Sona Masoori Raw Rice', brand: 'Fortune', category: 'Rice & Grains', weight: '10 kg Bag', mrp: 650, price: 580, stock: 25, isPopular: false, isBestSeller: false },
      { name: 'Pillsbury Multigrain Atta Blend', brand: 'Pillsbury', category: 'Rice & Grains', weight: '5 kg Bag', mrp: 350, price: 310, stock: 18, isPopular: true, isBestSeller: false },

      // Pulses & Dal
      { name: 'Simpama Unpolished Toor Dal', brand: 'Simpama', category: 'Pulses & Dal', weight: '1 kg Pack', mrp: 195, price: 172, stock: 50, isPopular: true, isBestSeller: true },
      { name: '24 Mantra Organic Moong Dal Yellow Split', brand: '24 Mantra', category: 'Pulses & Dal', weight: '500 g Pack', mrp: 115, price: 98, stock: 40, isPopular: false, isBestSeller: false },
      { name: 'Tata Sampann Chana Dal', brand: 'Tata Sampann', category: 'Pulses & Dal', weight: '1 kg Pack', mrp: 140, price: 125, stock: 35, isPopular: true, isBestSeller: false },
      { name: 'Fortune Unpolished Chana Whole', brand: 'Fortune', category: 'Pulses & Dal', weight: '1 kg Pack', mrp: 130, price: 112, stock: 22, isPopular: false, isBestSeller: false },

      // Oil & Ghee
      { name: 'Fortune Sunlite Refined Sunflower Oil', brand: 'Fortune', category: 'Oil & Ghee', weight: '1 L Pouch', mrp: 165, price: 145, stock: 60, isPopular: true, isBestSeller: true },
      { name: 'Amul Pure Cow Ghee Jar', brand: 'Amul', category: 'Oil & Ghee', weight: '500 ml Jar', mrp: 355, price: 320, stock: 28, isPopular: true, isBestSeller: true },
      { name: 'Dhara Kachi Ghani Mustard Oil', brand: 'Dhara', category: 'Oil & Ghee', weight: '1 L Bottle', mrp: 180, price: 158, stock: 15, isPopular: false, isBestSeller: false },
      { name: 'Saffola Gold Pro Healthy Heart Oil', brand: 'Saffola', category: 'Oil & Ghee', weight: '1 L Pouch', mrp: 210, price: 185, stock: 40, isPopular: true, isBestSeller: false },

      // Dairy & Eggs
      { name: 'Amul Taaza Fresh Toned Milk', brand: 'Amul', category: 'Dairy & Eggs', weight: '1 L Pack', mrp: 72, price: 66, stock: 100, isPopular: true, isBestSeller: true },
      { name: 'Amul Pasteurised Butter', brand: 'Amul', category: 'Dairy & Eggs', weight: '500 g Pack', mrp: 275, price: 255, stock: 35, isPopular: true, isBestSeller: true },
      { name: 'Nandini Malai Fresh Paneer', brand: 'Nandini', category: 'Dairy & Eggs', weight: '200 g Pack', mrp: 95, price: 88, stock: 20, isPopular: true, isBestSeller: false },
      { name: 'Happy Hens Country Farm Eggs', brand: 'Happy Hens', category: 'Dairy & Eggs', weight: 'Tray of 12', mrp: 110, price: 96, stock: 15, isPopular: false, isBestSeller: false },

      // Fruits & Vegetables
      { name: 'Fresh Shimla Crisp Apples', brand: 'Farm Fresh', category: 'Fruits & Vegetables', weight: '1 kg', mrp: 230, price: 189, stock: 25, isPopular: true, isBestSeller: true },
      { name: 'Farm Fresh Organic Red Tomatoes', brand: 'Local Mandi', category: 'Fruits & Vegetables', weight: '1 kg', mrp: 45, price: 34, stock: 80, isPopular: true, isBestSeller: true },
      { name: 'Fresh Nashik Red Onions', brand: 'Local Mandi', category: 'Fruits & Vegetables', weight: '2 kg', mrp: 80, price: 62, stock: 70, isPopular: true, isBestSeller: false },
      { name: 'Fresh Baby Potato (Aloo)', brand: 'Farm Fresh', category: 'Fruits & Vegetables', weight: '1 kg', mrp: 35, price: 28, stock: 65, isPopular: false, isBestSeller: false },
      { name: 'Organic Robusta Bananas', brand: 'Farm Fresh', category: 'Fruits & Vegetables', weight: '1 kg (6-7 pcs)', mrp: 60, price: 48, stock: 40, isPopular: true, isBestSeller: false },

      // Spices & Masalas
      { name: 'Tata Iodised Vacuum Evaporated Salt', brand: 'Tata', category: 'Spices & Masalas', weight: '1 kg Pack', mrp: 30, price: 27, stock: 120, isPopular: true, isBestSeller: true },
      { name: 'MDH Deggi Mirch Red Chilli Powder', brand: 'MDH', category: 'Spices & Masalas', weight: '200 g Pouch', mrp: 98, price: 84, stock: 45, isPopular: true, isBestSeller: true },
      { name: 'Everest Super Garam Masala Powder', brand: 'Everest', category: 'Spices & Masalas', weight: '100 g Pouch', mrp: 105, price: 89, stock: 50, isPopular: true, isBestSeller: false },
      { name: 'Catch Turmeric (Haldi) Powder', brand: 'Catch', category: 'Spices & Masalas', weight: '200 g Pack', mrp: 65, price: 54, stock: 60, isPopular: false, isBestSeller: false },

      // Snacks & Munchies
      { name: 'Parle-G Gold Original Glucose Biscuits', brand: 'Parle', category: 'Snacks & Munchies', weight: '800 g Pack', mrp: 78, price: 65, stock: 90, isPopular: true, isBestSeller: true },
      { name: 'Haldirams Nagpur Bhujia Sev', brand: 'Haldirams', category: 'Snacks & Munchies', weight: '350 g Pack', mrp: 110, price: 95, stock: 55, isPopular: true, isBestSeller: true },
      { name: 'Lays Magic Masala Potato Chips', brand: 'Lays', category: 'Snacks & Munchies', weight: '115 g Party Pack', mrp: 50, price: 45, stock: 80, isPopular: true, isBestSeller: false },
      { name: 'Nutraj Roasted Salted Makhana', brand: 'Nutraj', category: 'Snacks & Munchies', weight: '100 g Pack', mrp: 185, price: 149, stock: 25, isPopular: false, isBestSeller: false },

      // Beverages
      { name: 'Tropicana 100% Real Orange Juice', brand: 'Tropicana', category: 'Beverages', weight: '1 L Tetra Pack', mrp: 145, price: 120, stock: 35, isPopular: true, isBestSeller: false },
      { name: 'Coca-Cola Original Refreshing Soft Drink', brand: 'Coca-Cola', category: 'Beverages', weight: '1.25 L Bottle', mrp: 70, price: 62, stock: 50, isPopular: true, isBestSeller: true },
      { name: 'Paper Boat Aamras Mango Drink', brand: 'Paper Boat', category: 'Beverages', weight: '1 L Pack', mrp: 130, price: 110, stock: 30, isPopular: false, isBestSeller: false },

      // Tea & Coffee
      { name: 'Brooke Bond Red Label Tea', brand: 'Brooke Bond', category: 'Tea & Coffee', weight: '500 g Pack', mrp: 310, price: 275, stock: 40, isPopular: true, isBestSeller: true },
      { name: 'Taj Mahal Premium Loose Tea', brand: 'Taj Mahal', category: 'Tea & Coffee', weight: '250 g Box', mrp: 210, price: 188, stock: 20, isPopular: true, isBestSeller: false },
      { name: 'Nescafe Classic Instant Coffee Jar', brand: 'Nescafe', category: 'Tea & Coffee', weight: '100 g Glass Jar', mrp: 360, price: 315, stock: 30, isPopular: true, isBestSeller: true },

      // Instant & Ready Foods
      { name: 'Maggi 2-Minute Masala Noodles', brand: 'Maggi', category: 'Instant & Ready Foods', weight: 'Pack of 12 (840g)', mrp: 168, price: 148, stock: 75, isPopular: true, isBestSeller: true },
      { name: 'MTR Ready to Eat Paneer Butter Masala', brand: 'MTR', category: 'Instant & Ready Foods', weight: '300 g Pack', mrp: 140, price: 119, stock: 30, isPopular: false, isBestSeller: false },
      { name: 'Knorr Instant Tomato Soup', brand: 'Knorr', category: 'Instant & Ready Foods', weight: '4 Servings Pack', mrp: 60, price: 52, stock: 45, isPopular: false, isBestSeller: false },

      // Household & Cleaning
      { name: 'Surf Excel Easy Wash Detergent Powder', brand: 'Surf Excel', category: 'Household & Cleaning', weight: '1 kg Pack', mrp: 155, price: 135, stock: 50, isPopular: true, isBestSeller: true },
      { name: 'Lizol Disinfectant Floor Cleaner Citrus', brand: 'Lizol', category: 'Household & Cleaning', weight: '975 ml Bottle', mrp: 215, price: 189, stock: 40, isPopular: true, isBestSeller: false },
      { name: 'Vim Dishwash Gel Lemon Squeeze', brand: 'Vim', category: 'Household & Cleaning', weight: '750 ml Bottle', mrp: 175, price: 152, stock: 65, isPopular: true, isBestSeller: true },
      { name: 'Harpic Power Plus Toilet Cleaner', brand: 'Harpic', category: 'Household & Cleaning', weight: '1 L Bottle', mrp: 220, price: 195, stock: 35, isPopular: false, isBestSeller: false },

      // Bakery & Bread
      { name: 'Modern Whole Wheat Bread Slice', brand: 'Modern', category: 'Bakery & Bread', weight: '400 g Loaf', mrp: 50, price: 45, stock: 30, isPopular: true, isBestSeller: true },
      { name: 'Britannia Fruit Cake Slices', brand: 'Britannia', category: 'Bakery & Bread', weight: '150 g Pack', mrp: 60, price: 52, stock: 40, isPopular: false, isBestSeller: false },

      // Personal Care
      { name: 'Dettol Original Bath Soap', brand: 'Dettol', category: 'Personal Care', weight: 'Buy 4 Get 1 Free (125g)', mrp: 260, price: 225, stock: 45, isPopular: true, isBestSeller: true },
      { name: 'Colgate Strong Teeth Toothpaste', brand: 'Colgate', category: 'Personal Care', weight: '500 g Saver Pack', mrp: 240, price: 205, stock: 50, isPopular: true, isBestSeller: false },
      { name: 'Head & Shoulders Anti-Dandruff Shampoo', brand: 'Head & Shoulders', category: 'Personal Care', weight: '340 ml Bottle', mrp: 385, price: 329, stock: 25, isPopular: false, isBestSeller: false },

      // Baby Care
      { name: 'Pampers All-round Protection Diapers (M)', brand: 'Pampers', category: 'Baby Care', weight: 'Pack of 42', mrp: 749, price: 649, stock: 20, isPopular: true, isBestSeller: true },
      { name: 'Himalaya Gentle Baby Wipes', brand: 'Himalaya', category: 'Baby Care', weight: '72 Wipes Pack', mrp: 190, price: 160, stock: 35, isPopular: false, isBestSeller: false },

      // Frozen Foods
      { name: 'Safal Frozen Green Peas', brand: 'Safal', category: 'Frozen Foods', weight: '1 kg Pack', mrp: 160, price: 135, stock: 25, isPopular: true, isBestSeller: false },
      { name: 'McCain French Fries Crispy', brand: 'McCain', category: 'Frozen Foods', weight: '425 g Pack', mrp: 145, price: 125, stock: 30, isPopular: false, isBestSeller: false }
    ];

    const productDocs = [];
    for (let i = 0; i < productSeeds.length; i++) {
      const p = productSeeds[i];
      const catId = getCatId(p.category);
      const slug = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`;
      const sku = `SKU-APK-${String(i + 1).padStart(3, '0')}`;

      // Assign first 40 to mainStore, remainder to secondStore
      const assignedStore = i < 40 ? mainStore._id : secondStore._id;

      const doc = await Product.create({
        store: assignedStore,
        category: catId,
        name: p.name,
        slug,
        description: `Premium quality ${p.name} from top brand ${p.brand}. Pure, fresh and hygienically packed for your kitchen essentials.`,
        brand: p.brand,
        weight: p.weight,
        mrp: p.mrp,
        sellingPrice: p.price,
        stock: p.stock,
        lowStockThreshold: 10,
        sku,
        isPopular: p.isPopular,
        isBestSeller: p.isBestSeller,
        specifications: [
          { key: 'Brand', value: p.brand },
          { key: 'Package Weight', value: p.weight },
          { key: 'Dietary Preference', value: 'Vegetarian' },
          { key: 'Country of Origin', value: 'India' }
        ],
        images: [
          { url: getProductPhoto(p.name, p.category), publicId: `prod_${i}_1`, isPrimary: true }
        ]
      });
      productDocs.push(doc);
    }
    console.log(`✓ Created ${productDocs.length} Products`);

    // 5. Create Addresses for primary customer
    const address1 = await Address.create({
      user: primaryCustomer._id,
      name: primaryCustomer.name,
      phone: primaryCustomer.phone,
      street: '#302, Green View Apartments, 4th Cross',
      area: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true
    });

    await Address.create({
      user: primaryCustomer._id,
      name: 'Demo Customer Work',
      phone: primaryCustomer.phone,
      street: 'Tower B, Tech Park, Outer Ring Road',
      area: 'Marathahalli',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      isDefault: false
    });
    console.log('✓ Created Addresses for primary customer');

    // 6. Create 30 Realistic Orders
    const orderStatuses = ['DELIVERED', 'DELIVERED', 'DELIVERED', 'OUT_FOR_DELIVERY', 'PACKING', 'CONFIRMED', 'PENDING'];
    const paymentMethods = ['COD', 'ONLINE', 'PAY_AT_STORE'];

    const createdOrders = [];
    for (let i = 1; i <= 30; i++) {
      const cust = customers[i % customers.length];
      const prod1 = productDocs[i % productDocs.length];
      const prod2 = productDocs[(i + 5) % productDocs.length];

      const item1Sub = prod1.sellingPrice * 2;
      const item2Sub = prod2.sellingPrice * 1;
      const subtotal = item1Sub + item2Sub;
      const deliveryFee = 30;
      const totalAmount = subtotal + deliveryFee;
      const status = orderStatuses[i % orderStatuses.length];

      const ord = await Order.create({
        orderNumber: `APK-2026-${10000 + i}`,
        customer: cust._id,
        store: mainStore._id,
        items: [
          {
            product: prod1._id,
            name: prod1.name,
            image: prod1.images[0].url,
            quantity: 2,
            price: prod1.sellingPrice,
            mrp: prod1.mrp,
            weight: prod1.weight,
            subtotal: item1Sub
          },
          {
            product: prod2._id,
            name: prod2.name,
            image: prod2.images[0].url,
            quantity: 1,
            price: prod2.sellingPrice,
            mrp: prod2.mrp,
            weight: prod2.weight,
            subtotal: item2Sub
          }
        ],
        deliveryAddress: {
          name: cust.name,
          phone: cust.phone,
          street: `#${10 + i}, 12th Main Road`,
          area: 'HAL 2nd Stage',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038'
        },
        deliveryMethod: i % 4 === 0 ? 'STORE_PICKUP' : 'HOME_DELIVERY',
        paymentMethod: paymentMethods[i % paymentMethods.length],
        paymentStatus: status === 'DELIVERED' || i % 2 === 0 ? 'PAID' : 'PENDING',
        orderStatus: status,
        subtotal,
        deliveryFee,
        totalAmount,
        createdAt: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
      });
      createdOrders.push(ord);
    }
    console.log(`✓ Created ${createdOrders.length} Orders`);

    // 7. Create 20 Customer Reviews for delivered products
    const deliveredOrders = createdOrders.filter((o) => o.orderStatus === 'DELIVERED');
    const reviewComments = [
      'Very fresh quality and super fast 15-minute delivery! Highly recommended.',
      'Authentic product with clear expiry date. Great local store online service.',
      'Packaging was neat and clean. Prices are much cheaper than local supermarkets.',
      'Fresh grain quality and top notch service by APK Grocery Store Indiranagar!',
      'Loved the instant doorstep service. Will order all my daily groceries from here.',
      'Good deal on MRP discount. Genuine product quality.'
    ];

    let reviewCount = 0;
    for (let i = 0; i < Math.min(20, deliveredOrders.length); i++) {
      const ord = deliveredOrders[i];
      const prodItem = ord.items[0];

      try {
        await Review.create({
          customer: ord.customer,
          product: prodItem.product,
          store: ord.store,
          order: ord._id,
          rating: (i % 2 === 0) ? 5 : 4,
          comment: reviewComments[i % reviewComments.length]
        });
        reviewCount++;
      } catch (err) {
        // Skip duplicate index constraints if any
      }
    }
    console.log(`✓ Created ${reviewCount} Reviews`);

    // 8. Add Wishlist items for primary customer
    await Wishlist.create({
      user: primaryCustomer._id,
      products: [productDocs[0]._id, productDocs[4]._id, productDocs[8]._id]
    });
    console.log('✓ Created Wishlist items');

    console.log('\n======================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('DEMO ACCOUNTS FOR LOGIN:');
    console.log('  👑 Admin:        kumar@gmail.com          / Kj1110;l');
    console.log('  👑 Admin Backup: admin@apkgrocery.demo    / Admin@123');
    console.log('  🏪 Store Owner:  owner@apkgrocery.demo    / Owner@123');
    console.log('  🛒 Customer:     customer@apkgrocery.demo / Customer@123');
    console.log('======================================================\n');

    if (require.main === module) {
      process.exit(0);
    }
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;

