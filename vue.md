html
```
<div id="app">
         <!--v-bind-->
	    <h1 :title="message">点我看看</h1>
         <!--v-if-->
         <p v-if="seen">现在你看到我了</p>
         <!--v-for-->
         <ol>
             <li v-for="todo in todos">
                 {{todo.text}}
             </li>
         </ol>
         <!--v-on-->
         <!--v-model-->
         <input v-model="dataMessage"/>
         <button v-on:click="go">增加</button>
         <button @click="remove">移除</button>
         <!--name组件-->
         <name :test="seen" :test1="message"></name>
</div>
```
js
```
 Vue.component('name',{
        template:'<h4>{{test}}{{test1}}</h4>',
        props:['test','test1']
    })
    const vf=new Vue({
        el:'#app',
        data:{
            message:'hello '+new Date(),
            seen:true,
            todos:[
                {text:'六月'},
                {text:'耳朵'}
                ]
        },
        methods:{
            go(){
                let obj={};
                obj.text=this.dataMessage?this.dataMessage:'请输入内容';
                this.dataMessage='';
                this.todos.push(obj)
            },
            remove(){
              this.todos.pop();
            }
        }
    });
    vf.$watch('todos',function(){
        console.log('todos changed')
    })
```