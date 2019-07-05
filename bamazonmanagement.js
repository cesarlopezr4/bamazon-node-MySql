var inquirer = require('inquirer');
var mysql = require('mysql');
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",

  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What kind of view of information would you like see?",
      choices: [
        "Products ordered by level of sales?",
        "Products with low inventory value?",
        "Insert a new product in to the store?",
        "Add more items bye product?",
        "exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Products ordered by level of sales":
          sortBySales();
          break;

        case "Products with low inventory value":
          sortByLowInventory();
          break;


        // case "Add more items bye product":
        //   InsertMoreStockQ();
        //   break;


        // case "Insert a new product in to the store":
        //   insertNewProduct();
        //   break;

        case "exit":
          connection.end();
          break;
      }
    });
}

function mainMenu() {
  inquirer
  .prompt({
    name: "action",
    type: "list",
    message: "Menu options",
    choices: [
      "Main menu?",
      "exit"
    ]
  })
  .then(function (answer) {
    switch (answer.action) {
      case "Main menu":
        runSeach();
        break;

      case "exit":
        connection.end();
        break;
    }
})

function sortBySales() {
  
  
    connection.query("SELECT * FROM bamazon_products ORDER BY sales", function (err, res) {
      if (err) {throw err;
      console.log(res);}
   
 
  

  
  // connection.query("SELECT * FROM bamazon_products ORDER BY sales", function (err, res) {
  //       if (err) throw err;
        // console.log(res);
      // });
        // //***** in case you would like to display values without the console.table command you could use the following lines
        // for (var i = 0; i < res.length; i++) {
        //   console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
          // console.table("res[i].item_id", "res[i].product_name", "res[i].price" , "res[i].stock_quantity");
        
        console.table(res);
        // promptSales(res);

        mainMenu();
      });
      }
      
       
      
     

function sortByLowInventory() {
  // query the database for all products
  connection.query("SELECT * FROM bamazon where stock_quantity < 5", function (err, results) {
    if (err) throw err;
    // once you have the products, prompt the user for which they coudl update inventory
    console.table(res);
  });
    inquirer
      .prompt([
        {
          name: "selectId",
          type: " input",
          message: " please select the id # corresponding to the product you would like to increase the # of items in stock?",
          validate: function (value) {
            if (value > 0 && value <= res.length) {
              return true
            }
            else { return false; }
          }
        },
        {
          name: "quantityNum",
          type: "input",
          message: " please input the number of units (items) you would increment the current stock for the selected product?",
          validate: function (value) {
            if (isNaN(value) === true) {
              return false
            }
            else { return true; }
          }
        }
      ])
      .then(function (answer) {
        // get the information of the chosen item

        for (var i = 0; i < res.length; i++) {

          if (res[i].item_id === parseInt(answer.selectId)) {
            chosenItem = res[i];
          }
        }
        currentQty = chosenItem.stock_quantity;
        console.log(currentQty);

        chosenItem.stock_quantity = currentQty + parseInt(answer.quantityNum);

        console.log(chosenItem.stock_quantity);

        connection.query("UPDATE bamazon_products SET ? WHERE ?",
          [
            {
              stock_quantity: chosenItem.stock_quantity
            },
            {
              item_id: chosenItem.item_id
            }
          ], (err, result) => {
            if (err) throw err;
          }
                  
        );
              // connection.end(); 

          console.log("Congratulations, you incremented # of the units in stock in : " + parseInt(answer.quantityNum) + " the current stock inventory is: " + chosenItem.stock_quantity);

          mainMenu();

         
         
          });         
  } 
}     




