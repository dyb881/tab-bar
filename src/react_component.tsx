import React from 'react';
import classNames from 'classnames';

interface ITab {
  Child: React.ComponentClass<any>;
  render: (active: boolean) => React.ReactNode;
}

interface IProps {
  tabs: ITab[];
  activeKey?: number;
  onChange?: (activeKey: number) => void;
  transition?: boolean;
  hide?: boolean;
}

type TChild = JSX.Element | undefined;

interface IState {
  childs: TChild[];
  activeKey: number;
}

export default class extends React.Component<IProps, IState> {
  constructor(props: IProps) {
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
    const { childs, activeKey } = this.state;
    return !childs[activeKey];
  }

  componentDidUpdate(_prevProps: IProps, _prevState: IState, isNewChild: boolean) {
    if (isNewChild) {
      const { childs, activeKey } = this.state;
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
    const { tabs, transition, hide } = this.props;
    const { activeKey } = this.state;
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
