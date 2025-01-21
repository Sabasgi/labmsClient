
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { mapActions } from "pinia";
import { useAuthUserStore } from './../../../store/AuthStore/Auth';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const { layoutConfig } = useLayout();
const username = ref('');
const password = ref('');
const checked = ref(false);
// const route = useRoute()
const router = useRouter()

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.png`;
});
const loginClicked = ()=>{

    if (username.value!="" && password.value!=""){
        var user = {
            "username":username.value,
            "password":password.value
        }
        var authStore = useAuthUserStore ()
        authStore.Login(user)
        .then((data)=>{
            console.log("Dta ",data)
            router.push('/dashboard')
        })
        .catch((err)=>{
            console.log("err  ",err)
        })
    }else{
        toast.add({severity:'error',summary:'Invalid Credentials',detail:'Please Enter valid data',life:3000})
    }
    // console.log("login click")
}
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center py-1">
            <img :src="logoUrl" alt="Sakai logo" class="mb-3 w-6rem flex-shrink-0" />
            <!-- <span>SAKAI</span> -->
            <div class="py-1" style="border-radius: 56px;padding: 0.1rem; background: linear-gradient(180deg, var(--primary-color) 100%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-5 px-3 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/demo/images/login/dummy.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome, User !</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>
                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Username</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="loginClicked"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Toast />
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
