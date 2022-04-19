import {
    createStore
} from "vuex";
import {
    post
} from "../utils/request";
import {
    Apis
} from "../utils/apis";
export default createStore({
    state: localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : {
        userid: '',
        userinfo: null,
        UnReadNum: 0,
        code: '' //微信code    
    },
    mutations: {
        setCode(state, num) {
            state.code = num;
        },
        setUsrid(state, id) {
            state.userid = id;
        },
        setUserinfo(state, info) {
            state.userinfo = info;
        },
        setUnReadNum(state, num) {
            state.UnReadNum = num;
        },
        clearData(state) {
            state.userid = '';
            state.userinfo = null;
            state.UnReadNum = 0;
        },
        setState(state, data) {
            state = data;
        }
    },
    actions: {
        getUnReadNum({
            commit,
            state
        }) {
            if (state.userid) {
                post(Apis.countUserUnReadMessage, {
                    userId: state.userid
                }).then(res => {
                    console.log(res)
                    commit('setUnReadNum', res.data)
                })
            }
        }
    },
    modules: {},
});