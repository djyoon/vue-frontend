export default {
    data: function() {
        return {
          otp_number: ""
        }
    },
    props: {
      error_message: { }
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
