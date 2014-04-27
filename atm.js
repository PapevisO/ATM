var Account, prompt, ATM;
Account = require('./account.js');
prompt = require('prompt');

//ATM.JS//

ATM = (function() {
  function ATM() {
    //PRIVATE KEYS AND DATA//
    var bankID, session, sessionPin, loginSchema, defaultSchema;
    bankID = Math.floor(Math.random() * 1000000000000000).toString(10);
    //FORMATTING FOR PROMPTS//
    prompt.message = "";
    prompt.delimiter = " ";
    defaultSchema = {
      properties: {
        "default screen": {
          description: "Welcome to the ATM!\nChoose 1 for transaction or 2 to open a new account..",
          pattern: /[12]/,
          message: "please choose 1 for transaction or 2 for new account",
          required: true
        }
      }
    };
    loginSchema = {
      properties: {
        "account number": {
          pattern: /[0-9]+/,
          message: "account number must contain only numbers",
          required: true
        },
        pin: {
          pattern: /[0-9][0-9][0-9][0-9]/,
          message: "pin must be 4 digit number",
          required: true
        }
      }
    };
    // ATM PROPERTIES//
    this.atmStatus = "ON"
    this.accounts = [];

    //PRIVATE METHODS//
    defaultScreenCallback = function(err, choice) {
      //IF RESULT IS 1 START LOGIN PROCCESS IF 2 START NEW USER REGISTRATION//
      if (choice["default screen"] === "1") {
        prompt.get( loginSchema, this.startSession.bind(this) );
      }
      else{
        //START NEW USER REGISTRATION PROCCESS//

      }
    }
    //PUBLIC METHODS//

    //CREATES SECURE NEW BANK ACCOUNTS//
    this.newAccount = function(initDeposit, initPin) {
      var newAccount = new Account(initDeposit, initPin, bankID);
      this.accounts.push(newAccount);
      newAccount.accountNumber = this.accounts.length;
      return newAccount.accountNumber;
    };
    //STARTS AUTOMATION-WAITS FOR USER TO START SESSION//
    this.on = function() {
      session = null;
      sessionPin = null;
      prompt.get( defaultSchema, defaultScreenCallback.bind(this) );
      this.atmStatus = "LISTENING";
    };
    //STARTS BANKING SESSION BY VERIFYING USER//
    this.startSession = function(err, credentials) {
      var accountNumber = credentials["account number"];
      //MAKE SURE ACCOUNT IS ON FILE//
      if ( this.accounts[accountNumber - 1] instanceof Account) {
        var verified,
        pin = credentials["pin"];
        //RUN VALIDATION TO START SECURE SESSION//
        verified = this.accounts[accountNumber - 1].validate(pin, bankID);
        if (verified) {
          session = this.accounts[accountNumber - 1];
          sessionPin = pin;
          this.atmStatus = "IN SESSION";
          return "session started";
        }
        else {
          //CREDENTIALS FAILED WRONG ACCOUNT NUMBER OR PIN//
          console.error("bad credentials");
          return "invalid credentials";
        }
      }
      else {
        //ACCOUNT DOESN'T EXIST FOR THIS BANK//
        console.error("invalid account number");
        return "invalid account";
      }
    };

    this.checkBalance = function() {
      //USES SESSION VARIABLES FOR SECURITY PURPOSES//
      var balance = session.retrieveBalance(sessionPin, bankID);
      return balance;
    };

    this.withdrawFunds = function(amount) {
      var newBalance,
      balance = this.checkBalance();
      if (balance > amount) {
        newBalance = balance - amount;
        balance = session.editBalance(sessionPin, bankID, newBalance);
        return balance;
      }
      else {
        //NOT ENOUGH FUNDS FOR WITHDRAWAL//
        return "insufficient funds"
      }
    };
    this.depositFunds = function(amount) {
      var newBalance,
      balance = this.checkBalance();
      newBalance = balance + amount;
      balance = session.editBalance(sessionPin, bankID, newBalance);
      return balance;
    }

  }
  return ATM
})();

module.exports = ATM