export function setActiveUserClearance(clearance) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('clearance', clearance);
  }
}
export function getActiveUserClearance() {
  if (typeof window !== 'undefined') {
    return window.sessionStorage.getItem('clearance');
  }
  return undefined;
}

export function setActiveUserName(username) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('username', username);
  }
}
export function getActiveUserName() {
  if (typeof window !== 'undefined') {
    return window.sessionStorage.getItem('username');
  }
  return undefined;
}
