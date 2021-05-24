fs = require('fs');
var underscore = require('underscore-node');

//Cassettes.JS//
//BANK ATM Cassettes CONSTRUCTOR USED IN ATM.JS//
var Cassettes = (function () {
  function Cassettes() {
    //PRIVATE DATA//
    var
      fiatDenominationsList,
      fiatQuantitiesList,
      updateCassettes,
      preparedCombo;

    var cassettesDataPath = 'data/cassettes.json'
    var cassettesData = JSON.parse(fs.readFileSync(cassettesDataPath, 'utf8'));

    //PRIVATE METHODS//

    fiatDenominationsList = function () {
      return cassettesData.fiat.map(f => { return f.denominationCents });
    }

    fiatQuantitiesList = function () {
      return cassettesData.fiat.map(f => { return f.quantity });
    }

    updateCassettes = function (newFiatQuantitiesList) {
      cassettesData.fiat.map((fiat, index) => {
        return fiat.quantity = newFiatQuantitiesList[index];
      });
      fs.writeFileSync(cassettesDataPath, JSON.stringify(cassettesData, null, 4));
      return true;
    };

    const zipArr = (...args) => Array.from({
      length: Math.max(...args.map(a => a.length))
    }).map(
      (_, i) => Object.assign({}, ...args.map(a => a[i]))
    );

    const zipSliceWithdrawComboWithData = function () {
      return zipArr(
        preparedCombo.map(fiat => {
          return { "used": fiat }
        }),
        cassettesData.fiat
      ).filter(fiat => {
        return fiat.used > 0;
      }).map(fiat => {
        let cassette = cassettesData.cassettes.find(cassette => {
          if (fiat.coin) {
            return (
              cassette.containsCoins &&
              !cassette.containsBanknotes &&
              fiat.diameter > cassette.diameterMore &&
              fiat.diameter < cassette.diameterLess
            )
          } else {
            return (
              cassette.containsBanknotes &&
              !cassette.containsCoins
            )
          }
        });
        fiat.cassetteId = cassette.id
        return fiat;
      });
    }

    //PUBLIC METHODS//

    this.prepareWithdrawCombo = function (
      amountToPrepare
    ) {
      if (!Number.isInteger(amountToPrepare)) { return null; }

      amountToPrepare *= 100.0;
      let minFiats = Array(amountToPrepare + 1).fill(0);
      let usedFiats = Array(amountToPrepare + 1).fill(0);
      let amountPending = amountToPrepare;

      for (let cents = 0; cents <= amountToPrepare + 1; cents++) {
        let fiatsCount = cents;
        let newFiat = 1;

        fiatDenominationsList().filter(fiat => {
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

      preparedCombo = Array(fiatDenominationsList().length).fill(0);

      while (amountPending > 0) {
        let deductFromAmountPending = usedFiats[amountPending];
        preparedCombo[fiatDenominationsList().indexOf(deductFromAmountPending)] += 1
        amountPending -= deductFromAmountPending;
      }

      return preparedCombo;
    }

    this.presentFiatUsed = function (fiat) {
      let message = Number(
        fiat.denominationCents / 100.0
      ).toFixed(2);
      message += "\t";
      message += fiat.used;
      message += " pcs.\n";

      return message;
    }

    this.presentWithdrawCombo = function () {
      let comboFiatsCassettes = underscore.groupBy(zipSliceWithdrawComboWithData(), 'cassetteId');
      let message = "Withdrawal amount dispensed.";
      message += "\n----------------------------\n";

      for (var cassetteId in comboFiatsCassettes) {
        cassette = cassettesData.cassettes.find(c => { return c.id == cassetteId });
        message += cassette.description;
        message += "\n";
        comboFiatsCassettes[cassetteId].forEach(
          fiat => { message += this.presentFiatUsed(fiat); }
        );
        message += "\n---------------------\n";
      };

      return message;
    }

    this.deductComboFromCassettes = function () {
      return updateCassettes(
        fiatQuantitiesList().map((fiatQuantity, index) => {
          return fiatQuantity - preparedCombo[index];
        })
      );
    };
  }
  return Cassettes;
})();

module.exports = Cassettes;
