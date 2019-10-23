<template>
    <div>find</div>
</template>

<script>
export default {
    name:'find',
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
            },800)
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
