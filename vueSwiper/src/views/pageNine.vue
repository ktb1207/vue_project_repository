/*
 * @Author: kongtb 
 * @Date: 2019-05-09 09:48:57 
 * @Last Modified by: kongtb
 * @Last Modified time: 2019-05-10 14:43:17
 */
 <style lang="less">
    
</style>


<template>
    <div class="page-wrp">
       <div class="btn-group">
            <el-button type="primary" @click.stop="getHtml">获取html</el-button>
            <el-button type="primary" @click.stop="getText">获取text</el-button>
            <el-button type="primary" 
                v-clipboard:copy="copyText"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError">复制文本</el-button>
            <el-button type="primary" @click="print">创建Image</el-button>            
            <el-button type="primary" @click="download">下载Image</el-button>            
        </div>
       <div id="editor">
            <p>欢迎使用 <b>wangEditor</b> 富文本编辑器</p>
            <p>{{name}}</p>
            <p>html 初始化内容</p>
        </div>
        <div id="editorTwo" ref="printDom"></div>
        <div>
            <input id="copyTarget" :value="copyText" ref="copyTarget">
            <img :src="output" alt="这是一个图片">
        </div>
    </div>
</template>

<script>
    import E from 'wangeditor'
    import ClipboardJS from 'clipboard'
    export default {
        name:'pageNine',
        data(){
            return {
                name:"测爱上邓丽君按时打卡了",
                editDom:null,
                copyText:'',
                output: null
            }
        },
        computed:{},
        watch:{},
        components:{
           
        },
        methods:{
            createEdit(){
                var editor = new E('#editor')
                editor.create()
                // 禁用编辑功能
                // editor.$textElem.attr('contenteditable', false)
            },
            createEditTwo(){
                this.editDom = new E('#editorTwo')
                this.editDom.create()
                var htmlTxt = '';
                htmlTxt = htmlTxt+'<div style="width:100%;background-color:red">'
                htmlTxt = htmlTxt+'<p style="color:blue;">用 JS 设置的内容</p>'
                htmlTxt = htmlTxt+'<p style="color:#ffffff;font-size:24px;">用 JS 设置的内容</p>'
                htmlTxt = htmlTxt+'</div>'
                this.editDom.txt.html(htmlTxt)
            },
            getHtml(){
               console.log(this.editDom.txt.html()) 
            },
            getText(){
                console.log(this.editDom.txt.text())
                this.copyText = this.editDom.txt.text()
            },
            onCopy(e){
                alert('You just copied: ' + e.text)
            },
            onError(e){
                alert('Failed to copy texts')
            },
            async print() {
                const el = this.$refs.printDom;
                const options = {
                    type: 'dataURL'
                }
                this.output = await this.$html2canvas(el, options);
            },
            download(){
                var eleLink = document.createElement("a");
                eleLink.href = this.output; // 转换后的图片地址
                eleLink.download = "pictureName";
                // 触发点击
                document.body.appendChild(eleLink);
                eleLink.click();
                // 然后移除
                document.body.removeChild(eleLink);
            }
        },
        created(){},
        mounted(){
            this.createEdit()
            this.createEditTwo()
        },
        updated(){},
        beforeDestroy(){
            
        }
    }
</script>


