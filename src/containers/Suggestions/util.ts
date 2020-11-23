export function getExampleText(entity: string) {
  switch (entity) {
    case 'meet':
      return 'meet <meeting_title> <args>';
    case 'date':
    case 'date_value':
      return ' date:16jan';
    case 'duration':
    case 'duration_value':
      return ' duration:30 (in minutes)';
    case 'time':
    case 'time_value':
      return ' time:16.30 (24hr format)';
    case 'login':
      return 'login <you@gmail.com>';
    case 'email':
      return 'with:jane@doe.com,john@doe.com';
    case 'auth':
      return 'auth:your@gmail.com';
    default:
      return 'example not available';
  }
}
