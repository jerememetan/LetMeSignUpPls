<script>
export default {
    props: {
        text: {
            type: String,
            default: "Login"
        }
    },
    data() {
        return {
            disabled: false,
            buttonText: this.text
        }
    },
    methods: {
        disableButton() {
            this.disabled = true;
            this.buttonText = "Hahahahaha nice try buddy";
        }
    }
}
</script>

<template>
    <button class="btn btn-gradient w-100 btn-lg fw-bold" @click="disableButton()" :disabled="disabled">
        {{ buttonText }}
    </button>
</template>

<style>
.btn-gradient {
  background: linear-gradient(90deg, var(--theme-purple), var(--theme-purple-dark));
  border: none;
  color: white;
  transition: transform 0.2s;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px var(--theme-purple-rgba-50);
}

</style>