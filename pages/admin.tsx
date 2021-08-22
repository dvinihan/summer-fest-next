import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getActiveUserClearance } from '../helpers';
import getCsvFile from '../helpers/getCsvFile';
import Camper from '../models/Camper';
import Group from '../models/Group';
import User from '../models/User';

const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const AdminLink = styled(Link)`
  color: rgb(35, 61, 211);
`;
const AdminTable = styled.table`
  border: 2px solid black;
  margin-bottom: 10px;
`;
const TableHeaderRow = styled.tr`
  background-color: rgb(179, 173, 173);
`;
const TableRow = styled.tr`
  background-color: rgb(226, 236, 132);
`;
const TableHeader = styled.th`
  padding: 8px;
  font-size: 18px;
`;
const TableData = styled.td`
  padding: 8px;
  font-size: 18px;
`;
const CenteredH4 = styled.h4`
  text-align: center;
`;

interface Props {
  campers: Camper[];
  groups: Group[];
  users: User[];
}

const Admin = ({ campers = [], groups = [], users = [] }: Props) => {
  const router = useRouter();

  const handleDownloadClick = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        getCsvFile({ groups, campers, users, isAdmin: true })
      )}`
    );
    element.setAttribute('download', 'registration-data.csv');
    element.style.display = 'none';
    if (typeof element.download !== 'undefined') {
      // browser has support - process the download
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // const activeUserClearance = getActiveUserClearance();
  // if (typeof window !== 'undefined' && activeUserClearance !== 'admin') {
  //   router.replace('/');
  //   return null;
  // }

  console.log(users);

  return (
    <AdminContainer>
      <AdminTable>
        <tbody>
          <TableHeaderRow>
            <TableHeader />
            <TableHeader>Group Name</TableHeader>
            <TableHeader>Leader</TableHeader>
          </TableHeaderRow>

          {groups.map((group) =>
            group.id === 1 ? null : (
              <TableRow key={group.id}>
                <TableData>
                  <AdminLink href="/groupEdit">Edit</AdminLink>
                </TableData>
                <TableData>{group.group_name}</TableData>
                <TableData>{group.leader_name}</TableData>
              </TableRow>
            )
          )}
        </tbody>
      </AdminTable>

      <CenteredH4>
        <AdminLink href="/groupAdd">Add a Group</AdminLink>
      </CenteredH4>

      <CenteredH4>
        <AdminLink href="/userAdd">Add a User</AdminLink>
      </CenteredH4>

      <CenteredH4>
        <AdminLink href="/users">View All Users</AdminLink>
      </CenteredH4>

      <CenteredH4>
        <button onClick={handleDownloadClick} type="button">
          Download All Data
        </button>
      </CenteredH4>
    </AdminContainer>
  );
};

export async function getStaticProps() {
  const { BASE_URL } = process.env;

  const res = await fetch(`${BASE_URL}/api/allData`);
  const json = await res.json();

  return {
    props: json,
  };
}

export default Admin;
