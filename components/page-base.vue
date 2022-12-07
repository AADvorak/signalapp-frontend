<template>

</template>

<script>
import ApiProvider from "../api/api-provider";
import ConfirmDialog from "./confirm-dialog";
import Message from "./message";

export default {
  name: "page-base",
  components: {ConfirmDialog, Message},
  data: () => ({
    message: {
      opened: false,
      text: '',
      onHide: () => {}
    },
    confirm: {
      opened: false,
      text: '',
      ok: () => {
      },
      cancel: () => {
      }
    }
  }),
  methods: {
    getApiProvider() {
      return ApiProvider.setRouter(useRouter()).setRoute(useRoute())
    },
    showMessage({text, onHide}) {
      this.message = {
        opened: true,
        text,
        onHide: () => {
          this.message.opened = false
          onHide && onHide()
        }
      }
    },
    askConfirm({text, ok, cancel}) {
      this.confirm = {
        opened: true,
        text,
        ok: () => {
          this.confirm.opened = false
          ok && ok()
        },
        cancel: () => {
          this.confirm.opened = false
          cancel && cancel()
        }
      }
    }
  },
}
</script>

<style scoped>

</style>