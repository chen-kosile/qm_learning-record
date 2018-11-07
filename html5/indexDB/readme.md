# indexDB

- 数据保存
    1. localStorage 小的， 结果结构简单的数据
    复杂 结合 JSON.stringify()
    JSON.parse() 2-6M之间
    中奖次数和奖品， 不用去后端取了
    2. cookie
    uid=1000
        cookie 就是一个字符串， key=val;
        key2=val2 非常重要的信息， 并且在每次http请求时都会带上

- indexDB 让前端释放野心的数据库， 前端的MongoDB
    1. request
        DB = window.indexedDB().open(dbname, dbversion)
    2. 异步的
        onsuccess 开始数据业务
        onupgradeneeded 更新数据库
        DB.createObjectStore()
        objectStore.createIndex('email', 'email', { unique: true})
    3. 事务 transaction 让数据存储更安全
        add request onsuccess