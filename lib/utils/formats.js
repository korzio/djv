module.exports = {
  alpha: '!/^[a-zA-Z]+$/.test(%s)',
  alphanumeric: '!/^[a-zA-Z0-9]+$/.test(%s)',
  identifier: '!/^[-_a-zA-Z0-9]+$/.test(%s)',
  hexadecimal: '!/^[a-fA-F0-9]+$/.test(%s)',
  numeric: '!/^[0-9]+$/.test(%s)',
  'date-time': 'isNaN(Date.parse(%s)) || ~%s.indexOf(\'/\')',
  uppercase: '%s !== %s.toUpperCase()',
  lowercase: '%s !== %s.toLowerCase()',
  hostname: '%s.length >= 256 || !/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])(\\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9]))*$/.test(%s)',
  uri: '!/[-a-zA-Z0-9@:%_\\+.~#?&//=]{2,256}\\.[a-z]{2,4}\\b(\\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?/.test(%s)',
  email: '!/^[^@]+@[^@]+\\.[^@]+$/.test(%s)',
  ipv4: '!/^(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}$/.test($1) || $1.split(".")[3] > 255',
  ipv6: '!/^((?=.*::)(?!.*::.+::)(::)?([\\dA-F]{1,4}:(:|\\b)|){5}|([\\dA-F]{1,4}:){6})((([\\dA-F]{1,4}((?!\\3)::|:\\b|$))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})$/.test(%s)'
};
