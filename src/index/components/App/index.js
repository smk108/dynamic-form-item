import React, {Component} from 'react';
import autobind from 'class-autobind';
import {observable, action} from 'mobx';
import {inject, observer} from 'mobx-react';
import {Table, Button, Icon} from 'antd';
import OPComponent from '../OPComponent';
import './index.css';

const prefixCls = 'app-content';
const newRank = {id: '', tag: []};

@inject('mainStore')
@observer
export default class App extends Component{
    constructor(props){
      super(props);
      autobind(this, App.prototype);
      this.state = {};
      this.columns = this.getColumns();
    }

  getColumns() {
    return [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => <span title={text}>{text}</span>
    }, {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      render: text => {
        const showText = this.processTag(text);
        return (
            <span title={showText}>{showText}</span>);
      }
    }, {
      title: 'OP',
      key: 'action',
      render: record => (
          <span>
              <a href='javascript:;' onClick={() => this.handleEdit(record)}>
                  <Icon className='op_icon' type='edit' />
              </a>
              <a href='javascript:;' onClick={() => this.handleDelete(record)}>
                  <Icon className='op_icon' type='delete' />
              </a>
          </span>)
    }];
  }

  processTag(tag) {
    if (!tag || tag.length === 0) {
      return '';
    }
    const tagObj = {};
    tag.forEach(item => {
      tagObj[item.tagLabel] = item.tagValue;
    });
    // eslint-disable-next-line no-useless-escape
    return JSON.stringify(tagObj).replace(/\"/g, '');
  }

  @observable showOperationModal=false;
  @observable isEdit=false;
  @observable selectedItem={};

  @action handleAdd() {
    this.showOperationModal = true;
    this.isEdit = false;
    this.selectedItem = newRank;
  }
  @action handleEdit(record) {
    this.showOperationModal = true;
    this.isEdit = true;
    this.selectedItem = record;
  }
  handleOpSure(isEdit, item) {
    if (isEdit) {
      this.props.mainStore.handleOP(item, 'edit', this.handleOpCancel);
    } else {
      this.props.mainStore.handleOP(item, 'add', this.handleOpCancel);
    }
  }
  handleDelete(record){
    this.props.mainStore.handleDelete(record);
  }
  @action handleOpCancel() {
    this.showOperationModal = false;
  }
  render() {
    const {dataSource} = this.props.mainStore;
    const tableDataSource = dataSource.slice();
    const {showOperationModal, isEdit, selectedItem} = this;
    return (
        <div className={`${prefixCls}`}>
            <div className={`${prefixCls}-header`}>
                <Button
                    className={`${prefixCls}-header-btn`}
                    type='primary'
                    onClick={this.handleAdd}
                >Add</Button>
            </div>
            <Table columns={this.columns} dataSource={tableDataSource} />
            {showOperationModal ?
                <OPComponent
                    isEdit={isEdit}
                    selectedItem={selectedItem}
                    handleOpSure={this.handleOpSure}
                    handleOpCancel={this.handleOpCancel}
                /> : ''
            }
        </div>
    );
  }
}
