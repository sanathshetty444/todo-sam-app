const mongoose = require("mongoose");

const mongoUri =
  "mongodb+srv://<id>:<password>@cluster0.lqrlo.mongodb.net/Todo?retryWrites=true&w=majority";

const connectToDB = async () => {
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  var db = mongoose.connection;
  db.on("connected", () => {
    console.log("Connected to mongo instance");
  });
  return db;
};
exports.getListHandler = async (event, context) => {
  try {
    const db = await connectToDB();
    let data = await db.collection("todo").find().toArray();
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: data,
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
exports.addToListHandler = async (event, context) => {
  try {
    const { title, priority } = JSON.parse(event.body);
    const db = await connectToDB();
    await db.collection("todo").insertOne({ title, priority });
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Added to the list",
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
exports.deleteItemHandler = async (event, context) => {
  try {
    const { _id, title } = JSON.parse(event.body);
    console.log(JSON.parse(event.body));
    const db = await connectToDB();
    await db.collection("todo").findOneAndDelete({ title: title });
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Deleted from the list",
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
