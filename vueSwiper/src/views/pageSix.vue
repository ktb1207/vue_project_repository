<style lang="less">

</style>


<template>
    <div class="page-wrp">
       <div class="btn-group">
           <el-radio-group v-model="btnNum">
                <el-radio :label="0">展开所有</el-radio>
                <el-radio :label="1">展开1级</el-radio>
                <el-radio :label="2">展开2级</el-radio>
                <el-radio :label="3">展开3级</el-radio>
                <el-radio :label="4">展开4级</el-radio>
                <el-radio :label="5">展开5级</el-radio>
            </el-radio-group>
       </div>
       <div class="tree-contain">
           <tree-table :columns="columnData" 
                :tree-data="rowsData" 
                :exist-data="isExistTreeData"
                :row-click="true"
                parent-id-name="pid"
                :spread-num="btnNum"
                @clickRow="treeRowClick"></tree-table>
       </div>
    </div>
</template>

<script>
    import TreeTable from '../components/treeTable/TreeWrp.vue';
    export default {
        name:'pageSix',
        data(){
            return {
                isExistTreeData:true,//是否有tree数据
                columnData:[
                    {
                        type:"selection",
                        title:"选择",
                        width:"60px",
                        align:"center",
                        grow:0
                    },{
                        type:"node",
                        title:"树结构Demo",
                        key:"name",
                        width:"auto",
                        align:"left",
                        grow:1
                    },{
                        type:"text",
                        title:"任务数",
                        key:"orderNum",
                        width:"160px",
                        align:"center",
                        grow:0
                    },{
                        type:"text",
                        title:"编码",
                        key:"code",
                        width:"160px",
                        align:"center",
                        grow:0
                    },{
                        type:"text",
                        title:"类型",
                        key:"type",
                        width:"280px",
                        align:"left",
                        grow:0
                    }
                ],
                rowsData:[
                    
                ],
                btnNum:2,
            }
        },
        computed:{},
        watch:{},
        components:{
            TreeTable
        },
        methods:{
            //获取数据
            getTreeData(){
                this.rowsData=[];
                this.$get('/static/treeData.json').then(res=>{
                    console.log(res)
                    if(res.data.code==0){
                        this.rowsData=res.data.data;
                        //console.log(this.parseList(res.data.data));
                    }
                })
            },
            //tree行点击
            treeRowClick(obj,key,value){
                //console.log(obj);
                //console.log(key)
                //console.log(value)
            },
            
            buildTree(list){
                let temp = {};
                let tree = [];
                for(let i in list){
                    temp[list[i].id] = list[i];
                }
                for(let i in temp){
                    if(temp[i].pid) {
                        if(!temp[temp[i].pid].children) {
                            temp[temp[i].pid].children =[];
                        }
                        temp[temp[i].pid].children.push(temp[i]);
                    } else {
                        tree.push(temp[i]);
                    }
                }
                return tree;
            },
            parseList(list){
                //创建一个对象命名为map
                var map={};
                //通过遍历把list中的元素放到map对象中
                list.forEach(function(item){
                    if(!map[item.id]){
                        //核心步骤1：map中的'item.id'属性指向list数组中的对象元素
                        map[item.id]=item;
                    }
                });
                //再次遍历为了对map属性所指的对象进行处理
                list.forEach(function(item){
                    //过滤父级id不是null的元素
                    if(item.pid!=null){
                        //map[item.pid]为该元素的父级元素
                        map[item.pid].children ? map[item.pid].children.push(item):map[item.pid].children=[item];
                    }
                });
                //过滤后仅剩下根节点
                return list.filter(function(item){
                    if(item.pid===null){
                        return item;
                    } 
                });
            }
        },
        created(){},
        mounted(){
            this.getTreeData();
        },
        updated(){},
        beforeDestroy(){
            
        }
    }
</script>

