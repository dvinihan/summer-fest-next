class User {
  app_metadata: any;
  created_at: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  identities: any[];
  last_login: string;
  locale: string;
  logins_count: number;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  user_metadata: { group_id: number };

  constructor(props: any = {}) {
    this.app_metadata = props.app_metadata;
    this.created_at = props.created_at || '';
    this.email = props.email || '';
    this.email_verified = props.email_verified;
    this.family_name = props.family_name || '';
    this.given_name = props.given_name || '';
    this.identities = props.identities || [];
    this.last_login = props.last_login || '';
    this.locale = props.locale || '';
    this.logins_count = props.logins_count || 0;
    this.name = props.name || '';
    this.nickname = props.nickname || '';
    this.picture = props.picture || '';
    this.updated_at = props.updated_at || '';
    this.user_id = props.user_id || '';
    this.user_metadata = props.user_metadata;
  }
}

export default User;
