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
            <li :class="{'contain-children':isContainChildren}">
                <span  v-if="contentObj.children.length>0" class="spread-icon" @click="spreadNode">
                    <i class="fa" :class="[showNode?'fa-minus-square':'fa-plus-square']"></i>
                </span>
                <span class="tree-name" :class="{'tree-name-select':contentObj.selected}" @click="selectNode(contentObj)">{{contentObj.name}}</span>
                
                <span class="select-span"><el-checkbox :label="contentObj.id">{{checkText}}</el-checkbox></span>

                <tree-content v-for="item in contentObj.children" :key="item.id+'c'" 
                    :content-obj="item" :show-children="showChildren" :show-line="showLine" 
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
        },
        showLine:{  //是否显示节点连接线
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            showNode:this.showChildren,
            checkText:''
        }
    },
    computed:{
        isContainChildren(){    //当前节点是否含有子节点
            if(this.showLine){
                return this.contentObj.children.length>0? true:false;
            }else{
                return false;
            }
            
        }
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

<style scoped>
    .tree-content{
        position:relative;
    }
    .tree-ul{
        box-sizing: border-box;
        list-style: none;
        position: relative;
    }
    .tree-ul>li{
        line-height: 24px;
        font-size:16px;
    }
    .tree-ul .tree-content{
        padding-left:24px;
    }
    .spread-icon{
        cursor: pointer;
    }
    .tree-name{
        cursor: pointer;
        padding:4px 32px 4px 0;
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
    .contain-children{
        position: relative;
    }
    ul.tree-ul>li.contain-children::before{
        content: '';
        width:1px;
        position:absolute;
        top:1.2em;
        left:0.44em;
        bottom:0.78em;
        border-style: none none none solid;
        border-color: #333333;
        border-width: 1px;
    }
    ul.tree-ul>li.contain-children .tree-ul::before{
        content:'';
        width:0.6em;
        height:1.2em;
        position:absolute;
        left:-1em;
        top:-0.5em;
        border-style: none none solid none;
        border-color: #333333;
        border-width:1px;
    }

    .select-span{
        float:right;
    }
    
</style>
