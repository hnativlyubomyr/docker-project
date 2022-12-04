import { createStore } from 'vuex'
import { postsModule } from "@/store/postsModule";
import { authModule } from "@/store/authModule";

export default createStore({
  modules: {
    posts: postsModule,
    auth: authModule,
  }
})
