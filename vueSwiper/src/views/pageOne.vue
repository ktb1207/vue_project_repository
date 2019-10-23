<style scoped>
   .scroll-wrp{
        width:720px;
        height:540px;
   }
   .scroll-btm{
       width:720px;
       height:280px;
       margin-top:12px;
   }
    
</style>

<template>
   <div class="page-wrp">
       <button @click="testArr">click</button>
       <div class="scroll-wrp">
           <swiper-demo domId="swiperOne"></swiper-demo>
       </div>
       <div class="scroll-btm">
           <swiper-progress domId="swiperTwo"></swiper-progress>
       </div>
    </div>
    
</template>

<script>
    import swiperDemo from '../components/swiperDemo.vue';
    import swiperProgress from '../components/swiperProgress.vue';
    import {firstName,day,multiply,add} from '../methodJs/module1.js';
    import defaultFunction from '../methodJs/module2.js';
    export default {
        name:'itemSummary',
        data(){
            return {
                treeArr:[
                    {
                        pid:null,
                        id:1
                    },{
                        pid:1,
                        id:11
                    },{
                        pid:1,
                        id:21
                    },{
                        pid:11,
                        id:111
                    },{
                        pid:21,
                        id:211
                    },{
                        pid:null,
                        id:2
                    }
                ]
            }
        },
        computed:{

        },
        components:{
            swiperDemo,
            swiperProgress
        },
        methods:{
            recursionDeleteChildren (delIdArr,totalArr){
                let backArr = [];
                let delArr = [];
                delArr = [...delIdArr];
                downFined(delIdArr,totalArr)
                function downFined(dArr,tArr){
                    dArr.forEach(item=>{
                        let wArr = [];
                        tArr.forEach(value=>{
                            if(value.pid==item){
                                wArr.push(value.id)
                            }
                        })
                        delArr = [...delArr, ...wArr];
                        if(wArr.length>0){
                            return downFined(wArr,tArr)
                        }
                    })
                }
                delArr = Array.from(new Set(delArr)) // 去重
                delArr.forEach(item=>{
                    totalArr.forEach((value,index)=>{
                        if(value.id==item){
                            totalArr.splice(index,1);
                        }
                    })
                })
                backArr = totalArr;
                return backArr;
            },
            testArr(){
                let delarr = [11,211,1]
                let back = this.recursionDeleteChildren(delarr,this.treeArr)
                console.log(back)
            }
        },
        created(){

        },
        mounted(){
            // console.log(firstName);
            // console.log(day);
            // console.log(multiply(2,3));
            // console.log(add(5,2));
            // console.log(defaultFunction(10,12));

        }
    }
</script>

