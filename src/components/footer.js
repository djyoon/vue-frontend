export default {
  data: function() {
    return {
      showSupport: false,
      showTerms: false,
      showContact: false,
      isMobile: false
    }
  },
  mounted: function() {
      this.handleResize()
      window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function() {
      window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    visibleSupport() { return !this.isMobile || this.showSupport },
    visibleTerms() { return !this.isMobile || this.showTerms },
    visibleContact() { return !this.isMobile || this.showContact }
  },
  methods: {
    handleResize: function() {
        this.isMobile = window.innerWidth < 768
    },
    toggleSupport: function() {
      this.showSupport = !this.showSupport;
    },
    toggleTerms: function() {
      this.showTerms = !this.showTerms;
    },
    toggleContact: function() {
      this.showContact = !this.showContact;
    }
  }
}
