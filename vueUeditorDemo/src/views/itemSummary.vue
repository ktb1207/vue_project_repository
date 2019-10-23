<style scoped>
   
    
</style>

<template>
   <div class="page-wrp">
       <VueUEditor @ready="editorReady" :ueditorConfig="editorConfig" style="width:100%"></VueUEditor>
    </div>
    
</template>

<script>
    import VueUEditor from '../components/UEditor.vue';
    export default {
        name:'itemSummary',
        data(){
            return {
                editorConfig:{
                    elementPathEnabled: false, //删除元素路径
                    wordCount: false,    //删除字数统计
                }
            }
        },
        computed:{

        },
        components:{
            VueUEditor
        },
        methods:{
            editorReady (editorInstance) {
                let abc = '';
                abc = abc +'<table style="width:100%;">';
                abc = abc+'<thead>';
                abc = abc+'<tr>';
                abc = abc +'<td colspan=4 style="text-align:center;font-weight:700;font-size:24px;">2009级软件工程专业就业统计</td>';
                abc = abc+'</tr>';
                abc = abc+'<tr>';
                abc = abc+'<td style="font-weight:600;">就业去向</td><td style="font-weight:600;">平均薪酬</td><td style="font-weight:600;">男生占比</td><td style="font-weight:600;">女生占比</td>';
                abc = abc+'</tr>';
                abc = abc+'</thead>';
                abc = abc +'<tbody>';
                abc = abc +'<tr>';
                abc = abc +'<td style="color:red">北京</td><td>10000</td><td>32%</td><td>12%</td>';
                abc = abc +'</tr>';
                abc = abc +'<tr>';
                abc = abc +'<td>上海</td><td>9200</td><td>22%</td><td>24%</td>';
                abc = abc +'</tr>';
                abc = abc +'<tr>';
                abc = abc +'<td>杭州</td><td>8800</td><td>28%</td><td>32%</td>';
                abc = abc +'</tr>';
                abc = abc +'<tr>';
                abc = abc +'<td>广州</td><td>8600</td><td>26%</td><td>14%</td>';
                abc = abc +'</tr>';
                abc = abc +'</tbody>';
                abc = abc +'</table>';
                editorInstance.setContent(abc);
                editorInstance.addListener('contentChange', () => {
                console.log('编辑器内容发生了变化：', editorInstance.getContent());
                });
            }
        },
        created(){

        },
        mounted(){
            
        }
    }
</script>

