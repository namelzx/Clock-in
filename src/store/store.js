import Vue from  "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store=new Vuex.Store({
    state:{
        author:'测试',
        isLogin:false,
        user_id:0,
        userInfo:{
            headimgurl:"https://img.zcool.cn/community/011cff5c7e3893a801213f26f4fed1.jpg@1280w_1l_2o_100sh.jpg",
            username:"J-R梁泽祥",
        },
        Config:{

        },
        banner:[],
        
    },
    mutations:{
        newAuthor(state,id){
            state.user_id=id
        },
        newAuthor(state,msg){
            state.author=msg
        },
        isLogin(state,msg){
            state.isLogin=msg
            sessionStorage.setItem("isLogin", msg);  //添加到sessionStorage  
        },
        newUser(state,user){
            state.userInfo=user
            sessionStorage.setItem("newUser", JSON.stringify(user));  //添加到sessionStorage  
        },
        newConfig(state,config){
            state.Config=config
            sessionStorage.setItem("Config", config);  //添加到sessionStorage  
        },
        newBnaner(state,banner){
            state.banner=banner
        }
    }
})

export default store