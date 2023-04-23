import React, { memo, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Translate } from 'react-auto-translate'
import PropTypes from 'prop-types'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import TeamContext from '../../../context/TeamContext'

const useStyles = makeStyles((theme) => ({
  UserInfoCardRoot: {
    '& .MuiListItem-root': {
      paddingLeft: '0px',
      paddingRight: '8px'
    },
    '& .MuiTypography-body1': {
      color: theme.palette.primary.text
    }
  },
  avatarBorderSolid: {
    border: `solid 2px ${theme.palette.primary.main}`
  }
}))

function UserInfoCard (props) {
  const classes = useStyles()
  const teamData = useContext(TeamContext)
  return (
    <div className={classes.UserInfoCardRoot}>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt="profile-pic" src={props.isAnonymous ? teamData && teamData.anonymousIconUrls && teamData.anonymousIconUrls.anonymous ? teamData.anonymousIconUrls.anonymous : '' : props.profilePic || ''} className={`${classes.avatar} ${props.isAnonymous ? classes.avatarBorderSolid : ''}`} />
        </ListItemAvatar>
        <ListItemText
          primary={<span className='font-family-lite-15'><Translate>{props.createdByName || ''}</Translate></span>}
        />
      </ListItem>
    </div>
  )
}

UserInfoCard.propTypes = {
  createdByName: PropTypes.string,
  profilePic: PropTypes.string,
  isAnonymous: PropTypes.bool
}

export default memo(UserInfoCard)
