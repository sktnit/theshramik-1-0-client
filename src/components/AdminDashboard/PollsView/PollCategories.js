import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import constants from '../../../constants/constants'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import NoItem from '../../../layout/NoItem'
import { Translate } from 'react-auto-translate'
import Loading from '../../../layout/Loading'
import ListItemButton from '@mui/material/ListItemButton'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '16px',
    '& .MuiButton-contained': {
      backgroundColor: '#F2F6FF',
      color: theme.palette.primary.main,
      textTransform: 'none',
      boxShadow: '0 0 0 0',
      borderRadius: '20px'
    },
    '& .MuiButton-root:hover': {
      backgroundColor: '#F2F6FF',
      color: theme.palette.primary.main,
      boxShadow: '0 0 0 0'
    },
    '& .MuiListItemText-root': {
      margin: 0
    },
    '& .MuiTypography-root': {
      color: theme.palette.primary.text
    },
    '& .MuiList-root': {
      maxHeight: 'calc(100vh - 282px)',
      overflowY: 'auto',
      paddingBottom: 0
    },
    '& .MuiListItem-root': {
      padding: 0
    },
    '& .MuiListItemButton-root.Mui-selected': {
      backgroundColor: 'transparent',
      '& .MuiTypography-root': {
        color: theme.palette.primary.text
      }
    }
  },
  list: {
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#DFDFDF',
      borderRadius: '15px'
    }
  }
}))

function PollCategories (props) {
  const classes = useStyles()
  const { pollTags, waitingForPollTagAPI, selectedTags, selectPollCategory, myPollsMenuItem, selectedMenuIndex, handleSelectMyPollMenu } = props
  return (
    <div className={classes.root}>
      {/* <Button variant="contained" size="small">Recommended for you</Button> */}
      {props.tabValue === 0
        ? <List className={classes.list} dense>
          {!waitingForPollTagAPI
            ? (pollTags.length !== 0
                ? pollTags.map((el, index) => <ListItem key={index}>
                <ListItemButton selected={(selectedTags && selectedTags.length === 0 && el.id === constants.SHOW_ALL_POLL.id) || selectedTags.includes(el.name)} onClick={() => selectPollCategory(el.name)}>
                  <ListItemText
                    primary={<span className={(selectedTags && selectedTags.length === 0 && el.id === constants.SHOW_ALL_POLL.id) || selectedTags.includes(el.name) ? 'font-family-semi-bold-15' : 'font-family-normal-15'}>{el.name}</span>}
                  />
                </ListItemButton>
              </ListItem>)
                : <NoItem message={<Translate>No tags!</Translate>} />)
            : <Loading />}
        </List>
        : <List className={classes.list} dense>
          {myPollsMenuItem.map((el, index) => <ListItem key={index}>
            <ListItemButton selected={selectedMenuIndex === index} onClick={() => handleSelectMyPollMenu(index)}>
              <ListItemText
                primary={<span className={selectedMenuIndex === index ? 'font-family-semi-bold-15' : 'font-family-normal-15'}>{el}</span>}
              />
            </ListItemButton>
          </ListItem>)}
        </List>}
    </div>
  )
}

PollCategories.propTypes = {
  pollTags: PropTypes.array,
  waitingForPollTagAPI: PropTypes.bool,
  selectedTags: PropTypes.array,
  selectPollCategory: PropTypes.func,
  myPollsMenuItem: PropTypes.array,
  selectedMenuIndex: PropTypes.number,
  handleSelectMyPollMenu: PropTypes.func,
  tabValue: PropTypes.number
}

export default memo(PollCategories)
