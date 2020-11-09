Test utility for Event Store projections

## Usage
Add utility to projection
```javascript
var fromAll = fromAll || require('event-store-projection-testing').scope.fromAll;
var emit = emit || require('event-store-projection-testing').scope.emit;

fromAll()
  .when({...});
```
[sample projection](https://github.com/Sergej-Popov/event-store-projection-testing/blob/master/tests/projection.js)

Start testing
```javascript
require('chai').should();
var projection = require('event-store-projection-testing');
require('./projection');

describe('Projection tests', function () {
  beforeEach(function () {
    projection.initialize();
  });

  it('should increment balance on cashDeposited event when initial balance is set', function () {
    projection.setState({ balance: 10 });
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 });
    projection.getState().balance.should.equal(20);
  });

  it('should increment balance on cashDeposited event without initial balance', function () {
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 });
    projection.getState().balance.should.equal(10);
  });

  it('should not increment balance on unregistered event', function () {
    projection.processEvent('stream-123', 'NON_EXISTING_EVENT_TYPE', { deposit: 10 });
    projection.getState().balance.should.equal(0);
  });

  it('should increment counter for every event', function () {
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 });
    projection.processEvent('stream-123', 'NON_EXISTING_EVENT_TYPE', { deposit: 10 });
    projection.getState().counter.should.equal(2);
  });

  it('should remember last correlationId from metadata', function () {
    expect(projection.getState().lastCorrelationId).to.be.null;
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 }, { correlationId: 1 });
    projection.getState().lastCorrelationId.should.equal(1);
    projection.processEvent('stream-456', 'cashDeposited', { deposit: 20 }, { correlationId: 2 });
    projection.getState().lastCorrelationId.should.equal(2);
  });

  it('should re-emit all cashDeposited events', function () {
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 });
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 });
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 });
    projection.emittedEvents.should.have.length(3);
  });

  it('should transformBy', function () {
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 });
    projection.getState().balance.should.equal(10);
    projection.getTransform().transformed.should.true;
  });

});
```