
function two(callback) {
    setTimeout(function () {
        console.log('two');
        callback && callback();
    }, 200)
}

function three(callback){
    setTimeout(function(){
        console.log('three');
        callback && callback();
    }, 300)

}

function one(callback){
    setTimeout(function(){
        console.log('One');
        callback && callback();
    }, 100)
}
// three();
// two();
// one();

asyncSelector([ two,three, one], function () {
    console.log("callback called!");
});
var myEndHandler = function(){
console.log('next function was called')

}

function asyncSelector(fnArr, callback, i) {
    let len = fnArr.length - 1;
    i = i || 0;
    if (typeof fnArr[i] === 'function'){
        fnArr[i](next);
    }else{
        next()
    }

    function next(){
        if(len > i){
            asyncSelector(fnArr, callback, ++i);
        }else{
            callback && callback();
        }
    }
    // callback()
}




// get(actionController,auth)
//
// function get(fn1, fn2){
//     console.log('get called')
//
//     fn1(fn2)
// }
//
// function auth(next){
//     console.log('auth called')
//    next && next()
// }
//
// function actionController(next){
//     console.log('action called')
//     next && next()
// }

