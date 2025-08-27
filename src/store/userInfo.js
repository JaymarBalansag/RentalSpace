import { defineStore } from "pinia";
import { hydrate } from "vue";

export const useUserInfo = defineStore("info", {
   state: () => ({
    first_name: null,
    last_name: null,
    email: null,
    role: null,
    isLoggedIn: false,
   }),
   actions: {
    setUserInfo(first_name, last_name, role, email){
        this.first_name = first_name;
        this.last_name = last_name;
        this.role = role;
        this.email = email;

        localStorage.setItem('userInfo', JSON.stringify({
            first_name: first_name,
            last_name: last_name,
            role: role,
            email: email,
            isLoggedIn: true
        }));    
    },
    setRole (role){
        this.role = role;
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if(userInfo){
            userInfo.role = role;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
    },
    hydrateUserInfo(){
        const raw = localStorage.getItem('userInfo');
        if (!raw) return;   

        try {
            const data = JSON.parse(raw);
            if (data.isLoggedIn && data.email) {
            this.first_name = data.first_name;
            this.last_name = data.last_name;
            this.role = data.role;
            this.isLoggedIn = true;
            }
        } catch (e) {
            console.warn("Failed to hydrate userInfo:", e);
            localStorage.removeItem('userInfo'); // fallback cleanup
        }
    },
    setLoggedIn(isLoggedIn){
        this.isLoggedIn = isLoggedIn;
    },
    logout() {
        this.first_name = null;
        this.last_name = null;
        this.last_name = null;
        this.role = 'guest';
        this.isLoggedIn = false;
        localStorage.removeItem('userInfo'); // ✅ clear persisted state
        localStorage.removeItem('access_token'); // optional: clear token too
    }

   }
});