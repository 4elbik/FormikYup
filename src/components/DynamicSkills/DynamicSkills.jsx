/* eslint-disable react/destructuring-assignment */

import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './DynamicSkills.css';

class DynamicInput extends React.Component {
  onPressEnter = (evt) => {
    evt.preventDefault();
    this.props.onAddSkill();
  };

  render() {
    const { skills, onAddSkill, onUpdateSkill, onRemoveSkill } = this.props;

    return (
      <div className="dynamic-input">
        <div className="dynamic-input__label">Skills :</div>
        {skills.map(({ name, id }) => (
          <div key={id} className="dynamic-input__item">
            <Input
              className="dynamic-input__input"
              value={name}
              onPressEnter={this.onPressEnter}
              onChange={(evt) => onUpdateSkill(id, evt.target.value)}
            />
            {skills.length > 1 ? (
              <MinusCircleOutlined
                className="dynamic-input__del"
                onClick={() => onRemoveSkill(id)}
              />
            ) : null}
          </div>
        ))}

        <Button type="dashed" className="dynamic-input__add" onClick={onAddSkill}>
          <PlusOutlined /> Add skill
        </Button>
      </div>
    );
  }
}

DynamicInput.propTypes = {
  skills: PropTypes.instanceOf(Array).isRequired,
  onAddSkill: PropTypes.func.isRequired,
  onUpdateSkill: PropTypes.func.isRequired,
  onRemoveSkill: PropTypes.func.isRequired,
};

export default DynamicInput;
