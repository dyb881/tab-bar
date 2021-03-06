import React from 'react';
import classNames from 'classnames';

export type TTab = {
  Child: React.ComponentType<any>;
  render: (active: boolean) => React.ReactNode;
};

export type TTabBarProps = {
  tabs: TTab[];
  activeKey?: number;
  onChange?: (activeKey: number) => void;
  transition?: boolean;
  hide?: boolean;
};

type TChild = JSX.Element | undefined;

type TTabBarState = {
  childs: TChild[];
  activeKey: number;
};

/**
 * 移动端底部导航
 */
export default class TabBar extends React.Component<TTabBarProps, TTabBarState> {
  constructor(props: TTabBarProps) {
    super(props);
    const { tabs, activeKey = 0 } = props;
    const childs: TChild[] = tabs.map(() => undefined);
    const { Child } = tabs[activeKey];
    childs[activeKey] = <Child />;
    this.state = {
      childs,
      activeKey,
    };
  }

  getSnapshotBeforeUpdate() {
    const { childs } = this.state;
    const { activeKey = this.state.activeKey } = this.props;
    return !childs[activeKey];
  }

  componentDidUpdate(_prevProps: TTabBarProps, _prevState: TTabBarState, isNewChild: boolean) {
    if (isNewChild) {
      const { childs } = this.state;
      const { activeKey = this.state.activeKey } = this.props;
      const { Child } = this.props.tabs[activeKey];
      childs[activeKey] = <Child />;
      this.setState({ childs });
    }
  }

  onChange = (activeKey: number) => {
    const { onChange } = this.props;
    this.setState({ activeKey }, () => {
      onChange && onChange(activeKey);
    });
  };

  render() {
    const { tabs, transition, hide, activeKey = this.state.activeKey } = this.props;
    return (
      <div
        className={classNames('dyb-tab-bar-box', {
          'dyb-tab-bar-transition': transition,
          'dyb-tab-bar-hide': hide,
        })}
      >
        <div className="dyb-tab-bar-main">
          <div className="dyb-tab-bar-childs" style={{ width: `${tabs.length * 100}%`, left: `-${activeKey * 100}%` }}>
            {this.state.childs.map((i, k) => (
              <div key={k} className="dyb-tab-bar-item">
                {i}
              </div>
            ))}
          </div>
        </div>
        <div className="dyb-tab-bar-tabBar">
          {tabs.map((i, k) => (
            <div key={k} className="dyb-tab-bar-item" onClick={() => this.onChange(k)}>
              {i.render(activeKey === k)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
