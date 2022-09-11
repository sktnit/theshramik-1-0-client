import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Container from '@material-ui/core/Container'
import IconOverview from '../../Icons/icon_overview.svg'
import MyProfileNew from './MyProfileNew'

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginBottom: '20px',
    '& button ': {
      height: '50px',
      margin: 0,
      padding: 0,
      marginRight: '15px'
    },
    "& button[aria-selected='true']": {
      border: 'none',
      borderBottom: `1px solid ${theme.palette.primary.main} !important`
    },
    "& button[aria-selected='false']": {},
    '& .MuiTab-root ': {
      minWidth: 'auto'
    }
  },
  container: {
    '& .MuiTab-wrapper': {
      flexDirection: 'row',
      justifyContent: 'left',
      textTransform: 'capitalize'
    },
    '& .MuiTab-labelIcon': {
      minHeight: '0px'
    },
    '& .MuiTab-labelIcon .MuiTab-wrapper > *:first-child': {
      margin: '0px 4px 0px 0px'
    }
  },
  tabIcon: {
    height: '20px'
  },
  selectedTabItem: {
    border: 'none',
    borderBottom: `3px solid ${theme.palette.primary.main} !important`
  },
  tabItem: {},
  tab: {
    color: theme.palette.primary.text,
    textTransform: 'capitalize',
    position: 'relative'
  }
}))

export default function Insight () {
  const classes = useStyles()
  const [value, setValue] = useState(0)
  const OverviewIcon = () => {
    return <img src={IconOverview} />
  }
  const tabIcons = [<OverviewIcon key='overviewIcon' />]
  const tabs = ['My Details']

  return (
    <Container className={classes.container}>
      <Tabs
        value={value}
        TabIndicatorProps={{
          style: {
            display: 'none',
            width: 50,
            margin: 0,
            padding: 0
          }
        }}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
        className={classes.tabs}>
        {tabs.map((el, ind) => (
          <Tab key={ind} label={<span className='font-family-semi-bold-16'>{el}</span>} icon={tabIcons[ind]} id={ind} value={ind} className={classes.tab} />
        ))}
      </Tabs>
      {value === 0 && <MyProfileNew />}
      {/* {value === 1 && <Notifications component={'profile settings'} />} */}
    </Container>
  )
}
