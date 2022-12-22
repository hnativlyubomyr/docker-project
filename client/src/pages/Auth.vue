<template>
  <div class="auth-container">
    <div v-if="isRegister" class="auth-title">Create an account</div>
    <div v-else class="auth-title">Sign in to UsersPosts</div>

    <form class="auth-form" autocomplete="off">
      <div v-if="isRegister" class="form-group">
        <label for="user-name">Name:</label>
        <my-input
            v-model="authForm.name"
            id="user-name"
            placeholder="Name"
            @input="clearValidMessage('name')"
        ></my-input>
        <div v-if="!authFormValid.name.isValid" class="valid-message">{{ authFormValid.name.message }}</div>
      </div>

      <div class="form-group">
        <label for="user-login">Login:</label>
        <my-input
            v-model="authForm.login"
            id="user-login"
            placeholder="Login"
            @input="clearValidMessage('login')"
        ></my-input>
        <div v-if="!authFormValid.login.isValid" class="valid-message">{{ authFormValid.login.message }}</div>
      </div>

      <div class="form-group">
        <label for="user-password">Password:</label>
        <my-input
            v-model="authForm.password"
            id="user-password"
            type="password"
            placeholder="Password"
            @input="clearValidMessage('password')"
        ></my-input>
        <div v-if="!authFormValid.password.isValid" class="valid-message">{{ authFormValid.password.message }}</div>
      </div>

      <div v-if="isRegister" class="form-group">
        <label for="confirm-password">Confirm Password:</label>
        <my-input
            v-model="authForm.confirm"
            id="confirm-password"
            type="password"
            placeholder="Confirm Password"
            @input="clearValidMessage('confirm')"
        ></my-input>
        <div v-if="!authFormValid.confirm.isValid" class="valid-message">{{ authFormValid.confirm.message }}</div>
      </div>
      <div class="server-text-message valid-message">{{ errorMessage }}</div>
      <div class="auth-buttons">
        <my-button
            v-if="isRegister"
            color-button="blue"
            :disabled="isCreateBtnDisabled"
            @click.prevent="handleRegister"
        >
          Create account
        </my-button>

        <my-button
            v-else
            color-button="green"
            :disabled="isSignBtnDisabled"
            @click.prevent="handleSignIn"
        >
          Sign in
        </my-button>

        <router-link v-if="!isRegister" to="/register" class="user-link">Create an account</router-link>

        <router-link v-if="isRegister" to="/login" class="user-link">Sign In</router-link>
      </div>
    </form>
  </div>
</template>

<script>

import { authValues } from "@/validators/validators";
import {mapActions, mapGetters, mapMutations} from "vuex";
import { navigation } from "@/router/dictionary";

export default {
  props: {
    isRegister: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters('auth', ['isAuth', 'errorMessage']),

    isSignBtnDisabled() {
      const { login, password } = this.authForm;
      const { login: loginValid, password: passwordValid } = this.authFormValid;
      const signInObj = { login, password };
      const signInObjValid = { loginValid, passwordValid }
      const isSomeEmpty = Object.values(signInObj).some(item => !item.length);
      const isFormInvalid = Object.values(signInObjValid).some(item => !item.isValid);

      return this.errorMessage || isSomeEmpty || isFormInvalid;
    },

    isCreateBtnDisabled() {
      const isSomeEmpty = Object.values(this.authForm).some(item => !item.length);
      const isFormInvalid = Object.values(this.authFormValid).some(item => !item.isValid);

      return isSomeEmpty || isFormInvalid
    }

  },

  data() {
    return {
      authForm: {
        name: '',
        login: '',
        password: '',
        confirm: '',
      },

      authFormValid: {
        name: {
          isValid: true,
          message: `Name must contain from ${authValues.minNameLength} to ${authValues.maxNameLength} characters`,
          handler: () => this.minMaxValidation('name', authValues.minNameLength, authValues.maxNameLength),
        },
        login: {
          isValid: true,
          message: `Login must contain from ${authValues.minLoginLength} to ${authValues.maxLoginLength} characters`,
          handler: () => this.minMaxValidation('login', authValues.minLoginLength, authValues.maxLoginLength),
        },
        password: {
          isValid: true,
          message: `Password must contain from ${authValues.minPasswordLength} to ${authValues.maxPasswordLength} characters`,
          handler: () => this.minMaxValidation('password', authValues.minPasswordLength, authValues.maxPasswordLength),
        },
        confirm: {
          isValid: true,
          message: 'Confirm not equal password!',
          handler: () => this.confirmValidation(),
    },
      }
    }
  },

  methods: {
    ...mapActions('auth', ['createAccount', 'signIn']),
    ...mapMutations('auth', ['setErrorMessage']),

    clearValidMessage(prop) {
      this.authFormValid[prop].isValid = true;
      this.setErrorMessage('');
    },

    isSignInFormValid() {
      let isValid = true;

      if (!this.authFormValid.login.handler()) {
        this.authFormValid.login.isValid = false;

        isValid = false;
      }

      if (!this.authFormValid.password.handler()) {
        this.authFormValid.password.isValid = false;

        isValid = false;
      }

      return isValid;
    },

    isCreateAccountValid() {
      let isValid = true;

      if (!this.authFormValid.name.handler()) {
        this.authFormValid.name.isValid = false;

        isValid = false;
      }

      if (!this.isSignInFormValid()) {
        isValid = false;
      }

      if (!this.authFormValid.confirm.handler()) {
        this.authFormValid.confirm.isValid = false;

        isValid = false;
      }

      return isValid;
    },

    minMaxValidation(prop, min, max) {
      return this.authForm[prop].length >= min && this.authForm[prop].length <= max;
    },

    confirmValidation() {
      return this.authForm.password === this.authForm.confirm;
    },

    async handleSignIn() {
      if (!this.isSignInFormValid()) return;

      const { login: username, password } = this.authForm;

      await this.signIn({username, password });

      if (this.isAuth) {
        this.$router.push(navigation.posts.path);
      }
    },

    handleRegister() {
      if (!this.isCreateAccountValid()) return;

      const { name, login: username, password } = this.authForm;

      this.createAccount({ name, username, password }).then(() => {
        this.$router.push(navigation.login.path);
      });
    }
  },

  mounted() {
    this.setErrorMessage('');
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 400px;
  margin: auto;
}

.auth-form {
  width: 100%;
}

.auth-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-size: 20px;
}

.form-group input {
  margin-top: 10px;
}

.auth-title {
  padding: 50px 0;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 1px;
}

.user-link {
  font-size: 20px;
}

.valid-message {
  margin-top: 5px;
  font-size: 18px;
  color: red;
}

.server-text-message {
  margin-bottom: 20px;
}
</style>
