## Automatic Teller Machine (ATM)

This is the code part of a Automatic Teller Machine term project at DSC. Written in ruby.

**There are a number of physical constraints one the ATM:**
[x] There are 3 payout boxes: 1 for notes, 1 for coins > 20mm and 1 for coins <= 20mm
[x] 5 notes are available: 1000, 500, 200, 100, 50
[x] 5 coins are available: 20 (40mm), 10 (20mm), 5 (50mm), 2 (30mm) and 1 (10mm)
[x] There's a finite amount of notes and coins

**We have the following user stories:**
[ ] As a User I want to be able to enter an amount, so that I can specify how much money to withdraw
[ ] As a User I want to receive notes and coins that match the entered amount, so I can go spend the money
[ ] As a Bank I want the least number of notes and coins to be used for payout, so that I don’t have to refill often

### Getting Started

```
node app.js
```
