const PENDING = 0;
const FULFILLED = 1;
const REJECTED = -1;

/**
 *MyPromise构造器
 * @param {function} fn
 * @returns {function}
 */
function MyPromise(fn) {
    const self = this;
    self.value = null;
    self.error = null;
    self.status = PENDING;
    self.onFulfilledCallbacks = [];//存储异步操作
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (self.status === PENDING) {
            setTimeout(function() {
                self.status = FULFILLED;
                self.value = value;
                self.onFulfilledCallbacks.forEach(function(f){
                    f(self.value);
                });
            })
        }
    }

    function reject(error) {
        if (self.status === PENDING) {
            setTimeout(function() {
                self.status = REJECTED;
                self.error = error;
                self.onRejectedCallbacks.forEach(function (f) {
                    f(self.error);
                });
            })
        }
    }
    try {
        fn(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

//用来解析回调函数的返回值x，x可能是普通值也可能是个promise对象
function resolvePromise(bridgepromise, x, resolve, reject) {
    let called = false;
    if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
        try {
            // 是否是thenable对象（具有then方法的对象/函数）
            let then = x.then;
            if (typeof then === 'function') {
                //如果 then 是一个函数，以x为this调用then函数，且第一个参数是resolvePromise，第二个参数是rejectPromise
                then.call(x, function (y)  {
                    if (called) return;
                    called = true;
                    resolvePromise(bridgepromise, y, resolve, reject);
                }, error => {
                    if (called) return;
                    called = true;
                    reject(error);
                })
            } else {
                //如果 then不是一个函数，则 以x为值fulfill promise。
                resolve(x);
            }
        } catch (e) {
            //如果在取x.then值时抛出了异常，则以这个异常做为原因将promise拒绝。
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
    const self = this;
    let bridgePromise;//衔接后续操作,以实现异步操作串行,而不必返回自身实例
    if (self.status === FULFILLED) {
        return bridgePromise = new MyPromise(function(resolve, reject){
            setTimeout(function() {
                try {
                    let x = onFulfilled(self.value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        })
    }
    if (self.status === REJECTED) {
        return bridgePromise = new MyPromise(function(resolve, reject){
            setTimeout(function() {
                try {
                    let x = onRejected(self.error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (self.status === PENDING) {
        return bridgePromise = new MyPromise(function(resolve, reject){
            self.onFulfilledCallbacks.push(function(value) {
                try {
                    let x = onFulfilled(value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            self.onRejectedCallbacks.push(function(error) {
                try {
                    let x = onRejected(error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
};
MyPromise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
};

MyPromise.all = function(promises) {
    return new MyPromise(function(resolve, reject) {
        let result = [];
        let count = 0;
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function(data) {
                result[i] = data;
                if (++count === promises.length) {
                    resolve(result);
                }
            }, function(error) {
                reject(error);
            });
        }
    });
};

MyPromise.race = function(promises) {
    return new MyPromise(function(resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function(data) {
                resolve(data);
            }, function(error) {
                reject(error);
            });
        }
    });
};











const getJSON = function(url) {
    const promise = new Promise(function(resolve, reject){
        const handler = function() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();
    });
    return promise;
};

getJSON("MyPromise.js").then(function(json) {
    console.log('Contents: ' + json);
}, function(error) {
    console.error('出错了', error);
});