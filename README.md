## Automatic Teller Machine (ATM)

Written as a Node.js script with a simple command line user interface.

## Features

- Autonomic Bank User Interface
- Bank/ATM can create new accounts
- Account are verified by Pin and secret Bank ID
- All account data is hidden and secure
- ATM authenticates a user session for multiple transactions
- Users can..
  1. Print Balance
  2. Change Pin
  3. Make Deposit
  4. Make Withdrawl
  5. Print Account Ledger

**There are a number of physical constraints one the ATM:**

- [x] There are 3 payout boxes: 1 for notes, 1 for coins > 20mm and 1 for coins <= 20mm
- [x] 5 notes are available: 1000, 500, 200, 100, 50
- [x] 5 coins are available: 20 (40mm), 10 (20mm), 5 (50mm), 2 (30mm) and 1 (10mm)
- [x] There's a finite amount of notes and coins

**We have the following user stories:**

- [x] As a User I want to be able to enter an amount, so that I can specify how much money to withdraw
- [x] As a User I want to receive notes and coins that match the entered amount, so I can go spend the money
- [x] As a Bank I want the least number of notes and coins to be used for payout, so that I don’t have to refill often

##Launch Program

```
$ node app.js
```

If all goes as planned ATM should run continually in the terminal window until interruped(CTRL-C) or closed.

##Tests and Development

ATM is a work in progress, bug reports and pull requests are welcome!

###Tests

Our tests are written in [Mocha](http://http://visionmedia.github.io/mocha) with [Chai](http://chaijs.com) assertions and [Sinon](http://sinonjs.org) for stubbing and mocking

To Run Tests..

```bash
$ mocha
```
