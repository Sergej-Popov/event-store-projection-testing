function fromCategory() {
  if (arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;

  this.subscriptions = {}
  this.state = {};
  this.when = function(subscriptions) {
    this.subscriptions = subscriptions;
    if (subscriptions && subscriptions['$init'])
      this.state = subscriptions['$init']();
  };

  this.apply = function(eventName, event) {
    if (!this.subscriptions) return;

    if (this.subscriptions[eventName])
      this.subscriptions[eventName](this.state, event);

    if (this.subscriptions['$any'])
      this.subscriptions['$any'](this.state, event);
  };

  this.reset = function() {
    this.state = (this.subscriptions && this.subscriptions['$init']) ? this.subscriptions['$init']() : {};
  }
}
new fromCategory();

module.exports = fromCategory;