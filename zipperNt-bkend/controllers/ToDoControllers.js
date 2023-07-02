const ToDoModel = require("../models/ToDoModels");

// Retrieve all ToDo items
module.exports.getToDo = async (req, res) => {
    try {
        const todo = await ToDoModel.find(); // Find all ToDo items in the database
        res.send(todo); // Send the retrieved ToDo items as the response
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// Save a new ToDo item
module.exports.saveToDo = (req, res) => {
    const { text } = req.body; // Extract the 'text' property from the request body

    ToDoModel
        .create({ text }) // Create a new document in the database with the extracted text
        .then((data) => { 
            console.log("Added Successfully...");
            console.log(data);
            res.send(data); // Send the created data as the response
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
};

// Delete a ToDo item
module.exports.deleteToDo = (req, res) => {
    const { _id } = req.body; // Extract the '_id' property from the request body

    console.log('id ---> ', _id); // Log the ID of the item to be deleted

    ToDoModel
        .findByIdAndDelete(_id) // Find the document with the given ID and delete it from the database
        .then(() => res.status(204).send('Deleted Successfully...')) // Set the response status and send a success message
        .catch((err) => console.log(err)); // Log any errors that occur
};

// Update a ToDo item
module.exports.updateToDo = (req, res) => {
    const { _id, text } = req.body; // Extract the '_id' and 'text' properties from the request body

    ToDoModel
        .findByIdAndUpdate(_id, { text }) // Find the document with the given ID and update its 'text' property
        .then(() => res.status(200).send('Updated Successfully...')) // Set the response status and send a success message
        .catch((err) => console.log(err)); // Log any errors that occur
};
