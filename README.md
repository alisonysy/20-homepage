This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Challenges
当元素*依赖*的数据是组件状态里一个*数组当中的对象*，而只是该对象的其中*某个属性*发生改变时，进行`setState`改变组件状态需要该数组发生改变或数组的子元素发生改变，即数组的引用地址或子元素的引用地址改变，否则会被认为该状态**没有改变**。此时，可以通过创建新数组，使新数组替换旧数组的方式，来触发状态改变：
```js
this.setState((prevArr)=>{
  let tempArr = []; 
  for(let p=0;p<prevArr.length;p++){
    // 找到需要修改属性的对象，用新对象代替旧对象
    tempArr.push(prevArr[p].id===id? {id:id,prop:newProp} : prevArr[p]);
  };
  return tempArr;
})
```

## To-do
### 1. Notes
功能：
1. 笔记内容
+ 普通内容
+ to-do (可标记完成、未完成、进行中，完成的前提条件)
2. 笔记日期时间
3. 标签 - 与网页的标签无关
4. 紧急情况

优化：
1. `note-section`里关于抓取记录的性能优化，删除记录后不再重新抓取。
2. 使用`useReducer`管理记录状态
3. 移动端适配：取消`keydown`事件；媒体查询与inline-style

## Notes
### About Ant Design
类组件的表单实例需要通过`React.createRef()`创建`ref`取得，而函数组件的表单实例通过`const {form} = Form`和`<Form form={form}></Form>`获得。

## 状态管理
### global:
isKeyboardListenerOn - **show** if a user can press a key and open a new tab

### layout - website:
all records of favourite sites - category, domain, icon, url, key, tags, title
all records of tags - name, color 
isKeyboardListenerOn - **determine** if the user can press a key and open a new tab

+ component - websiteCard:
individual record of favourite site
|- component - favIcon: url, icon
|- component - tagWithTooltip: tags
*#toConsider*: not registering `keydown` event inside each card, but lifting it up instead

+ component - addFavourite:
props.handleListenOnKeyboard be called on modal open
modal visibility, modal loading - *local state*
hold tags info for form submitting 
|- component - tags: tag input field and tag display field (wrappedTag that enables click-to-generate color if no color is assigned, or click-to-change color otherwise)
|-- component - wrappedTag: tag itself and popover (be on when the tag color exists in db, handle whether to change color - yes to generate new color, no to stay the same)

### layout - note:
all records of notes: add, edit; delete
notes on db, empty note form
|- component - note: id, isNew, content, created, tags, urgency, isEdit
#toDo: integrate the form on edit mode and display mode, with `Form` element
|-- component - tags: tag input field (hidden on display mode) and tag display field
|-- component - todos: state and text
|--- component - todos on edit mode: todos. Update todo state and text input to parent, and add a new todo input field
|---- component - todoState: click to change state, render state from parent