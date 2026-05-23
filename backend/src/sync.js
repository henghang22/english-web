const { sequelize } = require('./config/database');
const models = require('./models/index');

const syncDB = async () => {
  try {
    console.log('⏳ Starting Database Sync...');
    // force: true will drop tables and recreate them. 
    // Use alter: true to update tables without dropping data.
    await sequelize.sync({ alter: true });
    console.log('✅ Database & tables synced successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
};

syncDB();
