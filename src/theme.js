import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { createTheme } from '@mui/material'

const theme = createTheme({
  typography: {
    title: {
      fontSize: '3rem',
      fontWeight: 700,
      fontFamily: 'Open Sans'
    },
    header: {
      fontSize: '2rem',
      fontWeight: 600,
      fontFamily: 'Open Sans'
    },
    subHeader: {
      fontSize: '1.5rem',
      fontWeight: 500,
      fontFamily: 'Open Sans'
    },
    // button: {
    //   fontStyle: 'italic',
    // },
  },
  darkMode:{
    backgroundDark: '#0A1929',
    text: '#FFFFFF'
  },
  liteMode:{
    background: '#FFFFFF',
    text: '#0A1929'
  },
  palette: {
    primary: {
      light: '#D8F8F9',
      main: '#66DAED',
      dark: '#71DAEE',
      text: '#252F37',
      delete: '#E82525',
      error: '#FF0000',
      background: '#FFFFFF',
      textButton: '#383F48',
    },
    secondary: {
      main: '#71DAEE',
      text: '#95989A',
      background: '#F5F5F3',
      textButton: '#747474'
    },
    grey: {
      grey1: '#CCCCCC',
      grey2: '#F5F5F3',
      grey3: '#BDBDBD',
      grey4: '#a9a9a9',
      grey5: '#747474',
      grey6: '#252F37',
      grey7: '#DBDBDB',
      grey8: '#F5F5F5',
      grey9: '#95989A',
      grey10: '#ececec',
      grey11: '#C0C0C0',
      grey12: '#383F48',
      grey13: '#E4E4E5',
      grey14: '#7474744D',
      grey15: '#F8F8F8',
      grey16: '#9B9B9B',
      grey17: '#A3A3A3',
      grey18: '#555555',
      grey19: '#D3D3D3',
      grey20: '#E3ECFF',
      grey21: '#D5D5D5',
      grey22: '#F2F2F2',
      grey23: '#FAFAFA',
      grey24: '#8D8D8D',
      grey25: '#EBEBEB',
      grey26: '#858585',
      grey27: '#E9E9E9',
      grey28: '#EFEFEF',
      grey29: '#FBFBFB',
      grey30: '#EEF3FF',
      grey31: '#74747433',
      grey32: '#707070',
      grey33: '#616161',
      grey34: '#879596',
      grey35: '#DFDFDF',
      grey36: '#DBD6D6',
      grey37: '#F2F6FF',
      grey38: '#788097'
    },
    black: {
      black1: '#252F37',
      black2: '#212121',
      black3: '#262626',
      black4: '#000000',
      black5: '#242D49'
    },
    blue: {
      blue1: '#66DAED',
      blue2: '#00DBEE',
      blue3: '#E8F7F8',
      blue4: '#ECFCFE',
      blue5: '#0000ff',
      blue6: '#AEC8FF',
      blue7: '#3A7BFF',
      blue8: '#AA6BF7',
      blue9: '#8BEF93',
      blue10: '#71D8EA',
      blue11: '#3B7BFF',
      blue12: '#008080',
      blue13: '#3E79FB',
      blue14: '#0069D9',
      blue15: '#0062CC',
      blue16: '#005cbf',
      blue17: '#90CAF9',
      blue18: '#A0E7E5'
    },
    red: {
      red1: '#E57171FC',
      red2: '#E82525',
      red3: '#ED152F',
      red4: '#FF0000',
      red5: '#E11414',
      red6: '#FF9A9A',
      red7: '#E15597',
      red8: '#FF2979',
      red9: '#E53131',
      red10: '#ED4234',
      red11: '#E3462F',
      red12: '#F0142F',
      red13: '#ff6600',
      red14: '#BC2121',
      red15: '#EC73CF'
    },
    pink: {
      pink1: '#FF919D',
      pink2: '#F799A354'
    },
    green: {
      green1: '#34C219',
      green2: '#97DB35',
      green3: '#52D869',
      green4: '#80E1A6',
      green5: '#2E9F18',
      green6: '#01BC81',
      green7: '#3DD598',
      green8: '#008000',
      green9: '#47CE97'
    },
    white: {
      white1: '#FFFFFF',
      white2: '#F5F5F5',
      white3: '#F9FBFF',
      white4: '#F3F3F3'
    },
    common: {
      colorLightGrey: '#fafafa',
      boxShadowGrey: '#e3e3e3',
      lightGrey: '#a09797',
      darkGrey: '#383F48',
      green: '#34C219',
      yellow: '#ff6c5c',
      red: '#fcff5c',
      grey: '#E3E3E3'
    },
    violet: {
      violet1: '#A40BD1'
    },
    orange: {
      orange1: '#F1872B',
      orange2: '#FD7731',
      orange3: '#FCA61F'
    },
    yellow: {
      light1: '#FFFFCC',
      light2: '#FFFF99',
      light3: '#FFFF66',
      light4: '#FFFF33',
      normal: '#F2CD16',
      dark1: '#CCCC00',
      dark2: '#999900',
      dark3: '#666600',
      dark4: '#333300',
      dark5: '#EA9518',
      yellow1: '#F1CD15',
      yellow2: '#ED9710',
      yellow3: '#FEC62A',
      yellow4: '#DEB100',
      yellow5: '#F1CD34'
    },
    fontWeight: {
      UltraThin: 100,
      ExtraThin: 150,
      Thin: 200,
      ExtraLite: 250,
      Lite: 300,
      Book: 350,
      Text: 375,
      Normal: 400,
      Thick: 425,
      ExtraThick: 450,
      Dark: 500,
      ExtraDark: 550,
      Bold: 600,
      ExtraBold: 650,
      UltraBold: 700,
      Black: 800,
      ExtraBlack: 900,
      UltraBlack: 999
    }
  },
  // typography: {
  //   fontFamily: ['Poppins']
  // }
})

// theme.typography.h3 = {
//   fontSize: '1.2rem',
//   '@media (min-width:600px)': {
//     fontSize: '1.5rem',
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '0.5rem',
//   },
// }

export default theme
