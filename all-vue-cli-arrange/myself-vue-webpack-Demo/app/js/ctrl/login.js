
require('../../css/basicStyle.css');
require('../../css/login.css');
import Vue from 'vue';

window.onload = function(){
    new Vue({
        el:"#myApp",
        data:{
            userName:'',
            userPassword:''
        },
        computed:{
            disClick:function(){
                if(this.userName!=''&&this.userPassword!=''){
                    return false;
                }else{
                    return true;
                }
            }
        },
        methods:{
            submit:function(e){
                sessionStorage.setItem('login',true);
                window.location.href='index.html';
            }
        }
    })
}



