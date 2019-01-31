<template>
  <div class="container">
      <div class="join oauth" v-if="!signup_success">
          <div class="wrap">
              <h1 class="oauth__title">Sign up</h1>
              <form v-on:submit.prevent="submitSignup">
                  <div class="form">
                      <div class="form__group">
                          <label for="email" class="form__title">Email</label>
                          <div class="form__box">
                              <input type="text" id="email" class="form__input" v-bind:class="{ wrong: error_email.length > 0 }" v-model="email" maxlength="60">
                              <p class="form__wrong-text" v-if="error_email.length > 0">{{ error_email }}</p>
                          </div>
                      </div>

                      <div class="form__group">
                          <label for="password" class="form__title" >Password</label>
                          <div class="form__box">
                              <input type="password" id="password" class="form__input" v-bind:class="{ wrong: error_password.length > 0 }" v-model="password" maxlength="16"
                                 placeholder="Enter 8 to 16 characters with a mix of letters and numbers">
                              <p class="form__wrong-text" v-if="error_password.length > 0">{{ error_password }}</p>
                          </div>
                      </div>

                      <div class="form__group">
                          <label for="confirm" class="form__title">Confirm Password</label>
                          <div class="form__box">
                              <input type="password" id="confirm" class="form__input" v-bind:class="{ wrong: error_confirm.length > 0 }" v-model="confirm" maxlength="16">
                              <p class="form__wrong-text" v-if="error_confirm.length > 0">{{ error_confirm }}</p>
                          </div>
                      </div>

                      <div class="form__group">
                          <label class="checkbox" for="agree">
                              <input type="checkbox" class="blind checkbox__input" id="agree" v-model="agree">
                              <span class="checkbox__icon"></span> I agree to the <a href="#//" class="textbutton textbutton--small">《Terms of Service》</a>
                          </label>
                          <p class="form__wrong-text-left" v-if="error_agree.length > 0">{{ error_agree }}</p>
                      </div>

                      <div class="form__group">
                          <p class="form__wrong-message" v-if="error_common.length > 0">{{ error_common }}</p>
                          <button type="submit" class="btn btn--sign" :disabled="api_calling">Sign Up</button>
                      </div>

                      <p class="form__text">
                          Already have an account? <router-link to="login" class="textbutton">Log in</router-link>
                      </p>
                  </div>
              </form>
          </div>
      </div>

      <div class="alert-checkmail" v-if="signup_success">
         <div class="alert-checkmail__box">
             <h1 class="alert-checkmail__title">Welcome to <strong>NEXBILL</strong></h1>
             <p class="alert-checkmail__desc">
                 To activate your NEXBILL account, we sent you a<br/>
                 verification email.<br/>
                 <br/>
                 Please check your email.
             </p>
             <div class="alert-checkmail__user-mail">
                 {{ email }}
             </div>
             <p class="form__text form__text--alert-checkmail">
                 Is your account already active? <router-link to="/login" class="textbutton">Log in</router-link>
             </p>
             <p class="form__text form__text--alert-checkmail">
                 Did not receive an email yet?  <router-link to="" class="textbutton textbutton--mobile-block">Re-request authentication email</router-link>
             </p>
         </div>
      </div>

  </div>
</template>

<script src="./signup.js"></script>
