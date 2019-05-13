function MyPromise(fn) {
    var self = this;//缓存当前promise实例
    self.value = null;//操作成功时的值
    self.error = null;//操作失败时的值
    self.onFullfilled = null;//操作成功时的回调函数
    self.onRejected = null;//操作失败时的回调函数

    function resolve(value) {
        setTimeout(function () {
            self.value = value;
            self.onFullfilled(self.value);//resolve时执行成功回调;
        })
    }
    //使用setTimeout包裹，让resolve和reject在then之后执行
    function reject(error) {
        setTimeout(function () {
            self.error = error;
            self.onRejected(self.error);//reject时执行失败回调;
        })
    }
    fn(resolve,reject);//mypromise在被创建时立即执行
}

MyPromise.prototype.then = function (onFullfilled,onRejected) {
    //给promise实例注册成功、失败回调
    this.onFullfilled = onFullfilled;
    this.onFullfilled = onRejected;
};