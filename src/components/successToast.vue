<template>
    <div
        class="toast align-items-center text-bg-success border-0 position-fixed top-0 end-0 m-3"
        role="alert"
        ref="successToast"
    >
        <div class="d-flex">
        <div class="toast-body">
            {{message}} {{ name  }}
        </div>
        <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
        ></button>
        </div>
    </div>

</template>

<script>
import { useUserInfo } from '@/store/userInfo';


export default {
    name: 'successToast',
    props: {
        message: {
            type: String, required: true,
        },
    },
    computed: {
        name() {
            const info = useUserInfo();
            if(info.first_name && info.last_name){
                return info.first_name + " " + info.last_name
            }
            return ""
        }
    },
    methods: {
        showToast() {
            const toastEl = this.$refs.successToast

            toastEl.classList.add("show");

            setTimeout(() => {
                toastEl.classList.remove("show");
            }, 3000);
        }
    },
    mounted() {
        
        this.showToast()

    }
}

</script>