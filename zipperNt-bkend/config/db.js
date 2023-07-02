const mongoose = require('mongoose');



const connectDB = async () => {
  
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        try {
       

        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with a failure code
    }
};

module.exports = connectDB;
