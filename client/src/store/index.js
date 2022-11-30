import { createStore } from 'vuex'
import { postsModule } from "@/store/postsModule";

export default createStore({
  modules: {
    posts: postsModule,
  }
})
