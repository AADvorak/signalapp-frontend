<template>

</template>

<script>
import TransformerBase from "./transformer-base";

export default {
  name: "DummyTransformer",
  extends: TransformerBase,
  methods: {
    transformFunction() {
      this.signal.description += `\nTransformed by dummy transformer`
      return this.signal
    },
  }
}
</script>

<style scoped>

</style>