// this app allow to browse the file of products used in this example, also allow to simulate a sale selecting an
// item in particular and also allow to indicate the number of items of this item you would like to buy
// it take control of the units in stock in case someone wants to but a large quantity, and also discount for inventory (stock) the items
// that was sold
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
var idSellected = 0;
var tableselected = 0;
var currentQty = 0;

var numberUnits = 0;
var saleAmount = 0;
var chosenItem = "";

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  queryAllProducts();
});

function queryAllProducts() {
  
  connection.query("SELECT * FROM bamazon_products", function (err, res) {
    if (err) throw err;
     else { 

    // ***** in case you would like to display values without the console.table command you could use the following lines
    // for (var i = 0; i < res.length; i++) {
    //   console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    //   // console.table("res[i].item_id", "res[i].product_name", "res[i].price" , "res[i].stock_quantity");
    // }
    console.table(res);
    prompts(res);
     }
  });
}
 
  function prompts(res) {
  inquirer
    .prompt([
      {
        name: "selectId",
        type: " input",
        message: " please select the id # corresponding to the product you would like to buy",
        validate: function (value) {
          if (value > 0 && value <= res.length) {
            return true
          }
          else { return false }
        }
      },

      {
        name: "quantityNum",
        type: "input",
        message: " please input the number of units (products) you would like to buy",
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

      // idSelected = selectId;
      // tableselected = idSelected;
      currentQty = chosenItem.stock_quantity;

      numberUnits = parseInt(answer.quantityNum);
      saleAmount = numberUnits * chosenItem.price;

      if (answer.quantityNum > currentQty) {
        console.log(" Excuse us but your request exceeds our current stock which is: " + currentQty);
        connection.end();
      }
      else
      {
        chosenItem.stock_quantity = chosenItem.stock_quantity - numberUnits;
        console.log(chosenItem.stock_quantity);

                         
         connection.query( "UPDATE bamazon_products SET ? WHERE ?",
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
          connection.end(); 
          
          console.log("Congratulations,  the total amount for: " + numberUnits + " items is: " + saleAmount);
              
      }
    })
  }
