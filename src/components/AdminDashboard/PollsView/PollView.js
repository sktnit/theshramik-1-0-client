import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import ImageView from './ImageView'
import PropTypes from 'prop-types'
import UserInfoCard from './UserInfoCard'
import ListAvatarGroup from './ListAvatarGroup'
import DateLinearProgress from './DateLinearProgress'
import PollOptions from './PollOptions'
import { MuiVisibilityTwoToneIcon } from '../../../constants/mui/MuiVisibilityTwoToneIcon'
import { MuiHowToVoteTwoToneIcon } from '../../../constants/mui/MuiHowToVoteTwoToneIcon'
import { MuiQuestionAnswerTwoToneIcon } from '../../../constants/mui/MuiQuestionAnswerTwoToneIcon'
import { MuiShareTwoToneIcon } from '../../../constants/mui/MuiShareTwoToneIcon'
import { MuiMailTwoToneIcon } from '../../../constants/mui/MuiMailTwoToneIcon'
import { Translate } from 'react-auto-translate'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  commentViewRoot: {
    width: '100%'
  },
  imageView: {
    marginTop: '8px',
    marginBottom: '8px'
  },
  tagChip: {
    color: theme.palette.primary.text,
    backgroundColor: theme.palette.grey.grey27,
    border: 0,
    height: 17,
    borderRadius: 4,
    margin: '0 8px 8px 0',
    fontFamily: 'rubik',
    '& .MuiChip-label': {
      paddingLeft: '4px',
      paddingRight: '4px'
    }
  },
  title: {
    marginBottom: '4px'
  },
  userInfoCard: {
    marginBottom: '4px'
  },
  description: {
    color: theme.palette.primary.text,
    marginBottom: '16px'
  },
  dateLinearProgress: {
    paddingTop: '8px',
    paddingBottom: '8px'
  },
  leftAlgin: {
    paddingRight: '16px'
  },
  statAlign: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '8px',
    paddingBottom: '8px',
    color: theme.palette.primary.text,
    '& .MuiTypography-body1': {
      fontFamily: 'Rubik'
    },
    '& .MuiSvgIcon-root': {
      fontSize: '16px'
    }
  },
  shareAlgin: {
    '& .MuiSvgIcon-root': {
      fontSize: '22px'
    }
  },
  shareIcon: {
    '& .MuiSvgIcon-root': {
      fontSize: '14px'
    }
  },
  shareText: {
    color: theme.palette.primary.text,
    paddingLeft: '4px',
    paddingRight: '8px'
  },
  flexOne: {
    flex: '1'
  },
  statText: {
    paddingBottom: '8px',
    height: '28px',
    color: theme.palette.primary.text
  },
  rightAlgin: {
    paddingLeft: '16px'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  flexColumnCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  listAvatarGroup: {
    paddingTop: '8px',
    paddingBottom: '8px'
  }
}))

function PollView (props) {
  const classes = useStyles()
  return (
    <div className={classes.commentViewRoot}>
      <Container>
        <div>
          <Grid container>
            <Grid item xs={12} sm={12} md={6} className={`${classes.leftAlgin}`}>
              <Grid item xs={12}>
                {props.pollInfo.Item.tags && props.pollInfo.Item.tags.length > 0 && props.pollInfo.Item.tags.map((tag, tId) => (
                  <Chip key={tId} label={tag} variant="outlined" className={`${classes.tagChip} font-family-lite-14`} />
                ))}
              </Grid>
              <Grid item xs={12} className={`${classes.title} font-family-semi-bold-24`}>
                {props.pollInfo.Item.title}
              </Grid>
              <Grid item xs={12} className={classes.userInfoCard}>
                <UserInfoCard isAnonymous={props.pollInfo.Item.isAnonymous} profilePic={props.pollInfo.Item.isAnonymous ? '' : props.pollInfo.Item.creatorImage} createdByName={props.pollInfo.Item.isAnonymous ? 'Anonymous' : props.pollInfo.Item.createdByName || props.pollInfo.Item.address} />
              </Grid>
              <Grid item xs={12} className={`${classes.description} font-family-normal-15`}>
                {props.pollInfo.Item.description}
              </Grid>
              <Grid item xs={12} className={classes.imageView}>
                <ImageView
                  src={props.pollInfo.Item.thumbnailUrl}
                  uploadFrom={props.pollInfo.Item.uploadFrom}
                  unsplashImageCredit={props.pollInfo.Item.unsplashImageCredit}
                  unsplashImageUserName={props.pollInfo.Item.unsplashImageUserName}
                />
              </Grid>
              <Grid item xs={12} className={classes.dateLinearProgress}>
                <DateLinearProgress isPollInfo={true} continuous={props.pollInfo.Item.continuous} endTime={props.pollInfo.Item.endTime} startTime={props.pollInfo.Item.startTime} />
              </Grid>
              <Grid item xs={12} >
                <div className={classes.statAlign}>
                  <PollStat
                    icon={<MuiVisibilityTwoToneIcon color="primary" />}
                    count={props.pollInfo.Item.totalUniqueViewCount }
                    text='Views'
                  />
                  <PollStat
                    icon={<MuiHowToVoteTwoToneIcon color="primary" />}
                    count={props.pollInfo.Item.totalVotes}
                    text='Votes'
                  />
                  <PollStat
                    icon={<MuiQuestionAnswerTwoToneIcon color="primary" />}
                    count={props.pollInfo.Item.totalCommentCount}
                    text='Comments'
                  />
                </div>
              </Grid>
              <Grid item xs={12} className={classes.listAvatarGroup}>
                <ListAvatarGroup list={props.pollInfo.voterList} />
              </Grid>
              <Grid item xs={12} className={classes.shareAlgin}>
                <div className={`${classes.flexRow} ${classes.flexOne}`}>
                  <span className={`${classes.flexRow} ${classes.shareIcon}`}>
                    <span className={classes.flexColumnCenter}><MuiShareTwoToneIcon color="primary" /></span>
                    <span className={`${classes.flexColumnCenter} ${classes.shareText} font-family-lite-15`}>Share</span>
                  </span>
                  <span className={classes.flexColumnCenter} onClick={() => props.handleInvite('email')}><MuiMailTwoToneIcon color="primary" /></span>
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} className={`${classes.rightAlgin}`}>
              <Grid item xs={12} className={`${classes.description} font-family-normal-15`}>
                1 vote per person
              </Grid>
              <PollOptions isPollInfo={true} options={props.pollInfo.Item.options} state={props.pollInfo.Item.state} poll={props.pollInfo.Item} voted={props.pollInfo.voteInfo && Object.keys(props.pollInfo.voteInfo) && Object.keys(props.pollInfo.voteInfo).length} voteInfo={props.pollInfo.voteInfo} submitPollVoteCallback={(selectedOption) => props.submitPollVoteCallback(props.pollId, selectedOption)} waitingForAPI={props.waitingForAPI} handleAddOptionByOthers={props.handleAddOptionByOthers} removeOption={props.removeOption} handleOptionsText={props.handleOptionsText} onSaveAddedOptions={props.onSaveAddedOptions} addedOptionsArray={props.addedOptionsArray} allowToAddOptions={true} />
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  )
}
function PollStat (props) {
  const classes = useStyles()
  return (
    <div className={classes.flexOne}>
      <Typography className={`${classes.statText} font-family-bold-24`}>
        <Translate>{props.count || 0}</Translate>
      </Typography>
      <div className={`${classes.statAlign} font-family-lite-12`}>
        {props.icon}
        &nbsp;{props.text}
      </div>
    </div>
  )
}

PollStat.propTypes = {
  count: PropTypes.number,
  icon: PropTypes.element,
  text: PropTypes.string
}
PollView.propTypes = {
  pollInfo: PropTypes.object,
  submitPollVoteCallback: PropTypes.func,
  pollId: PropTypes.string,
  waitingForAPI: PropTypes.bool,
  handleAddOptionByOthers: PropTypes.func,
  handleOptionsText: PropTypes.func,
  onSaveAddedOptions: PropTypes.func,
  removeOption: PropTypes.func,
  handleInvite: PropTypes.func,
  addedOptionsArray: PropTypes.array
}

export default memo(PollView)
