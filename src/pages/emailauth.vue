<template>
  <div class="container">
    <div class="alert-checkmail">
       <div class="alert-checkmail__box">
           <h1 class="alert-checkmail__title">Welcome to <strong>NEXBILL</strong></h1>
           <p class="alert-checkmail__desc">
              Processing email verification.<br/><br/>
           </p>
           <p class="alert-checkmail__desc" v-if="error_auth.length <= 0">
              Please wait.
           </p>
           <p class="alert-checkmail__error" v-if="error_auth.length > 0">
             <br/>
              {{ error_auth }}
             <br/>
           </p>
       </div>
    </div>
  </div>
</template>

<script src="./emailauth.js"></script>
