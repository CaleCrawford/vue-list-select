<script>
import Vue from 'vue'
import VueListSelect from '@/components/vue-list-select.vue'

import Characters from './assets/characters'

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VueListSelect,
  },
  data() {
    return {
      listOne: ['One', 'Two', 'Three'],
      listOfObjects: Characters,
      valueOne: [],
      valueTwo: [],
      valueThree: [],
    }
  },

  methods: {
    selectItemsOne(value) {
      console.log(value)
      this.valueOne = value
    },

    selectItemsTwo(value) {
      console.log(value)
      this.valueTwo = value
    },

    selectItemsThree(value) {
      console.log(value)
      this.valueThree = value
    },
  },
})
</script>

<template>
  <div id="app">
    <div>
      <h1>With an Array of Strings</h1>
      <VueListSelect
        :value="valueOne"
        :list="listOne"
        :class="$style.wrapper"
        @input="selectItemsOne"
      />
    </div>
    <br />
    <br />
    <br />
    <div>
      <h1>With an Array of Objects</h1>
      <VueListSelect
        :value="valueTwo"
        :list="listOfObjects"
        :class="$style.wrapper"
        label="name"
        @input="selectItemsTwo"
      />
    </div>

    <br />
    <br />
    <br />
    <div>
      <h1>With an Array of Objects That Returns an Array of Strings</h1>
      <VueListSelect
        :value="valueThree"
        :list="listOfObjects"
        :class="$style.wrapper"
        :reduce="character => character.name"
        label="name"
        @input="selectItemsThree"
      />
    </div>
  </div>
</template>

<style module>
.wrapper {
  height: 20rem;
  width: 40rem;
}
</style>
