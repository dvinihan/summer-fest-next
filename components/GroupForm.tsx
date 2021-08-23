import React, { MouseEventHandler, useState } from 'react';
import styled from 'styled-components';
import Group from '../models/Group';

const GroupFormContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

const StyledTitle = styled.h3`
  font-size: 16px;
  margin: 0 10px;
`;

interface Props {
  initialGroup?: Group;
  onSave: (group: Group) => void;
}

export const GroupForm = ({ initialGroup, onSave }: Props) => {
  const [group, setGroup] = useState(initialGroup ?? new Group());

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  const handleSave = () => onSave(group);

  return (
    <GroupFormContainer>
      <StyledTitle>Group Name:</StyledTitle>
      <input
        onChange={handleChange}
        value={group.group_name}
        name="group_name"
      />

      <StyledTitle>Leader Name:</StyledTitle>
      <input
        onChange={handleChange}
        value={group.leader_name}
        name="leader_name"
      />

      <button onClick={handleSave}>Save</button>
    </GroupFormContainer>
  );
};

export default GroupForm;
