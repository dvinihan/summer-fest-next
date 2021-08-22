class Camper {
  constructor(props = {}) {
    this.first_name = props.first_name;
    this.last_name = props.last_name;
    this.gender = props.gender;
    this.birthday = props.birthday;
    this.grade_completed = props.grade_completed;
    this.allergies = props.allergies;
    this.parent_email = props.parent_email;
    this.emergency_name = props.emergency_name;
    this.emergency_number = props.emergency_number;
    this.roommate = props.roommate;
    this.notes = props.notes;
    this.registration = props.registration;
    this.signed_status = props.signed_status;
    this.signed_by = props.signed_by;
    this.room = props.room;
    this.adult_leader = props.adult_leader;
    this.student_leadership_track = props.student_leadership_track;
    this.camp_attending = props.camp_attending;
    this.covid_image_type = props.covid_image_type;
    this.covid_image = props.covid_image;
  }
}

export default Camper;
