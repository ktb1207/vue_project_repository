<style lang="less">
    
</style>


<template>
    <div class="page-wrp">
       <el-table :data="rowsData" style="width: 100%">
            <el-table-column v-for="(item,index) in columnsData" :key="index"
                :prop="item.key"
                :label="item.name"
                width="180">
            </el-table-column>
        </el-table>
        <div class="btn-group">
            <el-button type="primary" @click="testOne('success')">promiseOne</el-button>
            <el-button type="danger" @click="testOne('error')">promiseOne</el-button>
            <el-button type="primary" @click="testAll('a','a')">promiseAll</el-button>
            <el-button type="danger" @click="testAll('a','b')">promiseAll</el-button>
        </div>
        <input-checking></input-checking>
    </div>
</template>

<script>
    import InputChecking from '../components/inputChecking.vue'
    export default {
        name:'pageEight',
        data(){
            return {
                columnsData: [
                    {
                        "name": "工种",
                        "key": "workType"
                    },
                    {
                        "name": "未知楼",
                        "key": "9999"
                    },
                    {
                        "name": "1019",
                        "key": "1110795706384601089"
                    },
                    {
                        "name": "合计",
                        "key": "dayTotal"
                    }
                ],
                rowsData: [
                    {
                        "workType": "钢筋工",
                        "9999": 34,
                        "1110795706384601089": 8,
                        "dayTotal": 42.0,
                        "workTypeId": "1108292268547465218"
                    },
                    {
                        "workType": "砼工",
                        "9999": 0,
                        "1110795706384601089": 0,
                        "dayTotal": 0.0,
                        "workTypeId": "1108292268618768386"
                    },
                    {
                        "workType": "架子工",
                        "9999": 0,
                        "1110795706384601089": 9,
                        "dayTotal": 9.0,
                        "workTypeId": "1108292268681682946"
                    },
                    {
                        "workType": "木工",
                        "9999": 0,
                        "1110795706384601089": 10,
                        "dayTotal": 10.0,
                        "workTypeId": "1108292268744597505"
                    },
                    {
                        "workType": "工种17",
                        "9999": 0,
                        "1110795706384601089": 11,
                        "dayTotal": 11.0,
                        "workTypeId": "1110783125615902721"
                    },
                    {
                        "workType": "工种18",
                        "9999": 0,
                        "1110795706384601089": 12,
                        "dayTotal": 12.0,
                        "workTypeId": "1110783154934087682"
                    },
                    {
                        "workType": "合计",
                        "9999": 34,
                        "1110795706384601089": 50,
                        "dayTotal": 84
                    }
                ],
                dateList:[
                    {
                        occurred_date:'2011-10-11',
                        name:'张三'
                    },{
                        occurred_date:'2011-10-11',
                        name:'李四'
                    },{
                        occurred_date:'2011-10-14',
                        name:'王五'
                    },{
                        occurred_date:'2011-10-15',
                        name:'大奎'
                    }
                ]
            }
        },
        computed:{},
        watch:{},
        components:{
           InputChecking
        },
        methods:{
            testOne(msg){
                this.backOne(msg).then(res=>{
                    this.$message.success(res);
                }).catch(error=>{
                    this.$message.error(error)
                })
            },
            backOne(message){
                return new Promise((resolve, reject)=>{
                        if(message=='success'){
                            setTimeout(()=>{
                                resolve('操作成功')
                            },2000)
                        
                        }else{
                            setTimeout(()=>{
                                reject('操作失败')
                            },2000)
                        }
                })
            },
            testAll(msg1,msg2){
                this.backAll(msg1,msg2).then(res=>{
                    this.$message.success(JSON.stringify(res));
                }).catch(error=>{
                    this.$message.error(error)
                })
            },
            backAll(info1,info2){
                /** 
                 * backAll的状态由p1、p2、p3决定，分成两种情况。
                 * （1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，
                 * 此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
                 * 
                 * （2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，
                 * 此时第一个被reject的实例的返回值，会传递给p的回调函数。
                 * */ 
                const p1 = (msg1,msg2)=>{
                    return new Promise((resolve,reject)=>{
                        if(msg1==msg2){
                            setTimeout(()=>{
                                resolve('参数相同1')
                            },1000)
                        }else{
                            setTimeout(()=>{
                                reject('参数不相同1')
                            },1000)                            
                        }
                    })
                }
                const p2 = (msg1,msg2)=>{
                    return new Promise((resolve,reject)=>{
                        if(msg1==msg2){
                            setTimeout(()=>{
                                resolve('参数相同2')
                            },2000)
                        }else{
                            setTimeout(()=>{
                                reject('参数不相同2')
                            },2000)                            
                        }
                    })
                }
                const p3 = (msg1,msg2)=>{
                    return new Promise((resolve,reject)=>{
                        if(msg1==msg2){
                            setTimeout(()=>{
                                resolve('参数相同3')
                            },3000)
                        }else{
                            setTimeout(()=>{
                                reject('参数不相同3')
                            },3000)                            
                        }
                    })
                }
                return Promise.all([p1(info1,info2),p2(info1,info2),p3(info1,info2)])
            },
            testFormate(){
                let totalArr = [
                    {
                        fold_status: true,
                        details: [],
                        datetime: this.dateList[0].occurred_date
                    }
                ]
                this.dateList.forEach(item => {
                    for (let i = 0; i < totalArr.length; i++) {
                        if (item.occurred_date === totalArr[i].datetime) {
                            totalArr[i].details.push(item)
                            break
                        } else {
                            console.log(item.occurred_date)
                            if (i === totalArr.length - 1) {
                                let createObj1 = {
                                    fold_status: true,
                                    details: [{ ...item }],
                                    datetime: item.occurred_date
                                }
                                totalArr.push(createObj1)
                                break
                            }
                        }
                    }
                })
                console.log(totalArr)
            }
        },
        created(){},
        mounted(){
           this.testFormate() 
        },
        updated(){},
        beforeDestroy(){
            
        }
    }
</script>

