function Sleep () {
    let that = this;
    this.abortStatus = false;
    this.doneTimeHandle = null;
    this.abortIntervalHandle = null;
    /**
     * params timeStamp
     * return Promise
     * */ 
    this.promise = delay => {
        let promiseDone = new Promise((resolve, reject) => {
            this.doneTimeHandle = setTimeout(() => {
                clearInterval(this.abortIntervalHandle)
                reject('Not implemented')
            },delay)
          })
        let promiseAbout = new Promise((resolve, reject) => {
            this.abortIntervalHandle = setInterval(() => {
                if (this.abortStatus) {
                    resolve('abort')
                    clearInterval(this.abortIntervalHandle)
                    clearTimeout(this.doneTimeHandle)
                }
            },1000)
        })
        return Promise.race([promiseDone, promiseAbout])
    }
    /**
     * 中断操作
     * */ 
    this.abort =  () => {
        this.abortStatus = true;
    }
}

export default Sleep;