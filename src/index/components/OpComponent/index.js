import React, {Component} from 'react';
import autobind from 'class-autobind';
import {Modal, Form, Input} from 'antd';
import TagComponent from 'TagComponent';
import './index.css';

const FormItem = Form.Item;
const prefixCls = 'op-component';
class OPComponent extends Component {
  constructor(props) {
    super(props);
    autobind(this, OPComponent.prototype);
    this.state = {};
    this.formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 15}
    };
  }

  componentDidMount() { // 赋初值
    const {form} = this.props;
    const {id} = this.props.selectedItem;
    form.setFieldsValue({
      id
    });
  }

  getTagValues() {
    // Form包裹的组件无法通过ref获取子组件的function，这里直接调用子组件Form获取数据的方法
    let tagValues;
    this.tagRef.validateFields((err, values) => {
      if (!err) {
        tagValues = values;
      }
    });
    return tagValues;
  }
  getValues() {
    let newValues;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        newValues = values;
      }
    });
    return newValues;
  }
  handleOk() {
    const newValues = this.getValues();
    const tagValues = this.getTagValues();
    const {isEdit, selectedItem} = this.props;
    if (newValues && tagValues) {
      const {id} = newValues;
      const newItem = {
        id,
        tag: {}
      };
      if (tagValues.formTag) {
        const {formTag} = tagValues;
        const formTagLength = formTag.length;
        for (let i = 0; i < formTagLength; i += 2) {
          if (formTag[i]) {
            newItem.tag[formTag[i]] = formTag[i + 1];
          }
        }
      }
      newItem.tag = JSON.stringify(newItem.tag);
      if (isEdit) {
        newItem.id = selectedItem.id;
      }
      this.props.handleOpSure(isEdit, newItem);
    }
  }
  render() {
    const {isEdit, selectedItem} = this.props;
    const {tag} = selectedItem;
    const {getFieldDecorator} = this.props.form;
    return (
        <div className={`${prefixCls}`}>
            <Modal
                title={isEdit ? 'Edit' : 'Add'}
                okText='sure'
                cancelText='cancel'
                width={550}
                visible={true}
                onOk={this.handleOk}
                onCancel={this.props.handleOpCancel}
            >
                <Form>
                    <FormItem
                        {...this.formItemLayout}
                        label='id'
                    >
                        {getFieldDecorator('id', {
                          rules: [{
                            required: true,
                            message: 'Required,(Supports letters, numbers, dot (.), underscore (_), and dash(-). No more than 50 characters)',
                            whitespace: true,
                            // eslint-disable-next-line no-useless-escape
                            pattern: /^[A-Za-z0-9_\.-]{0,50}$/g
                          }]
                        })(
                            <Input placeholder='Enter ID' disabled={isEdit} />
                        )}
                    </FormItem>
                </Form>
                <TagComponent
                    tag={tag}
                    label='Tag'
                    ref={ref => (this.tagRef = ref)}
                />
            </Modal>
        </div>
    );
  }
}

export default Form.create()(OPComponent);
