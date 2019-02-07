<template>
  <div class="container">
      <div class="login oauth">
          <div class="wrap">
              <h1 class="oauth__title">Change password</h1>
              <form v-on:submit.prevent="submitReset">
                  <div class="form">
                    <div class="form__group">
                        <label for="" class="form__title">New Password</label>
                        <div class="form__box">
                            <input type="password" class="form__input" v-bind:class="{ wrong: error_new.length > 0 }" v-model="new_pwd" maxlength="16"
                                   placeholder="Enter 8 to 16 characters with a mix of letters and numbers">
                            <p class="form__wrong-text" v-if="error_new.length > 0">{{ error_new }}</p>
                        </div>
                    </div>

                    <div class="form__group">
                        <label for="" class="form__title">Confirm Password</label>
                        <div class="form__box">
                            <input type="password" class="form__input" v-bind:class="{ wrong: error_confirm.length > 0 }" v-model="confirm_pwd" maxlength="16">
                            <p class="form__wrong-text" v-if="error_confirm.length > 0">{{ error_confirm }}</p>
                        </div>
                    </div>

                    <p class="form__wrong-message" v-if="error_common.length > 0">{{ error_common }}</p>
                    <div class="form__group">
                        <button type="submit" class="btn btn--confirm float-right" :disabled="api_calling">Confirm</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>

      <div v-if="reset_success">
          <div class="blackbg"></div>
          <div class="modal">
              <div class="text-center">
                  <div class="madal__iconbox"><img src="../images/icon/check.png" alt=""></div>
                  <h2 class="modal__title">Password change successful</h2>
                  <p class="modal__desc">
                      Your password has been changed.<br/>
                      Please login again.
                  </p>
                  <div class="modal__btnbox">
                      <router-link class="btn btn--confirm btn--single" to="/login">Confirm</router-link>
                  </div>
              </div>
          </div>
      </div>

      <OtpAuth v-if="showOtpAuth" v-on:enterOtp="enterOtp" v-on:hideOtp="hideOtp" :error_message="error_otp"></OtpAuth>
  </div>
</template>

<script src="./resetpass.js"></script>
