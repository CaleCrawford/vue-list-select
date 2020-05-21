import Vue from 'vue'

import 'regenerator-runtime/runtime'
// ===
// Configure Vue
// ===

// Don't warn about not using the production build of Vue, as
// we care more about the quality of errors than performance
// for tests.
Vue.config.productionTip = false

// ===
// Patch all components with a global mixin
// ===

Vue.mixin({
  created() {
    // HACK: Set a fallback for the `$style` until vue-jest
    // includes better support for CSS modules.
    this.$style = this.$style || {}
  },
})

// ===
// Console handlers
// ===

// Make console.error throw, so that Jest tests fail
const error = console.error
console.error = function (message) {
  error.apply(console, arguments)
  // NOTE: You can whitelist some `console.error` messages here
  //       by returning if the `message` value is acceptable.
  throw message instanceof Error ? message : new Error(message)
}

// Make console.warn throw, so that Jest tests fail
const warn = console.warn
console.warn = function (message) {
  warn.apply(console, arguments)
  // NOTE: You can whitelist some `console.warn` messages here
  //       by returning if the `message` value is acceptable.
  throw message instanceof Error ? message : new Error(message)
}
