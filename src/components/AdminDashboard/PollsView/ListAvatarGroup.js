import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'

function ListAvatarGroup (props) {
  return (
    <div>
      <AvatarGroup>
        {props.list && props.list.map((el, index) => <Avatar key={index} title={el.createdByName} alt={el.createdByName} src={el.creatorImage} />)}
      </AvatarGroup>
    </div>
  )
}
ListAvatarGroup.propTypes = {
  list: PropTypes.array
}

export default memo(ListAvatarGroup)
