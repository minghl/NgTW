# Ng

## 1. 一些基础命令和概念

```typescript
// cli
npm install -g @angular/cli

// 生命周期初始化
ngOnInit(){
  
}

// 读取静态档案需要在angular.json里面配置assets
// tsconfig.app.json, includes全局吃规则

// 下载安装包type
npm install @types/jquery --save-dev // install jquery type as dev dependency so TS can compile properly
npm install jquery --save // save jquery as a dependency
// 这里需要改动
tsconfig.app.json
 "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": ["jquery"]
  },
    
// lodash引入就不需要改动配置
npm install @types/lodash --save-dev 
npm install lodash --save 

//属性绑定（property & attribute binding）
// property 会改变元素的外观，不同元素有不同property
// attribute 不会影响元素的外观，随便任何元素都可以安装attr
// 当attr有property对应的值，会直接变成property在浏览器中
// 文字插值一般js可以用
// 二者作用差不多，attr作用多于prop
[property]="value"  {{property}}
[attr.abc]="placeholder"
<td [attr.colspan]='2'>3</td>

// 绑定到事件
<button (click)=>"btnFn()"></button>

// 多重类别绑定
// ngClass老了，以后会被拿掉
[ngClass]="{completed:check1, smallText:check1}"
[class]="{completed:check1, smallText:check1}"

// 样式绑定，但是样式最好用class来绑定，不要直接用。只要不是固定的，就别使用，计算的话要用style。但是只有少数才会用计算。
[style.font-size]="'5em'"
[style.fontSize]="'5em'"
[style.fontSize.em]="5"
[style.fontSize.%]="5"
 
 // ngFor
 <li *ngFor="let item of todoDataList" [class]='{completed:item.status, smallText:check1.status}'>
 // ngFor index, 官网上ngFor有很多参数 https://angular.io/api/common/NgFor
  <li *ngFor="let item of todoDataList; let i = index" [class]='{completed:item.status, smallText:check1.status}'> 
  <button click="delete(i)"></button>
  </li>

// 范本变量，按键过滤
<input (keyup)="add($event)">
const value = (event.target as HTMLInputElement).value;
// 范本变数
#box
<input #box (keyup)="onEnter(box)">
  <p>{{value}}<p>
// 按键过滤
<input #box (keyup.enter)="onEnter(box.value); box.value=''">

// @models && todo.model.ts
// 定义类别最好用interface，而不是用class；class会转成语法打包上去，interface不会；如果创造方法，需要用class；单纯数据则是interface
export interface Todo{
  Status: boolean;
  Thing: string;
}
export class Todo{
  Status: boolean = false;
  Thing: string;
  
  constructor(_thing:string, _status:boolean = false){
    this.Thing = _thing;
    this.Status = _status;
  }
}

// ngIf 是否显现这个元素
<input *ngIf="item.Editing" #itemInput [value]="item.Thing" (keyup.enter)="update(item, itemInput.value)" (blur)="update(item, itemInput.value)" (mouseenter)="itemInput.focus()" class="edit"/>

// 列举的型别
export enum TodoStatusType {
  All,
  Active,
  Completed
}
TodoStatusType = TodoStatusType;
nowTodoStatusType = TodoStatusType.All;
<a [class.selecrted]="nowTodoStatusType===TodoStatusType.All">
  
// ngModel 内建属性型指令，显示资料属性，并在使用者进行更改时更新该属性，绑定; 事件绑定，属性绑定
app.module.ts
imports: [
  FormsModule // --- import into the NgModule
]
<input [(ngModel)]="todoInputModel" /> //[()] 事件绑定，属性绑定
  {{todoInputModel}}
// 等于
<input [ngModel]="todoInputModel.name" (ngModelChange)="setUppercaseName($event)" />
  
// ngSwitch 多此一举
  
// 管道pipe -> 用于接收输入值并返回转换后的值
// DatePipe, jsonPipe...
{{date | date:'yyyy-MM-dd HH:mm:ss' }}
{{object | json}}
  
```

## 2. HttpClient与后端沟通

```typescript
// http导入包到app.module.ts
imports:[
  HttpClientModule,
]
constructor(private http: HttpClient) {
}
// 其中<Todo[]>是返回值的类型
this.http.get<Todo[]>('/api/path').subscribe(data=>{
  this.todoDataList = data;
})

// 代理后端服务器
// src下创建的proxy.conf.json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
// angular.json
  "architect": {
    "serve": {
      "builder": "@angular-devkit/build-angular:dev-server",
      "options": {
        "browserTarget": "your-application-name:build",
        "proxyConfig": "src/proxy.conf.json"
      },

// post 新增
// 这样的post就不会导致数据损失id值
this.http.post('/api/todo2_16',todo).subscribe((data)=>{
  // this.getData();
  this.todoDataList.push(data);
});
      
// put 更新
this.http.put('/api/todo2_16/'+item.TodoId, item).subscribe();
item.Editing = false;

// delete 删除
this.http.delete('/api/todo2_16/'+item.TodoId).subscribe();
this.todoDataList = this.todoDataList.filter(data => data !== item);
      
// jsonServer 模拟服务器
npm install -g json-server
// 建一个db.json，预想的数据库
json-server --watch db.json --id TodoId --delay 1000
// 修改proxy文件
{
    "/api": {
        "target": "http://localhost:3000",
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/api": ""
        }
    }
}

// 前端画面显示控制流程策略
// 提高用户体验，loading等
```

## 3. Service基础

```typescript
// service的基本功用，就是将程式分割提取出去
// 常见三种需要用service的情况：
	// 1. 共用性：就是两个地方会用到相同的程式，那我们就会把他写成一个service
	// 2. 单一职责：这个service只负责同一类的事情，这样会方便后续维护
	// 3. 商业逻辑：把商业逻辑部分写成一个service，也是可能利于后续的维护
// spec是测试档案
"schematics": {
  "@schematics/angular:component": {
    "style": "scss"
  },
  "@schematics/angular:service": {
    "skipTests": true
  }
},
 
// 创建service
ng g s example
// 這邊進行service的宣告
// 这就是依赖注入
constructor(private exampleService:ExampleService) { }

// service注册在root根目录里了，跟自己注册写在配置文件一样
// 早起在app.module.ts註冊
providers: [ExampleService],
// 现在不用在app.module.ts註冊，直接service写好
@Injectable({
  providedIn: 'root'
})

// 单独注册，共用service的组件就不会相互影响
@Component({
  selector: 'app-a1',
  templateUrl: './a1.component.html',
  styleUrls: ['./a1.component.scss'],
  //這邊註冊
  providers: [ExampleService]
})
export class A1Component implements OnInit {
    get num() {
    return this.exampleService.num;
  }
  constructor(private exampleService: ExampleService) { }}
```

```typescript
// 将API部分独立成service

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../@models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoApiService {
  private url = '/api/todo2_16';

  constructor(private http: HttpClient) { }

  取得資料() {
    return this.http.get<Todo[]>(this.url);
  }

  新增(value: Todo) {
    return this.http.post<Todo>(this.url, value);
  }

  修改(value: Todo) {
    return this.http.put(`${this.url}/${value.TodoId}`, value);
  }

  刪除(value: Todo) {
    return this.http.delete(`${this.url}/${value.TodoId}`);
  }

  全部狀態統一(value: boolean) {
    return this.http.put(`${this.url}/Status/${value}`, null);
  }

  刪除已完成事項() {
    return this.http.delete(`${this.url}/clearCompleted`);
  }
  
}
```

```typescript
// 商业逻辑切成Service
export class TodoService {
  toggleAllBtn = false;
  nowTodoStatusType = TodoStatusType.All;
  todoDataList: Todo[] = [];

  get nowTodoList() {
    let list: Todo[] = [];

    switch (this.nowTodoStatusType) {
      case TodoStatusType.Active:
        list = this.todoActive;
        break;
      case TodoStatusType.Completed:
        list = this.todoCompleted;
        break;
      default:
        list = this.todoDataList;
        break;
    }

    return list;
  }

  get todoActive(): Todo[] {
    return this.todoDataList.filter(data => !data.Status);
  }

  get todoCompleted(): Todo[] {
    return this.todoDataList.filter(data => data.Status);
  }

  constructor(private todoApiService: TodoApiService) {
    this.getData();
  }

  getData() {
    this.todoApiService.取得列表().subscribe(data => {
      this.todoDataList = data;
      this.todoDataList.forEach(data2 => {
        data2.CanEdit = true;
        data2.Editing = false;
      });
      this.checkToggleAllBtn();
    });
  }

  checkToggleAllBtn() {
    if (this.todoCompleted.length === this.todoDataList.length) {
      this.toggleAllBtn = true;
    } else {
      this.toggleAllBtn = false;
    }
  }

  add(value: string) {
    const seqno = new Date().getTime();
    const todo: Todo = new TodoClass(value, false, seqno);
    this.todoDataList.push(todo);
    this.todoApiService.新增(todo).subscribe(data => {
      this.todoDataList.forEach(data2 => {
        if (data2.Seqno === seqno) {
          data2.TodoId = data.TodoId;
          data2.CanEdit = true;
        }
      })
    });
  }

  toggleAll() {
    this.toggleAllBtn = !this.toggleAllBtn;
    this.todoDataList.forEach(data => {
      data.Status = this.toggleAllBtn;
    });

    this.todoApiService.統一全部狀態(this.toggleAllBtn).subscribe();
  }

  clickCheck(item: Todo) {
    item.Status = !item.Status;

    this.todoApiService.修改(item).subscribe();
    this.checkToggleAllBtn();
  }

  delete(item: Todo) {
    this.todoApiService.刪除(item).subscribe();
    this.todoDataList = this.todoDataList.filter(data => data !== item);
  }

  update(item: Todo) {
    this.todoApiService.修改(item).subscribe();
    item.Editing = false;
  }

  clearCompleted() {
    this.todoApiService.刪除完成的代辦事項().subscribe();
    this.todoDataList = this.todoActive;
  }

}
```

```typescript
// 商业逻辑切分到service后的app.component.ts改寫
export class AppComponent implements OnInit {
  title = 'OneTodo';
  todoInputModel = '';
  TodoStatusType = TodoStatusType;

  get toggleAllBtn() {
    return this.todoService.toggleAllBtn;
  };
  get nowTodoList() {
    return this.todoService.nowTodoList;
  }

  get nowTodoStatusType() {
    return this.todoService.nowTodoStatusType;
  }

  get todoActive(): Todo[] {
    return this.todoService.todoActive;
  }

  get todoCompleted(): Todo[] {
    return this.todoService.todoCompleted;
  }

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

  setTodoStatusType(type: number) {
    this.todoService.nowTodoStatusType = type;
  }

  add() {
    this.todoService.add(this.todoInputModel);
    this.todoInputModel = '';
  }
  
  update(item: Todo) {
    this.todoService.update(item);
  }
  
  delete(item: Todo) {
    this.todoService.delete(item);
  }

  clickCheck(item: Todo) {
    this.todoService.clickCheck(item);
  }

  toggleAll() {
    this.todoService.toggleAll();
  }

  clearCompleted() {
    this.todoService.clearCompleted();
  }

  edit(item: Todo) {
    if (item.CanEdit) {
      item.Editing = true;
    }
  }

}
```

## 4. Component元件

### 1. 创建新的component

```typescript
// 那要組成一個完整的Component需要三個部分
// xx.component.html：就是放我們html碼。
// xx.component.scss：就是放我們style的地方。
// xx.component.ts：就是放我們ts程式碼的地方。
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
// selector：標籤名稱
// templateUrl：html檔的位置
// styleUrls：css檔的位置

// 我們要在app.module.ts中declarations放入這個AppComponent宣告，程式才能正常運作
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

// 产生新的component
ng g c hello
// 自动产生在app.module.ts中的declarations
@NgModule({
  declarations: [
    AppComponent,
    HelloComponent
  ],

// app-hello的字段標籤，我們將這一個標籤文字放到根元件，也就是app.component.html中
{{title}}
<app-hello></app-hello>


```

### 2. 生命周期钩子

```typescript
// 在不同的階段，做不同的處理
ngOnInit(): void {
  //寫在這邊
}

// 检视封装
// Component裡的css樣式，是否會溢出到別的Component的一種設定
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
// 在上述的@Component可以宣告一個encapsulation，預設為 ViewEncapsulation.Emulated，另外有ViewEncapsulation.None及ViewEncapsulation.ShadowDom

// ViewEncapsulation.Emulated：css只會作用在自己的Component之中。
// ViewEncapsulation.ShadowDom ：css作用在自己的Dom內，僅適用於內建支援 shadow DOM 的瀏覽器。並非所有瀏覽器都支援它，這就是為什麼 ViewEncapsulation.Emulated 是推薦和預設模式的原因
// ViewEncapsulation.None：則是會將此Component的css變為全域的作用，但實務上應該不會這麼做

// 所以乖乖的用預設就好，那我們現在就知道有這樣的設定就好，其實不需要有所修改
```

### 3. @Input 父传子

```typescript
// 哪些變數是要從父親來的在上方加入@Input()，並且把裡面的值清掉，因為要從別的地方取得
@Input()
title!: string;
@Input()
todoDataList!: Todo[];

// todo.component.html放上我們剛完成的header元件標籤
<header class="header">
  <app-header [title]="title" [todoDataList]="todoDataList"></app-header>
</header>
```

### 4. @Output 子传父

```typescript
// 子
@Output()
onDeleteItem= new EventEmitter<Todo>();

delete(item: Todo) {
  this.todoApiService.刪除(item).subscribe();
  this.onDeleteItem.emit(item);
  //this.todoDataList = this.todoDataList.filter(data => data !== item);
}

// 父
deleteItem(item: Todo) {
  this.todoDataList = this.todoDataList.filter(data => data !== item);
}

<app-section (onDeleteItem)="deleteItem($event)" [nowTodoList]="nowTodoList" [todoDataList]="todoDataList" [todoCompleted]="todoCompleted">
</app-section>
```

### 5. @Input 加 @Output 等于双向绑定

```typescript
// 子
@Output()
todoDataListChange = new EventEmitter<Todo[]>;

//我們新增一個output，並還原本來的delete，並將在子元件修改的todoDataList給傳送出去
delete(item: Todo) {
  this.todoApiService.刪除(item).subscribe();
  this.todoDataList = this.todoDataList.filter(data => data !== item);
  this.todoDataListChange.emit(this.todoDataList);
}

// 父
// 將子元件改好的結果，傳給父元件即可修復正常
<section class="main" style="display: block;">
  <app-section (todoDataListChange)="todoDataList=$event" [nowTodoList]="nowTodoList" [todoDataList]="todoDataList"
    [todoCompleted]="todoCompleted">
  </app-section>
</section>

// 用雙向繫結的寫法精簡，將(todoDataListChange)="todoDataList=$event"和[todoDataList]="todoDataList"合併成[(todoDataList)]="todoDataList"
// [(變數)]這樣的寫法就是雙向繫結，同時做了以上兩件事情
// 类似ngModel，内置的双向绑定
<section class="main" style="display: block;">
  <app-section [(todoDataList)]="todoDataList" [nowTodoList]="nowTodoList" [todoCompleted]="todoCompleted">
  </app-section>
</section>
```

### 6. 使用Service进行元件通讯

```typescript
// 那因為我會特別解說語法跟情境，所以不用擔心現在會看不懂，可以先備著了解一下，以後陸續都會用到Rxjs

// 其實HttpClient的subscribe就是Rxjs的語法之一

// 值都是公用的，所以不用考虑一直子传父，父传子
```

### 7. 父子元件通过范本变数互动，ngIf防止空值错误

```typescript
// 范本变数 #model
<app-todo-info-modal #modal></app-todo-info-modal>

// 我們在app-todo-info-modal再加上一個Input窗口
@Input() todo!:Todo

// ngIf 防空值
<div class="modal-body">
  <div *ngIf="todo">
    <div>id:{{todo.TodoId}}</div>
    <div>事情:{{todo.Thing}}</div>
    <div>完成:{{todo.Status?'是':'否'}}</div>
    <div>建立日期:{{todo.CreateTime | date:'yyyy-MM-dd'}}</div>
  </div>
</div>

// 其實這才是Input的最佳使用情境，因為相當的單純，就是我建立好一個模板後
// 外部再傳值進來，模板便將傳進來的值套好，情境相當直覺
// 就是這種直覺型的工作，才會使用Input或Output作業，否則會使用service來溝通為佳
```

### 8. @ViewChild父元件呼叫子元件的内容

```typescript
// 之前直接使用子元件方法呼叫
<button (click)="modal.show()"
*ngIf="item.CanEdit"
class="destroy2">i</button>

// 修改后
<button (click)="modalShow(item)" *ngIf="item.CanEdit" class="destroy2">i</button>

// 配置
export class SectionComponent implements OnInit {
  @ViewChild(TodoInfoModalComponent)
  private todoInfoModalComponent!: TodoInfoModalComponent;
  
  modalShow(item: Todo) {
    this.nowSelectTodo = item;
    this.todoInfoModalComponent.show();
  }
}
```

### 9. 父子元件通过服务来通讯

```typescript
// 但能做到的事情其實是一樣的，但定閱用起來可以更優雅，更適合更多的複雜情境

// 如果情境沒很複雜，其實使用共用變數的方式就好了
```

## 5. Router 路由

### 1. SPA

```typescript
// 當你的網站比較需要SEO，像是官方網站、活動網站，也同時適應各裝置的環境的能力要大，那就是用MPA來開發會比較穩。

// 如果是內部系統、功能性取向的系統，看重的是使用者體驗，那用SPA會是更好的選擇。
```

### 2. 路由基本操作

```typescript
// 先在跟app一樣的目錄下產生一個app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// 再到app.module.ts把它註冊上去
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule //這邊引入
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// app-routing.module.ts，並在const routes: Routes中開始寫上我們的路由規則
const routes: Routes = [
  { path: 'home', component: HomeComponent },  
  { path: 'todo', component: TodoComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent }
];

// 選單的MenuComponent，寫上選單跟網址。那網址這邊我們不用href，要用Angular提供的語法routerLink，這樣才會有SPA的效果，如果使用href會跟變成跟MPA一樣
<li class="sidebar-item" routerLinkActive="selected" >
    <a class="sidebar-link waves-effect waves-dark sidebar-link active"
    routerLink="/home"
       aria-expanded="false"><i class="mdi mdi-view-dashboard"></i><span
              class="hide-menu">首頁</span></a>
</li>
<li class="sidebar-item" routerLinkActive="selected">
    <a class="sidebar-link waves-effect waves-dark sidebar-link active"
    routerLink="/todo"
       aria-expanded="false"><i class="mdi mdi-view-dashboard"></i><span
              class="hide-menu">Todo</span></a>
</li>
```

### 3. 子路由

```typescript
// manage.component.html
<div id="main-wrapper"
     data-layout="vertical"
     data-navbarbg="skin5"
     data-sidebartype="full"
     data-sidebar-position="absolute"
     data-header-position="absolute"
     data-boxed-layout="full">
     <app-header2></app-header2>
    <app-menu></app-menu>
    <div class="page-wrapper">
        <router-outlet></router-outlet>
    </div>
</div>

// app.component.html留下路由標籤就好
<router-outlet></router-outlet>

// 路由改变
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'manage',
    component: ManageComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'todo', component: TodoComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent },
];

// 目錄绑定
[routerLink]="['home']"
routerLink="/manage/todo"

// ts這邊路由轉跳
this.router.navigateByUrl('/manage/home');
```

### 4. 功能模块化以及延迟载入

```typescript
// 如果專案已有上百的元件，都不模組化且設置延遲載入。那使用者第一次進到系統，可能就需要等個數秒鐘，畫面才會顯現。 簡單來說就是將原先的專案，切成數塊模組

ng g m login --routing
//產生一個新的module，後面是一併產生路由設定檔，因此會產生以下兩個檔案

// 改login-routing.module.ts的路由設定
import { LoginComponent } from './login.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule({
 	// 子路由forChild，根目录forRoot
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }

// app-routing.module.ts改成延遲載入login。 loadChildren就是延遲載入的寫法，存檔後我們就可以來看看有沒有延遲載入了。
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
// 而模組化另一個好處就是降低依賴性，未來如果你該個模組要替換或移除，直接刪掉就好，不會影響原有的程式運作

// 同時產生整包的檔案
ng g m account --route account --module manage.module

```

### 5. 路由参数获取指定内容

```typescript
// todo-routing.module.ts，其中:id，就是準備要傳參數的地方的寫法，一個：加上自訂變數
const routes: Routes = [
  { path: 'list', component: TodoListComponent },
  { path: 'content/:id', component: TodoContentComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

// todo-list.component.html改一下參數的網址
<div class="cen">代辦事項列表</div>
<div class="mar5" *ngFor="let item of dataList">
  <a [routerLink]="['../content',item.GroupId]" type="button" class="btn btn-outline-primary">
    {{item.Name}}
  </a>
</div>

// 要到todo-content.component.ts中來取得Id，那這邊會注入一個ActivatedRoute，一個可以取得參數的服務
constructor(private todoService: TodoService,private route: ActivatedRoute) { }
ngOnInit() {
  this.todoService.todoDataList = [];
  this.route.paramMap.subscribe(data => {
    this.todoService.gid = data.get('id') as string;
    this.todoService.getData();
  });
}

// 另一種取得的方式
ngOnInit() {
  this.todoService.todoDataList = [];
  this.todoService.gid =this.route.snapshot.paramMap.get('id') as string;
  this.todoService.getData();
}

//在ngOnInit裡，是初始化才會執行，如果你是在這一頁直接轉換不同id的這一页將不會執行ngOnInit，而不會執行，就不會取到正確的資料，用講得不好講，影片會示範。而訂閱的方式只要數值有變更，就會執行，所以不會有這個問題
```

### 6. 预先载入资料

```typescript
// 剛進入要等一下資料才會出來會造成使用者體驗不佳的問題
// 產生resolve的指令.產生resolve的基本格式，這是作為angular的預載機制的一個檔案類型
ng g r todo

// 依賴注入TodoApiService
constructor(private todoApiService:TodoApiService){}

// 要在resolve這邊先取得todo的資料
import { Todo } from './../@models/todo.model';
import { TodoApiService } from './../@services/todo-api.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoResolver implements Resolve<Todo[]> {

  constructor(private todoApiService: TodoApiService, private todoService: TodoService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Todo[]> {
    const id = route.paramMap.get('id') as string;
    this.todoService.gid = id;
    return this.todoApiService.取得資料(id);
  }

}

// 我們再到todo-routing.module.ts，加上預載資料的設定
const routes: Routes = [
  { path: 'list', component: TodoListComponent },
  {
    path: 'content/:id',
    children: [
      {
        path: ':action',
        component: TodoContentComponent,
        resolve: { todoList: TodoResolver }
      },
      { path: '', redirectTo: 'All', pathMatch: 'full' }
    ]

  },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

// 我們就到todo-content.component.ts中來取得
constructor(private todoService: TodoService,
  private route: ActivatedRoute) { }
 
ngOnInit() {
  this.todoService.todoDataList = [];
  this.route.data.subscribe(data=>{
   this.todoService.todoDataList = data['todoList'];
   this.todoService.ready();
  });
}
```

### 7. 路由事件换页读取进度条

```typescript
// animations是angular裡面動畫的語法
// process.component.ts
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-process-bar',
  animations: [
    trigger('startEnd', [
      state('start', style({
        width: '0%'
      })),
      state('80', style({
        width: '80%'
      })),
      state('end', style({
        width: '100%'
      })),
      transition('* => 80', [
        animate('10s')
      ]),
      transition('* => end', [
        animate('0.3s')
      ]),
      transition('* => start', [
        animate('0s')
      ]),
    ]),
  ],
  templateUrl: './process-bar.component.html',
  styleUrls: ['./process-bar.component.scss']
})
export class ProcessBarComponent implements OnInit {
  status = 'start';
  show = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.status = 'start';
        this.show = true;
        this.status = '80';
      });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.status = 'end';
        setTimeout(() => {
          this.status = 'start';
          this.show = false;
        }, 300);
        window.scrollTo(0, 0);
      });
  }
}

// 最後是模組的設定，設定完後記得在app-routing.module.ts中import這個模組才能用
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessBarComponent } from './process-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    ProcessBarComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  exports: [ProcessBarComponent]
})
export class ProcessBarModule { }
```

### 8. JWT和HTTP_INTERCEPTORS

```typescript
// 登录时，在localstorage设置tokey
// login.component.ts可以先這樣寫
login() {
    this.loginService.JWT登入(this.loginValue).subscribe((data: any) => {
      if (data.Status === 1) {
        localStorage.setItem('jwt', data.Data);
        this.router.navigateByUrl('/manage/home');
      }else{
        alert(data.Message)
      
}
      
// httpIntercept 拦截器加上认证
const jwt = localStorage.getItem('jwt');

if (jwt) {
  req = req.clone({
    headers: req.headers.set('Authorization', 'bearer ' + jwt)
  });
}
      
// 要到app.module.ts做註冊
@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ProcessBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// 登出的時候把localStorage.removeItem('jwt')清掉就可以了
```

### 9. 路由守卫

```typescript
// 产生守卫的基本格式
ng g g auth

// 路由守衛的基本格式檔
canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

  return true;
}

// jwt = 期限.+xx.+yy.
// 期限判断
if (jwt) {
    const payload = JSON.parse(window.atob(jwt.split('.')[1]));
    const exp = new Date(Number(payload.exp) * 1000);
    if (new Date() > exp) {
      alert('JWT已過期，請重新登入');
      return this.router.createUrlTree(['/login']);
    }
  } else {
    alert('尚未登入');
    return this.router.createUrlTree(['/login']);
  }

// 放置守卫
const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'manage',
    canActivate: [AuthGuard],
    loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent },
];

// 子路由守卫  修改一下auth.guard.ts
canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  return this.canActivate(childRoute, state);
}
// 增加一個canActivateChild，開頭也要多implements一個CanActivateChild 
export class AuthGuard implements CanActivate, CanActivateChild{}
// 路由表修改设置
const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'manage',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent },
];

// 前端所有的驗證，都不是在禁止使用者進入或使用某個沒有權限的功能頁面。上面的路由守衛，其實只是讓正常的使用者知道，喔~我現在沒有登入，然後我們程式就貼心的幫使用者導到登入畫面。所有的權限驗證都是後端在負責的，前端的驗證，只是在提升使用者體驗而已。
```

## 6. Rxjs

```typescript
1. ReactX 异步语言 API observable streams
Observer pattern, Iterator pattern, functional programming

建立数据串流 -> 组合stream -> 收到数据

import {Subject, fromEvent} from 'rxjs'

const data$ = new Subject();

data$.subscribe(value=>{
  console.log(value);
});

data$.next(1);
data$.next(3);
data$.next(5);
data$.next(7);

const click$ = fromEvent(document.querySelector('#btn'),'click');

click$.subscribe(event=>{
  console.log('click');
})
// data$加$变量可以被订阅

// 关注点分离

// 需要用到rxjs
// 如果超过一个异步，至少一个异步事件来源是不可控制时间点。（发生时机点不可控）。需要去协调两个异步事件的互动关系。
// 同时发出200个http request，不固定时间，利用rxjs会控制大量的非同步事件

// web socket 后端会用到rxjs，即时通讯会用到rxjs
```

### 1. 