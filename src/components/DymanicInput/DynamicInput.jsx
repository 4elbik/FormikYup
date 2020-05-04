/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { uniqueId, findIndex } from 'lodash';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './DynamicInput.css';

class DynamicInput extends React.Component {
  state = {
    skills: [{ name: '', id: uniqueId() }],
    resetSkills: false,
  };

  handleAddSkill = () => {
    const newSkill = { name: '', id: uniqueId() };
    this.setState((state) => ({ skills: [...state.skills, newSkill] }));
  };

  handleRemoveSkill = async (removeId) => {
    await this.setState(({ skills }) => {
      return { skills: skills.filter(({ id }) => id !== removeId) };
    });

    this.props.onUpdateSkills(this.state.skills);
  };

  handleChangeSkill = (updateId) => async (evt) => {
    const { value } = evt.target;
    await this.setState(({ skills }) => {
      const updateElemIdx = findIndex(skills, (skill) => skill.id === updateId);
      const newSkills = skills;
      newSkills[updateElemIdx].name = value;
      return { skills: newSkills };
    });

    this.props.onUpdateSkills(this.state.skills);
  };

  handleResetSkills = async (reset) => {
    this.setState((state) => {
      const { resetSkills } = state;
      const newState = {};
      if (reset && !resetSkills) {
        newState.resetSkills = true;
        newState.skills = [{ name: '', id: uniqueId() }];
      }
      return newState;
    });
    setTimeout(() => {
      this.setState({ resetSkills: false });
    }, 500);

    this.props.onUpdateSkills(this.state.skills);
  };

  render() {
    const { skills, resetSkills } = this.state;
    const { reset } = this.props;
    if (reset && !resetSkills) {
      this.handleResetSkills(reset);
    }

    return (
      <div className="dynamic-input">
        <div className="dynamic-input__label">Skills :</div>
        {skills.map(({ skill, id }) => (
          <div key={id} className="dynamic-input__item">
            <Input
              className="dynamic-input__input"
              onChange={this.handleChangeSkill(id)}
              value={skill}
            />
            {skills.length > 1 ? (
              <MinusCircleOutlined
                className="dynamic-input__del"
                onClick={() => this.handleRemoveSkill(id)}
              />
            ) : null}
          </div>
        ))}

        <Button type="dashed" className="dynamic-input__add" onClick={this.handleAddSkill}>
          <PlusOutlined /> Add skill
        </Button>
      </div>
    );
  }
}

DynamicInput.propTypes = {
  onUpdateSkills: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
};

export default DynamicInput;
