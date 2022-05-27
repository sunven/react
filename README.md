# Getting Started with Create React App

<https://zh-hans.reactjs.org/docs/how-to-contribute.html#development-workflow>

<https://github.com/bubucuo/DebugReact>

## 环境准备

1、create-react-app 创建项目
2、yarn ject
3、react 源码放到src目录中

## 配置修改

### config/env.js

stringified 增加

``` js
__DEV__: true,
__PROFILE__: true,
__UMD__: true,
__EXPERIMENTAL__: true,
__VARIANT__: false,
```

### config/webpack.config.js

alias 增加 (参考webpack.config.js文件)

### src/react/.eslintrc.js

- 注释 react-internal 相关
- 注释 no-for-of-loops 相关
- 注释 no-function-declare-after-return 相关
- `extends: ['fbjs', 'prettier']` 改为 `extends: []`

### src/react/packages/scheduler/index.js

增加：

```js
export {
  unstable_flushAllWithoutAsserting,
  unstable_flushNumberOfYields,
  unstable_flushExpired,
  unstable_clearYields,
  unstable_flushUntilNextPaint,
  unstable_flushAll,
  unstable_yieldValue,
  unstable_advanceTime,
  unstable_setDisableYieldValue,
} from './src/forks/SchedulerMock';
```

### src/react/packages/shared/ReactSharedInternals.js

修改为:

```js
import ReactSharedInternals from '../react/src/ReactSharedInternals';

export default ReactSharedInternals;
```

### src/react/packages/react-reconciler/src/ReactFiberHostConfig.js

修改为

```js
export * from './forks/ReactFiberHostConfig.dom';
```
