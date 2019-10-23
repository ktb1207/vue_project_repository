<style lang="less">
    .float-wrp{
        height:240px;
        width:240px;
        float:left;
        margin-right:10px;
        margin-bottom:10px;
    }
</style>


<template>
    <div class="page-wrp">
       <div class="float-wrp">
           <loading-one color="red"></loading-one>
       </div>
       <div class="float-wrp">
           <loading-two color="#03a9f4"></loading-two>
       </div>
       <div class="float-wrp">
           <loading-three></loading-three>
       </div>
       <div class="float-wrp">4</div>
       <div class="float-wrp">5</div>
       <div class="float-wrp">6</div>
       <div class="float-wrp">7</div>
       <div class="float-wrp">8</div>
       <div class="float-wrp">9</div>
       <div class="float-wrp">10</div>
    </div>
</template>

<script>
    import loadingOne from '../components/loading/loading1.vue'
    import loadingTwo from '../components/loading/loading2.vue'
    import loadingThree from '../components/loading/loading3.vue'
    export default {
        name:'pageSeven',
        data(){
            return {
                
            }
        },
        computed:{},
        watch:{},
        components:{
           loadingOne,
           loadingTwo,
           loadingThree
        },
        methods:{
           
        },
        created(){},
        mounted(){
            
        },
        updated(){},
        beforeDestroy(){
            
        }
    }
</script>

