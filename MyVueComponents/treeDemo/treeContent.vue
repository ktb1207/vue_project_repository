<!--
#Attributes：
    content-obj:每一个节点项，object
    show-children:展开收起，boolean
# Events
   nodeClick：节点项点击 
-->

<template>
    <div class="tree-content">
       <ul class="tree-ul">
            <li>
                <span  v-if="contentObj.children.length>0" class="spread-icon" @click="spreadNode">
                    <i class="fa" :class="[showNode?'fa-minus-square':'fa-plus-square']"></i>
                </span>
                <span class="tree-name" :class="{'tree-name-select':contentObj.selected}"@click="selectNode(contentObj)">{{contentObj.name}}</span>
                <tree-content v-for="item in contentObj.children" :key="item.id+'c'" 
                    :content-obj="item" :show-children="showChildren" 
                    v-show="showNode" @nodeClick="clickNode"></tree-content>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name:'treeContent',
    props:{
        contentObj:{
            type:Object,
            default(){
                return {};
            }
        },
        showChildren:{  //展开or收起子节点，默认收起
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            showNode:this.showChildren,
        }
    },
    computed:{
        
    },
    components:{

    },
    watch:{
        showChildren(newVal,oldVal){
            this.showNode=newVal;
        }
    },
    methods:{
        //展开or收起单个节点
        spreadNode(){
            this.showNode=!this.showNode;
        },
        //选择单个节点
        selectNode(obj){    //点击选择单个节点，反馈父节点
            this.$emit('nodeClick',obj)
        },
        clickNode(obj){
            this.$emit('nodeClick',obj)
        }
    },
    created(){

    },
    mounted(){

    },
    updated(){
        this.$nextTick(()=>{
            
        })
    }
}
</script>

<style>
    .tree-ul{
        box-sizing: border-box;
        list-style: none;
    }
    .tree-ul>li{
        line-height: 24px;
        font-size:16px;
    }
    .tree-ul .tree-content{
        padding-left:18px;
    }
    .spread-icon{
        cursor: pointer;
    }
    .tree-name{
        cursor: pointer;
        padding:4px 32px 4px 6px;
        border-radius: 2px;
    }
    .tree-name:hover{
        background-color: aqua;
        color:brown;
    }
    .tree-name-select{
        background-color: aqua;
        color:brown;
    }
</style>
