<template>
  <div class="container">
      <div class="login oauth">
          <div class="wrap">
              <h1 class="oauth__title">Recovery of Password</h1>
              <form v-on:submit.prevent="submitRequest">
                  <div class="form">
                      <div class="form__group">
                          <label for="email" class="form__title">Email</label>
                          <div class="form__box">
                              <input type="text" id="email" class="form__input" v-bind:class="{ wrong: error_email.length > 0 }" v-model="email" maxlength="60">
                              <p class="form__wrong-text" v-if="error_email.length > 0">{{ error_email }}</p>
                          </div>
                      </div>

                      <div class=" clearfix">
                          <button type="submit" class="btn btn--login" :disabled="api_calling">Password reset request</button>
                      </div>
                  </div>
              </form>
          </div>
      </div>

      <div v-if="request_success">
          <div class="blackbg"></div>
          <div class="modal">
              <div class="text-center">
                  <div class="madal__iconbox"><img src="../images/icon/check.png" alt=""></div>
                  <h2 class="modal__title">Password reset request successful</h2>
                  <p class="modal__desc">
                      A link to reset your password has been sent to your registered email.
                  </p>
                  <div class="modal__btnbox">
                      <router-link class="btn btn--confirm btn--single" to="/login">Confirm</router-link>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script src="./forgotpass.js"></script>
