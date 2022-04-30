import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import theme from '../../theme'

export const CustomButton = styled(Button)(({
  textTransform,
  fontSize,
  padding,
  border,
  lineHeight,
  backgroundColor,
  borderColor,
  fontFamily,
  variant,
  color,
  width,
  fontWeight
}) => ({
  boxShadow: 'none',
  textTransform: textTransform || 'none',
  fontSize: fontSize || 16,
  padding: padding || '6px 12px',
  border: border || '1px solid',
  color: color || theme.liteMode.text,
  lineHeight: lineHeight || 1.5,  
  backgroundColor: (variant === 'outlined' && 'none') || backgroundColor || theme.palette.primary.main,
  borderColor: borderColor || theme.palette.primary.main,
  width: width || '32ch',
  fontWeight: fontWeight || theme.palette.fontWeight.Normal,
  textDecoration: 'none',
  fontFamily: fontFamily || [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: (variant === 'outlined' && 'none') || theme.palette.blue.blue14,
    borderColor: theme.palette.blue.blue17,
    borderWidth: 1,
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: (variant === 'outlined' && 'none') || theme.palette.blue.blue15,
    borderColor: theme.palette.blue.blue16,
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
}));
