const express = require("express");
const app = express(); 
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//routes

// enter an item

app.post("/keeps",async (req,res) => {
    try {
        const { description } = req.body;
        // console.log(text);

        const newTodo = await pool.query("INSERT INTO list (description) VALUES($1) RETURNING *", [description]);
        res.json(newTodo.rows[0]);
        //console.log(newTodo.rows[0]);

       
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

//list all items from keep list
app.get("/keeps",async (req,res) => {
    try {
        //const { description } = req.body;
        // console.log(description);
        const allList = await pool.query("SELECT * from  list");
        res.json(allList.rows);
        //console.log(allList);
    } catch (err) {
        console.error(err.message);
        // res.status(500).json({ error: "Server error" });
    }
});

//get an item 
app.get("/keeps/:id",async (req,res) => {
    try {
        const {id} = req.params;

        const item = await pool.query("SELECT * from  list where id = ($1)",[id]);
        res.json(item.rows);/**/
    } catch (err) {
        console.error(err.message);
       
    }
});

//update the keep list
app.put("/keeps/:id",async (req,res) => {
    try {
        const {id} = req.params;
        const {description} = req.body; 
        if (!description || typeof description !== 'string') {
            return res.status(400).json({ error: "Invalid description" });
        }

        if (!Number.isInteger(parseInt(id, 10))) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const updateItem = await pool.query("update list set description = $1 where id = $2 RETURNING *",[description,id]);
        
        res.json(updateItem.rows);/**/
    } catch (err) {
        console.error(err.message);
       
    }
});


//delete an item from the list
app.delete("/keeps/:id",async (req,res) => {
    try {
        const {id} = req.params;
        
        const deleteItem = await pool.query("delete from list where id = $1 RETURNING *",[id]);
        res.json(deleteItem.rows);/**/
    } catch (err) {
        console.error(err.message);
       
    }
});

app.listen(5000, () => {
    console.log("server has started on port 5000");
});
