# git常用命令
git clone 地址<br/>
git status 状态<br/>
git add  添加<br/>
git add . <br/>
git commit 提交<br/>
git pull 拉新<br/>
git push 推送<br/>
git branch 分支<br/>
git checkout 切换分支<br/>
git log 日志<br/>
git reset 切版本<br/>
git merge 合并代码<br/>
# git忽略文件的创建
在所要忽略的目录下用命令工具touch .gitignore此时该目录下会生成一个文件，用vim或编辑器打开该文件，在里面设置忽略规则即可<br/>
### 此#为注释 – 将被 Git 忽略<br/>
* .a # 忽略所有 .a 结尾的文件<br/>
* !lib.a # 但 lib.a 除外<br/>
* /TODO # 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO<br/>
* build/ # 忽略 build/ 目录下的所有文件<br/>
* doc/*.txt # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt<br/>
