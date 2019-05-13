//定义三种状态
var pending = 0;
var fullfilled = 1;
var rejected = -1;

function MyPromise(fn) {
    var self = this;//缓存当前promise实例
    self.value = null;//操作成功时的值
    self.error = null;//操作失败时的值
    self.status = pending;//定义promise的状态
    self.onFullfilled = null;//操作成功时的回调函数
    self.onRejected = null;//操作失败时的回调函数

    function resolve(value) {
        if (self.status === pending){
            setTimeout(function () {
                self.status = fullfilled;//成功执行时状态改变
                self.value = value;
                if (self.onFullfilled){self.onFullfilled(self.value);}
            },0)
        }
    }
    //使用setTimeout包裹，让resolve和reject在then之后执行
    function reject(error) {
        if (self.status === pending){
            setTimeout(function () {
                self.status = rejected;//执行失败时状态改变
                self.error = error;
                if (self.onRejected){self.onRejected(self.error);}
            },0)
        }
    }
    fn(resolve,reject);//mypromise在被创建时立即执行
}

MyPromise.prototype.then = function (onFullfilled,onRejected) {
    //给promise实例注册成功、失败回调
    if (this.status === pending){
        this.onFullfilled = onFullfilled;
        this.onFullfilled = onRejected;
    } else if (this.status === fullfilled){
        onFullfilled(this.value);
    }else {
        onRejected(this.error);
    }
    return this;
};

let promise = new MyPromise(function(resolve, reject) {
    console.log('Promise');
    resolve();
});

promise.then(function() {
    console.log('resolved.');
});

console.log('Hi!');