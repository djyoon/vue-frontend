<template>
  <div class="container">
      <div class="join oauth">
          <div class="wrap">
              <div class="container__title">
                  <h1>Login OTP Authenticator</h1>
                  <p>OTP authentication is enabled.<br/>
                    Enter OTP Code to Login OTP authentication.</p>
              </div>
              <div class="form">
                  <form v-on:submit.prevent="submitLogin">
                      <div class="form__group">
                          <label for="" class="form__title">OTP code</label>
                          <div class="form__box">
                              <input type="password" class="form__input" v-bind:class="{ wrong: error_otp.length > 0 }" placeholder="Enter the 6-digit verification code." v-model="otp_number" maxlength="6">
                              <p class="form__wrong-text" v-if="error_otp.length > 0">{{ error_otp }}</p>
                          </div>
                      </div>

                      <div class="form__group form__group--btnbox">
                          <button type="submit" class="btn btn--confirm" :disabled="api_calling">Confirm</button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  </div>
</template>

<script src="./login-otp.js"></script>
