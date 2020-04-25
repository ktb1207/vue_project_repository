<style lang="less">
.file-upload {
  padding: 0px;
  display: block;
}
</style>

<template>
  <div class="file-upload">
    <input type="file"
      :multiple="multiple"
      @change="selectFileChange($event)">
  </div>
</template>

<script>
export default {
  name: 'fileUpload',
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileLength: 0 // 选择文件数量
    };
  },
  computed: {},
  components: {},
  watch: {},
  methods: {
    // 监听选择文件
    selectFileChange(event) {
      const fileList = event.target.files;
      this.fileLength = fileList.length; // 文件数量
      this.uploadMethod(fileList);
    },
    async uploadMethod(fileArr) {
      for (let i = 0; i < fileArr.length; i++) {
        var formData = new FormData(); // FormData 对象
        formData.append('fileName', item); // 文件对象
        await this.postData(formData, '/api/upload', i + 1);
      }
    },
    postData(formData, url, index) {
      const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        //设置响应返回的数据格式
        xhr.responseType = 'json';
        // 设置post 发送数据的格式，
        xhr.setRequestHeader('Accept', 'multipart/form-data');
        // 进度监听
        xhr.upload.addEventListener('progress', this.uploadProgress, false);
        xhr.onreadystatechange = () => {
          if (this.readyState !== 4) {
            return;
          }
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error(this.statusText));
          }
        };
        //发送数据
        xhr.send(formData);
      });
      return promise;
    },
    // 上传进度
    uploadProgress(evt) {
      if (evt.lengthComputable) {
        var percentComplete = Math.round((evt.loaded * 100) / evt.total);
        document.getElementById('progressNumber').innerHTML = '';
      } else {
        document.getElementById('progressNumber').innerHTML =
          'unable to compute';
      }
    }
  },
  mounted() {}
};
</script>