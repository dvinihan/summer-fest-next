class User {
  group_id: number;
  username: string;

  constructor(props: any = {}) {
    this.group_id = props.group_id;
    this.username = props.username;
  }
}

export default User;
