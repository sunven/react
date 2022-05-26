/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactNoopUpdateQueue from './ReactNoopUpdateQueue';
import assign from 'shared/assign';

const emptyObject = {};
if (__DEV__) {
  Object.freeze(emptyObject);
}

/**
 * 用于更新组件状态的基类助手。
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // 如果一个组件有string refs，我们稍后会分配一个不同的对象。
  this.refs = emptyObject;
  // 我们初始化了默认的更新器，但真正的更新器被渲染器注入
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

/**
 * 总是用它来改变state。 您应该将 `this.state` 视为不可变的。
 *
 * 不能保证 `this.state` 会立即更新，所以调用此方法后访问 `this.state` 可能会返回旧值。
 *
 * 不能保证对 `setState` 的调用会同步运行，因为它们最终可能会被批量处理。
 * 您可以提供一个可选的回调，该回调将在对 setState 的调用实际完成时执行。
 *
 * 当一个函数被提供给 setState 时，它将在未来的某个时间点被调用（不是同步的）。
 * 它将以最新的方式调用组件参数（state, props, context）。 这些值可能与 this 不同，
 * 因为您的函数可能在 receiveProps 之后但在 shouldComponentUpdate 之前调用，
 * 并且这个new state、props, context还不会分配给 this。
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function(partialState, callback) {
  if (
    typeof partialState !== 'object' &&
    typeof partialState !== 'function' &&
    partialState != null
  ) {
    throw new Error(
      'setState(...): takes an object of state variables to update or a ' +
        'function which returns an object of state variables.',
    );
  }

  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * 强制更新。只有当确定我们不在DOM事务中时，才应调用此命令
 *
 * 当您知道组件状态的某些深层次方面已更改，但未调用“setState”时，您可能希望调用此函数
 *
 * 这不会调用“shouldComponentUpdate”，但会调用“componentWillUpdate”和“componentdiddupdate”`
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
if (__DEV__) {
  const deprecatedAPIs = {
    isMounted: [
      'isMounted',
      'Instead, make sure to clean up subscriptions and pending requests in ' +
        'componentWillUnmount to prevent memory leaks.',
    ],
    replaceState: [
      'replaceState',
      'Refactor your code to use setState instead (see ' +
        'https://github.com/facebook/react/issues/3236).',
    ],
  };
  const defineDeprecationWarning = function(methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function() {
        console.warn(
          '%s(...) is deprecated in plain JavaScript React classes. %s',
          info[0],
          info[1],
        );
        return undefined;
      },
    });
  };
  for (const fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

// dummy:假的
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 * 对 sCU 具有默认浅层相等检查的便利组件。
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// 避免这些方法的额外原型跳转。 Object.assign()
// 即：Component.prototype的方法可以直接在pureComponentPrototype上找到，不用顺着__proto__往上找
assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

export {Component, PureComponent};
