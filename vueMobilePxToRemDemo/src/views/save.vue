<template>
    <div>save</div>
</template>

<script>
export default {
    name:'save',
    props:{
        
    },
    data(){
        return {
            
        }
    },
    computed:{

    },
    watch:{

    },
    components:{

    },
    methods:{
        hideLoading(){
            setTimeout(()=>{
                this.$store.dispatch('switchLoading', false)
            },1200)
        }
    },
    created(){

    },
    mounted(){
        this.hideLoading();
    },
    beforeDestroy(){

    }
}
</script>

<style>

</style>
