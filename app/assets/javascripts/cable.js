//= require action_cable
//= require_self
//= require_tree ./channels
/* eslint func-names: ["error", "never"] */

(function () {
  if (!this.App) { this.App = {} }
  App.cable = ActionCable.createConsumer()
}).call(this)
