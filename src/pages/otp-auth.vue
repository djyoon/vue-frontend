<template>
    <div>
      <div class="blackbg"></div>
      <div class="modal">

          <div class="text-center">
              <h2 class="modal__title">OTP Authentication</h2>

              <form action="">
                  <div class="form modal__form">
                      <div class="form__group">
                          <label for="" class="form__title">Verification Code</label>
                          <div class="form__box">
                              <input type="text" class="form__input" placeholder="Enter the 6-digit verification code." v-model="otp_number" v-bind:class="{ wrong: error_message.length > 0 }" maxlength="6">
                              <p class="form__wrong-text">{{ error_message }}</p>
                          </div>
                      </div>
                  </div>
              </form>

              <div class="modal__btnbox">
                <button type="button" class="btn btn--cancel float-left btn--half" @click="cancel">Cancel</button>
                <button type="button" class="btn btn--confirm float-right btn--half" @click="submit">Confirm</button>
              </div>
              <div class="text-right"><a href="" class="textbutton">Can not you do Google Authentication?</a></div>
          </div>

      </div>
    </div>
</template>
<script src="./otp-auth.js"></script>
