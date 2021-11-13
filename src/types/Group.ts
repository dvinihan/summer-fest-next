export class Group {
  id: number;
  group_name: string;
  leader_name: string;

  constructor(props: any = {}) {
    this.id = props.id;
    this.group_name = props.group_name || '';
    this.leader_name = props.leader_name || '';
  }
}
