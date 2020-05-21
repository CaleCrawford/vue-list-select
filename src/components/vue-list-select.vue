<template>
  <div role="region" :style="styleObject">
    <div :class="$style.container">
      <div :class="$style.unselected">
        <div :class="$style.listWrapper">
          <ul :class="$style.list">
            <li
              v-for="(item, index) of list"
              :key="index"
              :class="$style.itemWrapper"
              tabindex="0"
              @click="selectItem(item)"
              @keypress="selectItem(item)"
            >
              <Item
                v-if="showItem(item)"
                ref="item"
                :item="getOptionLabel(item)"
                :class="$style.item"
              />
            </li>
          </ul>
        </div>
      </div>
      <img
        src="./../assets/exchange-alt-solid.svg"
        :class="$style.icon"
        alt=""
      />
      <div :class="$style.selected">
        <div :class="$style.listWrapper">
          <ul :class="$style.list">
            <li
              v-for="(item, index) of selectedValue"
              :key="index"
              :class="$style.itemWrapper"
              tabindex="0"
              @click="deselectItem(item)"
              @keypress="deselectItem(item)"
            >
              <Item
                ref="item"
                :item="getOptionLabel(item)"
                :class="$style.item"
              />
            </li>
          </ul>
        </div>
      </div>
      <br />
    </div>
    <button
      :class="[$style.button, $style.primary, $style.selectAll]"
      @click="selectAll"
      >Select all</button
    >
    <button :class="[$style.button, $style.primary]" @click="deselectAll"
      >Deselect all</button
    >
  </div>
</template>

<script>
import Item from '@/components/item.vue'

const icon = require('@/assets/exchange-alt-solid.svg')
export default {
  name: 'VueListSelect', // vue component name

  components: {
    Item: Item,
  },

  props: {
    /**
     * The color used for the item hover and buttons.
     */
    color: {
      type: String,
      default: '#08c',
    },

    /**
     * Callback to generate the label text. If {option}
     * is an object, returns option[this.label] by default.
     *
     * Label text is used for filtering comparison and
     * displaying. If you only need to adjust the
     * display, you should use the `option` and
     * `selected-option` slots.
     *
     * @type {Function}
     * @param  {Object || String} option
     * @return {String}
     */
    getOptionLabel: {
      type: Function,
      default(option) {
        if (typeof option === 'object') {
          if (!Object.prototype.hasOwnProperty.call(option, this.label)) {
            return console.warn(
              `[vue-list-select warn]: Label key "option.${this.label}" does not` +
                ` exist in options object ${JSON.stringify(option)}.\n` +
                'https://vue-select.org/api/props.html#getoptionlabel',
            )
          }
          return option[this.label]
        }
        return option
      },
    },

    /**
     * Tells vue-select what key to use when generating option
     * labels when each `option` is an object.
     * @type {String}
     */
    label: {
      type: String,
      default: 'label',
    },

    /**
     * The list of available items. Includes all items
     * including those selected
     */
    list: {
      type: Array,
      default: () => {
        return []
      },
    },

    /**
     * The list of items that are initially selected when
     * the component is loaded
     */
    value: {
      type: Array,
      default: () => {
        return []
      },
    },

    /**
     * When working with objects, the reduce
     * prop allows you to transform a given
     * object to only the information you
     * want passed to a v-model binding
     * or @input event.
     */
    reduce: {
      type: Function,
      default: option => option,
    },
  },

  data() {
    return {
      internalValue: [], // Internal value managed by Vue List Select if no `value` prop is passed
    }
  },

  computed: {
    /**
     * Determine if the component needs to
     * track the state of values internally.
     * @return {boolean}
     */
    isTrackingValues() {
      return (
        typeof this.value === 'undefined' ||
        Object.prototype.hasOwnProperty.call(this.$options.propsData, 'reduce')
      )
    },

    /**
     * The options that are currently selected.
     * @return {Array}
     */
    selectedValue() {
      let value = this.value
      if (this.isTrackingValues) {
        // Vue select has to manage value internally
        value = this.$data.internalValue
      }
      if (value) {
        return [].concat(value)
      }
      return []
    },

    /**
     * Return an object that allows us to use CSSVars in our style section.
     * @return {Object}
     */
    styleObject() {
      return { '--primaryColor': this.color }
    },
  },

  watch: {
    /**
     * Make sure to update internal
     * value if prop changes outside
     */
    value(val) {
      if (this.isTrackingValues) {
        this.setInternalValueFromOptions(val)
      }
    },
  },

  created() {
    if (typeof this.value !== 'undefined' && this.isTrackingValues) {
      this.setInternalValueFromOptions(this.value)
    }
  },

  methods: {
    deselectAll() {
      this.updateSelectedItems([])
    },

    deselectItem(item) {
      this.value.splice(item, 1)
      this.$emit('input', this.value)
    },

    /**
     * Finds an option from the options
     * where a reduced value matches
     * the passed in value.
     *
     * @param value {Object}
     * @returns {*}
     */
    findOptionFromReducedValue(value) {
      const predicate = option =>
        JSON.stringify(this.reduce(option)) === JSON.stringify(value)
      const matches = [...this.list].filter(predicate)
      if (matches.length === 1) {
        return matches[0]
      }
    },

    iconSrc() {
      return icon
    },

    selectAll() {
      this.list.forEach(item => {
        if (this.showItem(item)) {
          this.value.push(item)
        }
      })
      this.$emit('input', this.value)
    },

    /**
     * Select a given item.
     * @param  {Object|String} item
     * @return {void}
     */
    selectItem(item) {
      item = this.selectedValue.concat(item)
      this.updateSelectedItems(item)
    },

    /**
     * Make sure tracked value is
     * one option if possible.
     * @param  {Object|String} value
     * @return {void}
     */
    setInternalValueFromOptions(value) {
      if (Array.isArray(value)) {
        this.$data.internalValue = value.map(val =>
          this.findOptionFromReducedValue(val),
        )
      } else {
        this.$data.internalValue = this.findOptionFromReducedValue(value)
      }
    },

    showItem(item) {
      return this.value.indexOf(item) < 0
    },

    /**
     * Accepts a selected item, updates local
     * state when required, and triggers the
     * input event.
     *
     * @emits input
     * @param item
     */
    updateSelectedItems(selectedOptions) {
      if (this.isTrackingValues) {
        // Vue select has to manage value
        this.$data.internalValue = selectedOptions
      }
      if (selectedOptions !== null) {
        if (Array.isArray(selectedOptions)) {
          selectedOptions = selectedOptions.map(val => this.reduce(val))
        } else {
          selectedOptions = this.reduce(selectedOptions)
        }
      }
      this.$emit('input', selectedOptions)
    },
  },
}
</script>

<style lang="scss" module>
.button {
  display: inline-block;
  margin: 0;
  padding: 0.65rem 0.9rem;
  border: 0;
  border-radius: 0.317rem;
  background-color: #aaa;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.5;
  font-family: 'Open Sans', sans-serif;
  cursor: pointer;
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;
}

.button:hover {
  opacity: 0.85;
}

.button:active {
  box-shadow: inset 0 3px 4px hsla(0, 0%, 0%, 0.2);
}

.button:focus {
  outline: thin dotted #444;
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin: 0 auto;
  height: 100%;
  font-family: 'Open Sans', sans-serif;
}

.icon {
  width: 2rem;
  margin: 0 1rem;
}

.item {
  padding: 0.5rem 0 0.5rem 0.5rem;
  border-bottom: 1px solid #aaa;
}

.itemWrapper {
  list-style-type: none;
  &:hover {
    background-color: var(--primaryColor);
    color: #fff;
  }
}

.list {
  padding-left: 0;
  margin: 0;
}

.primary {
  background-color: var(--primaryColor);
}

.selectAll {
  margin: 0.5rem 1rem 0 0;
}

.selected {
  align-self: flex-end;
  border: 1px solid #000;
  width: 100%;
  height: 100%;
}

.unselected {
  align-self: flex-start;
  border: 1px solid #000;
  width: 100%;
  height: 100%;
  margin-top: -2px;
  overflow-x: scroll;
}
</style>

<docs>
This button is amazing, use it responsibly.

## Examples

Orange button:

```jsx
<app-button color="orange">Push Me</app-button>
```

Ugly button with pink font and blue background:

```jsx
<app-button color="pink" background="blue">
  Ugly button
</app-button>
```

Button containing custom tags:

```jsx
<app-button>
  Text with <b>bold</b>
</app-button>
```
</docs>
