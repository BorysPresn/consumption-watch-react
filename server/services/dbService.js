const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.DATABASE_URI;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

async function connectToDatabase() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      return client.db("consumptionDB");
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
}

async function insertMileageRecord(record) {
  const db = await connectToDatabase();
  const mileageCollection = db.collection('mileage');
  try {
      const result = await mileageCollection.insertOne(record);
      return {
        success : true,
        message : "Record successfully inserted",
        data : { result }
      };
  } catch (error) {
      console.error("Error during inserting operation", error);
      throw error;
  }
}

async function getAllMileageRecords(userId) {
  try {
    const db = await connectToDatabase();
    const mileageCollection = await db.collection('mileage').find({ userId : userId }).sort({_id: -1}).toArray();
    if (!mileageCollection) {
      return { success : false, message : "User not found" };
    }
    return {success : true, message : "succes", data : mileageCollection}
  } catch (error) {
      console.error('Error while getting all records');
  }
}

// Last Full tanked record
async function getLastFullTankedRecord(id) {
  try {
    const db = await connectToDatabase();
    const mileageCollection = db.collection('mileage');
    return mileageCollection.findOne({userId : id, fullTank: true}, { sort: { _id: -1 } });
  } catch (error) {
    console.error('Error while getting last fulltanked record')
  }
}

//latest record
async function getLatestMileageRecord(id) {
  try {
    const db = await connectToDatabase();
    const mileageCollection = db.collection('mileage');
    return mileageCollection.findOne({userId : id}, { sort: { _id: -1 } });
  } catch (error) {
    console.error('Error while getting last record');
  }
}

//gettitng all {fullTank: false} records
async function getPartialTankRecords(id) {
  try {
    const db = await connectToDatabase();
    const mileageCollection = db.collection('mileage');
    return mileageCollection.find({ userId: id, fullTank: false, processed: false }).toArray();
  } catch (error) {
    console.error('Error while gettitng records');
  }
}

//updating all {fullTank:false} 
async function updateRecords(records) {
  try {
    const db = await connectToDatabase();
    const mileageCollection = db.collection('mileage');
    for(const record of records){
      await mileageCollection.updateOne(
        { _id: record._id },
        { 
          $set: {
            processed: record.processed, 
            processedAt: record.processedAt, 
            summaryId: record.summaryId 
          }
        }
      )
    };
  } catch (error) {
    throw new Error(`Error while updating records: ${error.message}`);
  }
}
//inserting a new user
async function insertNewUser(record) {
  const {email, password, initialMileage} = record;
  console.log('dbService', email, password, initialMileage)
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  try {
    // console.log('Hashing password:', record.password, 'with salt rounds:', saltRounds);
    const alreadyExists = await usersCollection.findOne({email: email});
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if(alreadyExists){
      return ({success : false, message : "This e-mail is already exists"});
    }
    const result = await usersCollection.insertOne({
      ...record,
      password : hashedPassword
    });
    const user = await usersCollection.findOne({email: email});
    console.log('user after inserting', user)
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
    return {
      success : true, 
      message : "User registered successfully", 
      userId : result.insertedId, 
      token : token,
      initialMileage : user.initialMileage 
    };
  } catch (error) {
      console.error(error.message);
      throw error;
  }
}

async function checkUser(userToFind) {
  try {
    const db = await connectToDatabase();
    const usersCollection = await db.collection('users');
    const { email, password } = userToFind;
    const user = await usersCollection.findOne({email : email});
    
    if(!user){
      return { 
        success : false, 
        type: 'email',
        message : 'Email is wrong' 
      };
    } 
    const checkPass = await bcrypt.compare(password, user.password);

    if(!checkPass) {
      return { 
        success : false,
        type: 'password', 
        message : 'Password is wrong' 
      };
    };
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });

    return { 
      success : true, 
      message : "Login successful", 
      userId : user._id, 
      token : token ,
      initialMileage: user.initialMileage 
    };
  } catch (error) {
    console.error('Error in checkUser:', error);
  }
 
}

async function getInitialMileage(id) {
    try{
        // console.log('this is an UserId : ', typeof id)
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id : new ObjectId(id) });
        if(!user){
        return  null;
        }
        return user.initialMileage;
    } catch (error) {
        console.error('Error in getInitialMileage:', error);
        throw new Error('Error getting initial mileage');
    }
}


module.exports = {
  client, 
  connectToDatabase, 
  insertMileageRecord, 
  getAllMileageRecords, 
  getLastFullTankedRecord,
  getLatestMileageRecord,
  getPartialTankRecords, 
  updateRecords, 
  getInitialMileage,
  insertNewUser,
  checkUser
};