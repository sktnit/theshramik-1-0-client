import React, { memo } from 'react'
import PropTypes from 'prop-types'
import CardActions from '@mui/material/CardActions'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@mui/material/LinearProgress'
import { StartFlagIcon } from '../../../constants/svg/StartFlagIcon'
import { EndFlagIcon } from '../../../constants/svg/EndFlagIcon'
import { ContinuousIcon } from '../../../constants/svg/ContinuousIcon'
import * as moment from 'moment'

const useStyles = makeStyles((theme) => ({
  cardActions: {
    padding: '12px 8px !important',
    justifyContent: 'space-between',
    color: theme.palette.primary.text
  },
  cardActionsInfo: {
    paddingLeft: '0px !important',
    paddingRight: '0px !important'
  },
  daysToGo: {
    color: theme.palette.primary.main
  },
  linearProgressContainer: {
    '& .MuiLinearProgress-root': {
      height: '10px',
      borderRadius: '8px'
    }
  },
  marginLeft5: {
    marginLeft: 5
  },
  cardActionsInner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

function DateLinearProgress (props) {
  const classes = useStyles()
  return (
    <div>
      <CardActions className={`${classes.cardActions} ${props.isNonLoggedInView ? 'font-family-normal-22' : 'font-family-normal-15'} ${props.isPollInfo ? classes.cardActionsInfo : ''}`}>
        {props && !props.continuous
          ? <div className={classes.cardActionsInner}>
            <div><StartFlagIcon width={props.isNonLoggedInView ? '19.0815' : '12.721'} height={props.isNonLoggedInView ? '19.5' : '13'} />&nbsp;{moment(props.startTime).format('h:mm DD MMM')}</div>
            <span className={classes.daysToGo}>{moment(props.endTime).diff(moment(), 'days') > 0 && <div>{moment(props.endTime).diff(moment(), 'days')}d to go</div>}</span>
            <div><EndFlagIcon width={props.isNonLoggedInView ? '19.5' : '13'} height={props.isNonLoggedInView ? '19.5' : '13'} />&nbsp;{moment(props.endTime).format('h:mm DD MMM')}</div>
          </div>
          : <div className={classes.cardActionsInner}>
            <div><StartFlagIcon width={props.isNonLoggedInView ? '19.0815' : '12.721'} height={props.isNonLoggedInView ? '19.5' : '13'} />&nbsp;{moment(props.startTime).format('h:mm DD MMM')}</div>
            <div>
              <ContinuousIcon />
              <span className={classes.marginLeft5}>Continuous</span>
            </div>
          </div>}

      </CardActions>
      {props && !props.continuous &&
        <div className={`${props.isPollInfo ? classes.linearProgressContainer : ''}`}>
          <LinearProgress color="primary" variant="determinate" value={moment(props.endTime).diff(moment(), 'days') > 0 ? ((moment().diff(props.startTime, 'days') / moment(props.endTime).diff(moment(props.startTime), 'days')) * 100) : 100} />
        </div>}
    </div>
  )
}
DateLinearProgress.propTypes = {
  startTime: PropTypes.number,
  endTime: PropTypes.number,
  isPollInfo: PropTypes.bool,
  isNonLoggedInView: PropTypes.bool,
  continuous: PropTypes.bool
}

export default memo(DateLinearProgress)
