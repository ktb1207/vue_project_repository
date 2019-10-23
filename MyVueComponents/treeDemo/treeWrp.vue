<!--
# Attributes：
    @params:list-arr,平行数据
    @params:spread-all,是否展开所有节点项
# Events
    @params:clickResult,获得当前选中节点项
-->

<style scoped>
    .tree-wrp{
        width:auto;
        height:auto;
    }
</style>

<template>
    <div class="tree-wrp">
        <tree-content v-for="item in formaterTreeData" :key="item.id+'c'" :content-obj="item" :show-children="spreadAll" @nodeClick="clickNode"></tree-content>
    </div>
</template>

<script>
    import treeContent from './treeContent.vue';
    export default {
        name:'treeDemo',
        props:{
            listArr:{  //平行数据
                type:Array,
                required:false,
                default:[]
            },
            spreadAll:{ //展开or收起所有节点
                type:Boolean,
                default:false
            }
        },
        data(){
            return {
                spreadType:this.spreadAll,
                saveTreeData:this.listArr,
            }
        },
        computed:{
            formaterTreeData(){
                return this.data2tree(this.saveTreeData);
            }
        },
        components:{
            treeContent
        },
        watch:{
           listArr(newVal,oldVal){
               this.saveTreeData=newVal;
           } 
        },
        methods:{
            //对原始数据新增selected
            addSelect(){
                this.saveTreeData.map((item,index)=>{
                    item.selected=false;
                });
            },
            //先把父亲节点取出来，放进一个数组
            data2tree(datas) {
                var dataArray = [];
                datas.forEach((item,index)=>{
                    if(item.parentId==null||item.parentId==''){
                        dataArray.push(item);
                    }
                });
                //检测原始数据是否含有选择项
                let isExzitSelected=datas.some((item,index)=>{
                    return item.selected==true;
                })
                //修改selected，默认选择根节点第一项
                if(!isExzitSelected){
                    dataArray.map((item,index)=>{ 
                        if(index==0){
                            item.selected=true;
                            this.$emit('clickResult',item);
                        }
                    });
                }
                return this.data2treeDG(datas, dataArray);
            },
            //递归所有数据，创建tree结构
            data2treeDG(datas, dataArray) {
                /*
                *@param {Object} datas  所有数据
                *@param {Object} dataArray 父节点组成的数组
                */
                for(var j = 0; j < dataArray.length; j++) {
                    var dataArrayIndex = dataArray[j];
                    var childrenArray = [];
                    var parentCode = dataArrayIndex.id;

                    for(var i = 0; i < datas.length; i++) {
                        var data = datas[i];
                        var toCode = data.parentId;
                        if(toCode == parentCode) {  //判断是否为儿子节点
                            childrenArray.push(datas[i]);
                        }

                    }
                    dataArrayIndex.children = childrenArray;
                    if(childrenArray.length > 0) {  //有儿子节点则递归
                        this.data2treeDG(datas, childrenArray);
                    }

                }
                return dataArray;
            },
            //获取当前点击选中节点，反馈父节点
            clickNode(obj){ 
                this.$emit('clickResult',obj);
                //根据点击修改选中项
                this.saveTreeData.forEach((item,index)=>{
                    if(obj.id==item.id){
                        this.$set(this.saveTreeData,index,{name:item.name,id:item.id,parentId:item.parentId,selected:true});
                    }else{
                        this.$set(this.saveTreeData,index,{name:item.name,id:item.id,parentId:item.parentId,selected:false});
                    }
                })
                
            }
        },
        created(){

        },
        mounted(){
            this.$nextTick(()=>{
                this.addSelect();
                console.log('mounted');
            })
        },
        updated(){
            this.$nextTick(()=>{
                console.log('updated');
            })
        }
    }
</script>


