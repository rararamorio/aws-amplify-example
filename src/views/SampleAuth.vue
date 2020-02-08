<template>
  <amplify-authenticator v-bind:authConfig="authConfig"></amplify-authenticator>
</template>
<script>
export default {
  name: "sampleAuth",
  data() {
    return {
      authConfig: {
        signUpConfig: {
          hiddenDefaults: ["phone_number"]
        }
      }
    };
  }
};
</script>
