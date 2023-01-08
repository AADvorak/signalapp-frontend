<template>
  <v-form @submit.prevent="emitSearch">
    <div class="d-flex">
      <v-text-field
          v-model="search"
          label="Search"
      ></v-text-field>
    </div>
  </v-form>
</template>

<script>
// todo review this component
export default {
  name: "search-field",
  props: {
    initSearchValue: String
  },
  data() {
    return {
      search: ''
    }
  },
  watch: {
    initSearchValue(newValue) {
      this.search = newValue
    }
  },
  emits: ['search'],
  methods: {
    emitSearch() {
      this.$emit('search', this.search)
    }
  }
}
</script>
