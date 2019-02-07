export default {
    data: function() {
        return {
          otp_number: "",
          err_message: ""
        }
    },
    props: { error_message: "" },
    watch: {
      error_message: function() {
        this.err_message = this.error_message
      },
      otp_number: function() {
        this.err_message = ""
      }
    },
    methods: {
        submit: function() {
            this.$emit("enterOtp", this.otp_number)
        },
        cancel: function() {
            this.$emit("hideOtp")
        },
    }
}
