/**
 *填写tag的Form表单组件，需要提供的props为tag和label，tag格式如下
 * [{tagLabel:'label',tagValue:'value'}], 使用示例：
 * <TagComponent
 *    tag={tag}
 *    ref={ref => (this.tagRef = ref)}
 * />
 * 获取Form表单数据
 * 在使用TagComponent的组件中定义如下方法：
 * getTagValues(){
 *        // Form包裹的组件无法通过ref获取子组件的function，这里直接调用子组件Form获取数据的方法
 *        let tagValues;
 *        this.tagRef.validateFields((err, values) => {
 *            if (!err) {
 *                tagValues = values;
 *            }
 *        });
 *        return tagValues;
 *    }
 * 值的格式为
 * {formTag: ["label1", "value1", "label2", "value2"],keys:  [0, 1, 2, 3]}
 * smk
 */
import React, {Component} from 'react';
import autobind from 'class-autobind';
import {Form, Input, Row, Col, Tooltip, Icon} from 'antd';
import './index.css';

const FormItem = Form.Item;
const prefixCls = 'tag-component';

class TagComponent extends Component {
  constructor(props) {
    super(props);
    autobind(this, TagComponent.prototype);
    this.state = {};
    this.formItemHasLabel = {
      labelCol: {span: 12},
      wrapperCol: {span: 12}
    };
    this.formItemHasLabelPosition = {
      labelCol: {span: 0},
      wrapperCol: {span: 12, offset: 12}
    };
    this.formItemNoLabel = {
      labelCol: {span: 2},
      wrapperCol: {span: 18}
    };
    this.uuid = 0;
  }
  /* componentDidMount(){ // 换willMount区分注册和赋值
        const {tag, form} = this.props;
        const keys = form.getFieldValue('keys');
        let nextKeys = keys;
        for(let i = 0; i < tag.length; i ++){
            nextKeys = nextKeys.concat([this.uuid, this.uuid + 1]);
            this.uuid = this.uuid + 2;

        }
        form.setFieldsValue({
            'keys': nextKeys
        });
    } */
  componentDidMount() { // 换DidMount区分注册和赋值
    const {tag, form} = this.props;
    let formTag = [];
    for (let i = 0; i < tag.length; i ++) {
      formTag = formTag.concat([tag[i].tagLabel, tag[i].tagValue]);
    }
    form.setFieldsValue({
      formTag
    });
  }

  getInitialKeys() {
    const {tag} = this.props;
    let nextKeys = [];
    for (let i = 0; i < tag.length; i ++) {
      nextKeys = nextKeys.concat([this.uuid, this.uuid + 1]);
      this.uuid = this.uuid + 2;
    }
    return nextKeys;
  }
  addTag() {
    const {form} = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat([this.uuid, this.uuid + 1]);
    this.uuid = this.uuid + 2;
    form.setFieldsValue({
      keys: nextKeys
    });
  }
  removeTag(index) {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 0) {
      return;
    }
    // can use data-binding to set
    keys.splice(index - 1, 2);
    form.setFieldsValue({
      keys
    });
  }

  renderTagFormItems() {
    const {label} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const initKeys = getFieldValue('keys');
    const InitialKeys = initKeys || this.getInitialKeys();
    getFieldDecorator('keys', {initialValue: InitialKeys});
    const formItemHasLabel = this.formItemHasLabel;
    const formItemNoLabel = this.formItemNoLabel;
    const formItemHasLabelPosition = this.formItemHasLabelPosition;
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
        <Col span={index % 2 === 0 ? 14 : 10} key={k}>
            <FormItem
          // eslint-disable-next-line no-nested-ternary
                {...(index % 2 === 1 ? formItemNoLabel : index === 0 ? formItemHasLabel : formItemHasLabelPosition)}
          // eslint-disable-next-line no-nested-ternary
                label={index === 0 ? label : index % 2 === 0 ? '' : ' '}
                required={false}
                key={k}
            >
          {getFieldDecorator(`formTag[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: index % 2 === 0 ? [{
              required: true,
              whitespace: true,
              message: 'Required, Supports letters, numbers, dot (.), underscore (_), and dash(-). No more than 50 characters',
              pattern: /^[A-Za-z0-9_.-]{0,50}$/g
            }] : [{
              required: true,
              whitespace: true,
              message: 'Required, No more than 100 characters',
              max: 200
            }]
          })(
              <Input
                  placeholder={index % 2 === 0 ? 'Key' : 'Value'}
                  className={index % 2 === 0 ? `${prefixCls}-input-left` : `${prefixCls}-input-right`}
              />
          )}
          {keys.length > 0 && index % 2 === 1 ? (
              <a href='javascript:;' className={`${prefixCls}-remove-btn`}>
                  <Tooltip placement='top' title={'Delete'}>
                      <Icon type='minus-circle' onClick={() => this.removeTag(index)} />
                  </Tooltip>
              </a>
          ) : null}
            </FormItem>
        </Col>
    )
    );
    return formItems;
  }
  render() {
    const {getFieldValue} = this.props.form;
    const keys = getFieldValue('keys');
    const {label} = this.props;
    const formItemLayout = keys && keys.length !== 0 ? this.formItemHasLabelPosition : this.formItemHasLabel;
    return (
        <Form>
            <Row>
              {this.renderTagFormItems()}
                <Col span={14} style={{textAlign: 'center'}}>
                    <FormItem
                        {... formItemLayout}
                      // eslint-disable-next-line no-nested-ternary
                        label={keys && keys.length !== 0 ? '' : label}
                    >
                        <div className={`${prefixCls}-add-box`}>
                            <span className={`${prefixCls}-add-btn`} onClick={this.addTag}>
                                <Icon className={`${prefixCls}-icon`} type='plus-circle' />
                                <span className={`${prefixCls}-add-btn-text`}>Add Tag</span>
                            </span>
                        </div>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
  }
}

export default Form.create()(TagComponent);
