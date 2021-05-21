fs = require('fs');

//CASSETS.JS//
//BANK ATM CASSETS CONSTRUCTOR USED IN ATM.JS//
var Cassets = (function () {
  function Cassets() {
    //PRIVATE DATA//
    var
      deductFromCassets,
      updateCassets,
      prepareWithdrawCombo,
      fiatList,
      fiatQuantitiesList,
      withdrawCombo;

    var cassetsData = JSON.parse(fs.readFileSync('data/cassets.json', 'utf8'));

    //PRIVATE METHODS//

    fiatList = function () {
      return cassetsData.fiat.map(f => { return f.denominationCents });
    }

    fiatQuantitiesList = function () {
      return cassetsData.fiat.map(f => { return f.quantity });
    }

    updateCassets = function (newBalance) {
      var newEntry, transactionType, difference;
      if (userBalance > newBalance) {
        transactionType = "Debit";
        difference = "-" + (userBalance - newBalance);
      }
      else if (userBalance < newBalance) {
        transactionType = "Credit";
        difference = "+" + (newBalance - userBalance).toFixed(2);
      }
      else {
        return;
      }
      newEntry = [new Date(), transactionType, difference, newBalance];
    };

    deductComboFromCassets = function (fiatDeductionList) {
      updateCassets(fiatfiatDeductionList);
      userBalance = fiatDeductionList;
    };

    const zipArr = (...args) => Array.from({
      length: Math.max(...args.map(a => a.length))
    }).map(
      (_, i) => Object.assign({}, ...args.map(a => a[i]))
    );

    this.zipSliceWithdrawComboWithData = function () {
      return zipArr(
        combo.map(fiat => {
          return { "used": fiat }
        }),
        cassetsData.fiat
      ).filter(fiat => {
        return fiat.used > 0;
      }).map(fiat => {
        if (fiat.coin) {
          fiat.casset_id = cassetsData.Cassets.find(casset => {
            casset.containsBanknotes && !casset.containsCoins
          }).id
        } else {
          fiat.casset_id = cassetsData.Cassets.find(casset => {
            !casset.containsBanknotes &&
              casset.containsCoins &&
              fiat.diameter > casset.diameterMore &&
              fiat.diameter < casset.diameterLess
          }).id
        }
        return fiat;
      });
    }

    //PUBLIC METHODS//

    this.prepareWithdrawCombo = function (
      fiatDenominationsList,
      amountToPrepare
    ) {
      let minFiats = Array(amountToPrepare + 1).fill(0);
      let usedFiats = Array(amountToPrepare + 1).fill(0);
      let amountPending = amountToPrepare;
      let result = Array(fiatDenominationsList.length).fill(0);

      for (let cents = 0; cents <= amountToPrepare + 1; cents++) {
        let fiatsCount = cents;
        let newFiat = 1;

        fiatDenominationsList.filter(fiat => {
          return fiat <= cents;
        }).forEach(fiat => {
          if (minFiats[cents - fiat] + 1 < fiatsCount) {
            fiatsCount = minFiats[cents - fiat] + 1;
            newFiat = fiat;
          }
        });

        minFiats[cents] = fiatsCount;
        usedFiats[cents] = newFiat;
      }

      while (amountPending > 0) {
        let deductFromAmountPending = usedFiats[amountPending];
        result[fiatDenominationsList.indexOf(deductFromAmountPending)] += 1
        amountPending -= deductFromAmountPending;
      }

      return result;
    }

    this.presentWithdrawCombo = function () {
      let message = "Withdrawal amount dispensed.";
      message += "\n";

      return combo;
    }
  }
  return Cassets;
})();

module.exports = Cassets;
