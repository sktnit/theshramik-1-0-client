export const constants = {
  REGISTER_STEPS: [
    {
      id: 0,
      label: 'Select User Type',
      icon: 'USER_TYPE_ICON'
    },
    {
      id: 1,
      label: 'Build Your Profile',
      icon: 'USER_TYPE_ICON'
    },
    {
      id: 2,
      label: 'Confirm',
      icon: 'SETTINGS_ICON'
    }
  ],
  EMPLOYEE: 'Employee',
  EMPLOYER: 'Employer',
  
  USER_TYPES: {
    'EMPLOYEE': '0',
    'EMPLOYER': '1'
  },
  USER_TYPES_NUM_TO_TEXT_MAPPING:{
    '0': 'Employee',
    '1': 'Employer'
  }
}