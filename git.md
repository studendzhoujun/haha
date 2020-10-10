# git常用命令
git clone url<br/>
git clone -b name url 指定分支<br/>
git status 状态<br/>
git add  添加<br/>
git add . <br/>
git commit 提交<br/>
git pull 拉新<br/>
git push 推送<br/>
git branch 分支<br/>
git branch -a <br/>
git checkout 切换分支<br/>
git log 日志<br/>
git reset 切版本<br/>
git reset --hard number<br/>
git merge 合并代码<br/>
git merge --squash 合并代码忽略提交记录<br/>
git log -p 文件名  查看文件修改记录<br/>
git log -p number 文件名  查看最近number次的文件修改记录<br/>
# git忽略文件的创建
在所要忽略的目录下用命令工具touch .gitignore此时该目录下会生成一个文件，用vim或编辑器打开该文件，在里面设置忽略规则即可<br/>
```
 vim .gitignore
```
### 此#为注释 – 将被 Git 忽略<br/>
* .a # 忽略所有 .a 结尾的文件<br/>
* !lib.a # 但 lib.a 除外<br/>
* /TODO # 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO<br/>
* build/ # 忽略 build/ 目录下的所有文件<br/>
* doc/*.txt # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt<br/>

# git仓库迁移
```
1.从原地址克隆一份裸版本库，比如原本托管于 GitHub。

git clone –bare git://github.com/username/project.git

2. 然后到新的 Git 服务器上创建一个新项目，比如 GitCafe。

3. 以镜像推送的方式上传代码到 GitCafe 服务器上。

cd project.git

git push –mirror git@gitcafe.com/username/newproject.git
```

# git版本回退

`git reset --hard 版本号`

# git修改远程仓库地址
```
  git remote rm origin
  git remote add origin [url]
```

# npm 
```
 # 发布
 npm publish
 # 发布tag版本
 npm publish --tag name
 # 将tag版本升到稳定版
 npm dist-tag add xxx@xxx latest
 # npm切源
 npm config set registry xxx
 # 淘宝源
 https://registry.npm.taobao.org
 # npm官方源
 https://registry.npmjs.org/
 # 获取当前npm源
 npm get registry
 # 添加用户
 npm adduser --registry=xxxxxx
```