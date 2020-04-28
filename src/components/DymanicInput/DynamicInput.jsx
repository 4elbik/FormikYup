import React from 'react';
import { Form, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './DynamicInput.css';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 0 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

class DynamicInput extends React.Component {
  constructor(props) {
    super(props);
    this.addSkillRef = React.createRef();
    this.submitSkillsRef = React.createRef();
  }

  componentDidMount() {
    this.addSkillRef.current.props.onClick();
  }

  onBlurInput = () => {
    this.submitSkillsRef.current.buttonNode.click();
  }

  render() {
    const { onChangeRegister } = this.props;

    return (
      <Form className="dynamic-input" name="dynamic_form_item" {...formItemLayoutWithOutLabel} onFinish={({ skills }) => onChangeRegister(skills)}>
        <Form.List name="skills">
          {(fields, { add, remove }) => {
            return (
              <div className="dynamic-input__fields-wrapper">
                <div className="dynamic-input__fields">
                {fields.map((field, index) => (
                  <Form.Item
                    className="dynamic-input__field-item"
                    label={index === 0 ? 'Skills' : null}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please input your skill or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="Your skill" name="skill" onBlur={this.onBlurInput} style={{ width: '90%' }} />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{ margin: '0 8px' }}
                        onClick={async () => {
                          await remove(field.name);
                          this.onBlurInput();
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                </div>
                <div className="dynamic-input__add-skill">
                  <Form.Item>
                    <Button
                      id="add-skill"
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      style={{ width: '60%' }}
                      ref={this.addSkillRef}
                    >
                      <PlusOutlined /> Add skill
                    </Button>
                  </Form.Item>
                </div>
              </div>
            );
          }}
        </Form.List>

        <Form.Item className="visually-hidden">
          <Button type="primary" htmlType="submit" ref={this.submitSkillsRef}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
};

export default DynamicInput;