export function getExampleText(entity: string) {
  switch (entity) {
    case 'meet':
      return 'meet <email@gmail.com> <title>';
    case 'date':
    case 'date_value':
      return ' date:16jan';
    case 'duration':
    case 'duration_value':
      return ' duration:30 (in minutes)';
    case 'time':
    case 'time_value':
      return ' time:16.30 (24hr format)';
    default:
      return 'example not available';
  }
}
