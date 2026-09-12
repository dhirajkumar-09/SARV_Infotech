const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');
const { sampleProducts, sampleUsers } = require('./data/sampleData');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Cleared previous database collections.');

    // Seed users
    for (const user of sampleUsers) {
      await User.create(user);
    }
    console.log(`[Seeder] Seeded ${sampleUsers.length} users (Admin & Demo Customer).`);

    // Seed products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`[Seeder] Seeded ${createdProducts.length} sample products.`);

    console.log('[Seeder] Data import completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Database destroyed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
