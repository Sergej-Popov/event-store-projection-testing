
var fromAll = fromAll || require('../src/util').scope.fromAll;
var emit = emit || require('../src/util').scope.emit;

fromAll()
  .when({
    '$init': function () {
      return { balance: 0, counter: 0, lastCorrelationId: null }
    },
    '$any': function (state, event) {
      state.counter++;
      state.lastCorrelationId = event.metadata?.correlationId;
    },
    'cashDeposited': function (state, event) {
      state.balance += event.data.deposit;
      emit('stream-222', 'emittedEvent', { a: 1 });
    }
  }
  ).transformBy(function (state) {
    return {
      "transformed": true
    };
  });
