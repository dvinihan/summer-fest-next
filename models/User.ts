class User {
  id: number;
  group_id: number;
  username: string;
  status: string;

  constructor(props: any = {}) {
    this.id = props.id;
    this.group_id = props.group_id;
    this.username = props.username || '';
    this.status = props.status || '';
  }
}

export default User;
