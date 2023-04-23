import * as React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'react-router-dom/Link'
import Editor from '../../../shared/editor/Editor'
import { BalloonEditor } from 'ckeditor5-build-balloon-and-classic/build/ckeditor.js'
import { MuiVisibilityTwoToneIcon } from '../../../constants/mui/MuiVisibilityTwoToneIcon'
import { MuiQuestionAnswerTwoToneIcon } from '../../../constants/mui/MuiQuestionAnswerTwoToneIcon'
import SlateEditorWrapper from '../../../shared/editor/Slate/SlateEditorWrapper'
import { DeserializeFromHtml } from '../../../shared/editor/Slate/utils'

const STORAGE_KEY = process.env.REACT_APP_CK_LICENSE_KEY
const EDITOR_TYPE = process.env.REACT_APP_EDITOR_TYPE

const balloonStyle = {
  padding: '0px 8px',
  borderRadius: '8px'
}

const useStyles = makeStyles((theme) => ({
  box: {
    flexGrow: 1
  },
  outerRelativeContainer: {
    position: 'relative',
    margin: '16px 0px',
    border: '0.5px solid #cccccc',
    borderRadius: '10px'
  },
  innerAbsoluteContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%'
  },
  myVoteAbsoluteContainer: {
    position: 'absolute',
    top: '-8px',
    left: '10px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '4px',
    padding: '1px 4px',
    zIndex: 1,
    color: theme.palette.white.white1
  },
  optionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 12px',
    height: '48px'
  },
  optionContainerNonProgress: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '0px 12px',
    height: '48px',
    float: 'right',
    width: '160px'
  },
  optionText: {
    color: '#252F37',
    fontWeight: 300,
    fontFamily: 'Poppins',
    fontSize: '14px',
    width: '65%',
    height: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    wordBreak: 'break-word',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 1
  },
  optionInfoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  optionVoteCount: {
    color: '#858585',
    padding: '0px 8px'
  },
  optionVotePercentage: {
    color: '#252F37',
    padding: '0px 8px'
  },
  pollSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '16px 0px',
    flexDirection: 'row'
  },
  openPollInfo: {
    color: theme.palette.primary.text,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  viewsCount: {
    color: theme.palette.primary.text,
    fontFamily: 'Rubik',
    fontWeight: theme.palette.fontWeight.Lite
  },
  commentsCount: {
    color: theme.palette.primary.text,
    fontFamily: 'Rubik',
    fontWeight: theme.palette.fontWeight.Lite
  },
  flexOne: {
    flex: 1
  },
  pollStat: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  statAlign: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '8px',
    paddingBottom: '8px',
    color: theme.palette.primary.text,
    '& .MuiSvgIcon-root': {
      fontSize: '16px'
    }
  },
  muiSvgIconRootFontSize: {
    '& .MuiSvgIcon-root': {
      fontSize: '24px'
    }
  },
  centerAlign: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  leadingOption: {
    backgroundColor: '#C6FCC4',
    border: '2px solid #2EB529',
    boxShadow: '0px 3px 6px #2EB52940'
  }
}))

export default function CustomizedProgressBars (props) {
  const classes = useStyles()
  const [maxIndexes, setMaxIndexes] = React.useState([])
  const { options, voteInfo, poll } = props
  const editorConfig = {
    licenseKey: STORAGE_KEY
  }
  React.useEffect(() => {
    if (options && options.length && poll.totalVotes) {
      const max = Math.max(...options.map((i) => i.votePercentage))
      const indexes = []
      for (let index = 0; index < options.length; index++) {
        if (options[index].votePercentage === max) {
          indexes.push(index)
        }
      }
      setMaxIndexes(indexes)
    }
  }, [options])

  const onEditorInit = (editor) => {
    editor.isReadOnly = true
  }

  return (
    <div className={classes.root}>
      <Box className={classes.box}>
        {options && options.length && options.map((el, index) =>
          <div key={`${el.id}-${index}`} className={classes.outerRelativeContainer} style={{ background: maxIndexes.includes(index) ? `linear-gradient(to right, #C6FCC4 ${el.votePercentage}%, #FFFFFF 0)` : el.voteCount ? `linear-gradient(to right, #C4D7FF ${el.votePercentage}%, #FFFFFF 0)` : '#FFFFFF' }}>
            {/** Non Progress */}
            {voteInfo && voteInfo.selectedOptionId && voteInfo.selectedOptionId.includes(el.id) && <div className={`${classes.myVoteAbsoluteContainer} ${props.isNonLoggedInView ? 'font-family-lite-16' : 'font-family-lite-11'}`}>My vote</div>}
            <div className={classes.optionContainerNonProgress}>
              <div className={classes.optionInfoContainer}>
                <div className={`${classes.optionVoteCount} ${props.isNonLoggedInView ? 'font-family-lite-18' : 'font-family-lite-12'}`}>{el.voteCount || 0} Votes</div>
                <div className={`${classes.optionVotePercentage} ${props.isNonLoggedInView ? 'font-family-semi-bold-24' : 'font-family-semi-bold-16'}`}>{el.votePercentage}%</div>
              </div>
            </div>
            <div className={`${props.isNonLoggedInView ? 'document-font-family-normal-22' : 'document-font-family-normal-15'}`}>
              <BalloonEditorView
                config={editorConfig}
                data={el.option ? el.option : el.icon ? `<figure class="image"><img src=${el.icon}></figure>` : ''}
                onInit={onEditorInit}
                disabled
              />
            </div>

            {/** With Progress */}
            {/* <BorderLinearProgress variant="determinate" value={el.votePercentage} max={maxIndexes.includes(index)} />
            {voteInfo && voteInfo.selectedOptionId && voteInfo.selectedOptionId.includes(el.id) && <div className={classes.myVoteAbsoluteContainer}>My vote</div>}
            <div className={classes.innerAbsoluteContainer}>
              <div className={classes.optionContainer}>
                <div ref={ref} className={classes.optionText}>
                  {el.option}
                </div>
                <div className={classes.optionInfoContainer}>
                  <div className={classes.optionVoteCount}>{el.voteCount || 0} Votes</div>
                  <div className={classes.optionVotePercentage}>{el.votePercentage}%</div>
                </div>
              </div>
            </div> */}

          </div>
        )}
        {!props.isPollInfo && <div className={classes.pollSummary}>
        {!props.isNonLoggedInView && <div className={`${classes.openPollInfo} font-family-normal-15`}><Link className={classes.noTextDecoration} to={`poll-info/${props.pollId}`}>Open &gt;</Link></div>}
          {/* <div>3d to go</div> */}
          <div className={classes.centerAlign}>
            <PollStat
              icon={<MuiVisibilityTwoToneIcon color="primary" />}
              isNonLoggedInView={props.isNonLoggedInView}
              count={props.poll.totalUniqueViewCount}
              text='Views'
            />
           </div>
           <PollStat
            icon={<MuiQuestionAnswerTwoToneIcon color="primary" />}
            isNonLoggedInView={props.isNonLoggedInView}
            count={props.poll.totalCommentCount}
            text='Comments'
           />
        </div>}
      </Box>
    </div>
  )
}

function BalloonEditorView (props) {
  return (
     <div id={`balloon-editor-view-${props.id}`}>
      {EDITOR_TYPE === 'CKEditor'
        ? <Editor
          editor={BalloonEditor} {...props}/>
        : <div id={`balloon-slate-document-${props.id}`} >
          <SlateEditorWrapper {...props} initialValue={DeserializeFromHtml(props.data)} toolbar="balloon" readOnly={true} editorStyle={balloonStyle} isSmallToolbar= {true} />
        </div>}
    </div>
  )
}

BalloonEditorView.propTypes = {
  data: PropTypes.any,
  id: PropTypes.any
}

CustomizedProgressBars.propTypes = {
  options: PropTypes.array,
  voteInfo: PropTypes.object,
  poll: PropTypes.object,
  isNonLoggedInView: PropTypes.bool,
  pollId: PropTypes.string,
  isPollInfo: PropTypes.bool
}

function PollStat (props) {
  const classes = useStyles()
  return (
    <div className={`${classes.pollStat}`}>
      <div className={`${classes.statAlign} ${props.isNonLoggedInView ? 'font-family-lite-19' : 'font-family-lite-13'} ${props.isNonLoggedInView ? classes.muiSvgIconRootFontSize : ''}`}>
        <spna className={classes.pollStat}>{props.icon}</spna>
        <spna className={`${classes.pollStat}`}>&nbsp;{`${props.count || 0}  ${props.text}`}</spna>
      </div>
    </div>
  )
}

PollStat.propTypes = {
  count: PropTypes.number,
  icon: PropTypes.element,
  isNonLoggedInView: PropTypes.bool,
  text: PropTypes.string
}
