import React, { memo } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Button from '@mui/material/Button'
import { FormattedMessage } from 'react-intl'
import Icons from '../../../constants/Icons'
import PollResult from './PollResult'
import cloneDeep from 'lodash/cloneDeep'
import constants from '../../../constants/constants'
import Link from 'react-router-dom/Link'
import Editor from '../../../shared/editor/Editor'
import { ClassicEditor, BalloonEditor } from 'ckeditor5-build-balloon-and-classic/build/ckeditor.js'
import * as moment from 'moment'
import { pollVoteCalculatePercentage } from '../../../shared/utils'
import httpHelper from '../../../shared/httpHelper'
import urlConstants from '../../../constants/urlConstants'
import helper from '../../../shared/helper'
import IconButton from '@mui/material/IconButton'
import Theme from '../../../theme'
import CustomLoadingButton from '../../shared/Button/CustomLoadingButton'
import SlateEditorWrapper from '../../../shared/editor/Slate/SlateEditorWrapper'
import { DeserializeFromHtml, serialize } from '../../../shared/editor/Slate/utils'

const STORAGE_KEY = process.env.REACT_APP_CK_LICENSE_KEY
const EDITOR_TYPE = process.env.REACT_APP_EDITOR_TYPE

const classicToolBarStyle = {
  backgroundColor: '#F5F5F5',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px'
}

const classicStyle = {
  padding: '0px 8px',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px'
}

const balloonStyle = {
  padding: '0px 8px',
  borderRadius: '8px'
}

const useStyles = makeStyles((theme) => ({
  options: {
    margin: '8px 0px'
  },
  option: {
    margin: '16px 0px',
    // padding: '12px',
    border: '0.5px solid #CCCCCC',
    borderRadius: '8px',
    color: theme.palette.primary.text,
    fontWeight: theme.palette.fontWeight.Lite,
    cursor: 'pointer',
    position: 'relative',
    '& .MuiOutlinedInput-input': {
      color: theme.palette.primary.text
    }
  },
  addOptionHover: {
    '&:hover': {
      backgroundColor: '#F5F5F5'
    }
  },
  optionNoPointer: {
    margin: '16px 0px',
    // padding: '12px',
    border: '0.5px solid #CCCCCC',
    borderRadius: '8px',
    color: theme.palette.primary.text
  },
  selectedOption: {
    border: '0.5px solid #3B7BFF',
    backgroundColor: '#F2F6FF',
    boxShadow: '0px 3px 6px #3b7bff66'
  },
  openPollInfo: {
    color: theme.palette.primary.text
  },
  votesUsed: {
    color: theme.palette.primary.text
  },
  submitBtnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '8px 0px',
    '& .MuiButton-containedPrimary': {
      color: theme.palette.white.white1,
      textTransform: 'none',
      borderRadius: '22px',
      marginLeft: '16px'
    }
  },
  arrowRightIcon: {
    fontSize: '24px !important'
  },
  largeArrowRightIcon: {
    fontSize: '36px !important'
  },
  pollSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '8px 0px'
  },
  document: {
    '& .ck.ck-reset_all *': {
      borderTopLeftRadius: '8px !important',
      borderTopRightRadius: '8px !important'
    },
    '& .ck.ck-editor__main>.ck-editor__editable.ck-rounded-corners': {
      borderBottomLeftRadius: '8px !important',
      borderBottomRightRadius: '8px !important'
    }
  },
  addOptionsContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '16px 0px'
  },
  addAnotherOption: {
    cursor: 'pointer',
    width: '100%',
    padding: '12px',
    border: '0.5px dashed #CCCCCC',
    borderRadius: '8px',
    color: theme.palette.grey.grey26,
    display: 'flex',
    alignItems: 'center'
  },
  addIcon: {
    marginRight: '16px'
  },
  closeIcon: {
    fontSize: '12px'
  }
}))

function PollOptions (props) {
  const classes = useStyles()
  const [resultOptions, setResultOptions] = React.useState([])
  const [optionsHoveredId, setOptionsHoveredId] = React.useState()
  const { options, state, voted, submitPollVoteCallback, voteInfo, poll } = props
  let newUri = httpHelper.getUri(urlConstants.uploadCKEditorImage)
  const params = [{ param: '{teamId}', value: helper.getDomain() }]
  for (const param of params) {
    newUri = newUri.replace(param.param, param.value)
  }
  const editorConfig = {
    removePlugins: ['RestrictedEditingMode', 'TrackChanges', 'Comments'],
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      '|',
      'fontSize',
      'fontFamily',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'alignment',
      'blockQuote',
      'bulletedList',
      'numberedList',
      '|',
      'link',
      'imageUpload',
      'mediaEmbed',
      'insertTable'
    ],
    // toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'indent', 'outdent', '|', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'],
    placeholder: 'Add your option here*',
    heading: {
      options: [
        { model: 'heading1', view: 'h2', title: 'Heading', class: 'ck-heading_heading2' },
        { model: 'paragraph', title: 'Normal text', class: 'ck-heading_paragraph' }
      ]
    },
    licenseKey: STORAGE_KEY,
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: process.env.REACT_APP_UPLOAD_API_URL + newUri,

      // Enable the XMLHttpRequest.withCredentials property.
      withCredentials: false,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        // 'X-CSRF-TOKEN': 'CSRF-Token',
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        // "Access-Control-Allow-Headers":
        //   "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        // "Access-Control-Allow-Credentials": true,
        Authorization: `Bearer ${props.currentSession && props.currentSession.idToken && props.currentSession.idToken.jwtToken}`
      }
    }
  }
  const [selectedOption, setSelectedOption] = React.useState([])
  const voteRequired = poll.isMultipleChoiceEnabled ? Number(poll.multipleChoiceValue) : 1

  const handleSelectOption = (id) => {
    if (props.addedOptionsArray ? (!props.addedOptionsArray.includes(id) && !(props.addedOptionsArray.length)) : true) {
      const selectedOptionCopy = cloneDeep(selectedOption)
      if (selectedOptionCopy.includes(id)) {
        const index = selectedOptionCopy.indexOf(id)
        if (index > -1) {
          selectedOptionCopy.splice(index, 1)
        }
      } else {
        if (selectedOption.length < voteRequired) {
          selectedOptionCopy.push(id)
        } else if (voteRequired === 1) {
          selectedOptionCopy.splice(0, 1)
          selectedOptionCopy.push(id)
        }
      }
      setSelectedOption(selectedOptionCopy)
    }
  }

  const onEditorInit = (editor) => {
    editor.isReadOnly = true
  }

  const handleAddOptionByOthersWrapper = () => {
    setSelectedOption([])
    props.handleAddOptionByOthers()
  }

  const onEditorDocumentChange = (data, index) => {
    try {
      let serializeData = ''
      data.forEach((el) => {
        serializeData = serializeData + serialize(el)
      })
      if (typeof serializeData === 'string') {
        props.handleOptionsText(serializeData, index)
      }
    } catch (e) {
      helper.handleUnauthorizedError(e)
      console.log('Error in onEditorInit', e)
    }
  }

  React.useEffect(() => {
    const pollInfo = pollVoteCalculatePercentage(poll)
    setResultOptions(pollInfo.options)
  }, [options])

  return (
    <div className={classes.root}>
      {!props.preview
        ? <>
        {!voted && ((poll.endTime > moment().unix() * 1000) || poll.continuous)
          ? <>
            <div className={classes.options}>
              {options && options.map((el, index) => <div key={`${el.id}-${index}`} onMouseOver={() => props.addedOptionsArray.includes(el.id) ? setOptionsHoveredId(el.id) : '' } onClick={() => handleSelectOption(el.id)} className={selectedOption.includes(el.id) ? `${classes.option} ${classes.selectedOption}` : `${classes.option}`}>
                <div className={`${classes.addOption} ${classes.flex2} ${EDITOR_TYPE === 'CKEditor' && classes.addOptionHover}`}>
                  <div id={`option-editor-${index}`} className={`${classes.document} ${props.isNonLoggedInView ? 'document-font-family-normal-22' : 'document-font-family-normal-15'}`} >
                  {optionsHoveredId === el.id && props.addedOptionsArray.includes(el.id)
                    ? <ClassicEditorView
                      id={el.id}
                      config={editorConfig}
                      data={el.option ? el.option : el.icon ? `<figure class="image"><img src=${el.icon}></figure>` : ''}
                      disabled={props.addedOptionsArray ? !props.addedOptionsArray.includes(el.id) : true}
                      onChange={(event, editor) => props.handleOptionsText(editor.getData(), index)}
                      onEditorDocumentChange={(data) => onEditorDocumentChange(data, index)}
                      />
                    : <BalloonEditorView
                        id={el.id}
                        config={editorConfig}
                        data={el.option ? el.option : el.icon ? `<figure class="image"><img src=${el.icon}></figure>` : ''}
                        disabled={props.addedOptionsArray ? !props.addedOptionsArray.includes(el.id) : true}
                        onChange={(event, editor) => props.handleOptionsText(editor.getData(), index)}
                      />}
                </div>
                </div>
                {props.addedOptionsArray && props.addedOptionsArray.includes(el.id) && <IconButton
                  aria-label="delete"
                  onClick={() => props.removeOption(index, el.id)}
                  sx={{
                    position: 'absolute',
                    right: '-8px',
                    top: '-8px',
                    color: Theme.palette.white.white1,
                    backgroundColor: Theme.palette.primary.main,
                    padding: '2px'
                  }}>
                  <Icons.CLOSE_ICON className={classes.closeIcon} />
                </IconButton>}
              </div>)}
            </div>
            {poll.canOthersAddOptions && props.allowToAddOptions &&
              <div className={classes.addOptionsContainer}>
                <div onClick={handleAddOptionByOthersWrapper} className={`${classes.addAnotherOption} ${props.isNonLoggedInView ? 'font-family-normal-22' : 'font-family-normal-15'}`}>
                  <Icons.ADD_ICON className={classes.addIcon} />
                  <div>Add another option</div>
                </div>
              </div>}
            {!props.isPollInfo && <div className={classes.pollSummary}>
              <div className={`${classes.openPollInfo} ${props.isNonLoggedInView ? 'font-family-normal-22' : 'font-family-normal-15'}`}>
              {!props.isNonLoggedInView && <Link className={classes.noTextDecoration} to={`poll-info/${props.pollId}`}>Open &gt;</Link>}
              </div>
              {/* <div>3d to go</div> */}
              <div className={`${classes.votesUsed} ${props.isNonLoggedInView ? 'font-family-normal-22' : 'font-family-normal-15'}`}>{selectedOption.length} of {voteRequired} votes used</div>
            </div>}
            {state === constants.POLL_STATE.CREATED &&
              <div className={classes.submitBtnContainer}>
                {props.addedOptionsArray && props.addedOptionsArray.length
                  ? <CustomLoadingButton
                    isShow={true}
                    isLarge ={props.isNonLoggedInView}
                    disabled={props.waitingForAPI}
                    handleClick={props.onSaveAddedOptions}
                    loading={props.waitingForAPI}
                    buttonText={<FormattedMessage id="saveButtonText" />}
                    iconColor={Theme.palette.white.white1}
                    iconType={'save'}
                    loadingPosition='start'
                    variant='contained'
                    buttonBackground={Theme.palette.primary.main}
                  />
                  // <Button disabled={props.waitingForAPI} endIcon={<Icons.ARROW_RIGHT_ICON className={classes.arrowRightIcon} />}>
                  //   <FormattedMessage id="saveButtonText" />
                  // </Button>
                  : <Button disabled={props.waitingForAPI || selectedOption.length === 0} onClick={() => submitPollVoteCallback(selectedOption)} variant="contained" color="primary" size="small" endIcon={<Icons.ARROW_RIGHT_ICON className={`${props.isNonLoggedInView ? classes.largeArrowRightIcon : classes.arrowRightIcon}`} />} className={`${props.isNonLoggedInView ? 'font-family-semi-bold-22' : 'font-family-semi-bold-15'}`}>
                    <FormattedMessage id="submitText" />
                  </Button>}
              </div>}
          </>
          : <PollResult isNonLoggedInView={props.isNonLoggedInView} isPollInfo={props.isPollInfo} pollId={props.pollId} options={resultOptions} voteInfo={voteInfo} poll={poll} />}
      </>
        : <>
          <div className={classes.options}>
            {options && options.map((el, index) => <div key={`${poll.pollIdCategoryId}-${index}`} className={`${classes.optionNoPointer} ${props.isNonLoggedInView ? 'document-font-family-normal-22' : 'document-font-family-normal-15'}`}>
              <BalloonEditorView
                id={el.id}
                config={editorConfig}
                data={el.option ? el.option : el.icon ? `<figure class="image"><img src=${el.icon}></figure>` : ''}
                onInit={onEditorInit}
                disabled
              />
            </div>)}
          </div>
        </>}
    </div>
  )
}

function ClassicEditorView (props) {
  return (
    <div id={`classic-editor-view-${props.id}`}>
      {EDITOR_TYPE === 'CKEditor'
        ? <Editor
          editor={ClassicEditor} {...props}/>
        : <div id={`classic-slate-document-${props.id}`} >
          <SlateEditorWrapper {...props} initialValue={DeserializeFromHtml(props.data)} toolbar="classic" editorStyle={classicStyle} isSmallToolbar= {true} editorToolBarStyle={classicToolBarStyle} />
        </div>}
    </div>
  )
}

ClassicEditorView.propTypes = {
  data: PropTypes.any,
  id: PropTypes.any
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

PollOptions.propTypes = {
  options: PropTypes.array,
  state: PropTypes.string,
  voted: PropTypes.bool,
  submitPollVoteCallback: PropTypes.func,
  voteInfo: PropTypes.object,
  currentSession: PropTypes.object,
  addedOptionsArray: PropTypes.array,
  poll: PropTypes.object,
  onSaveAddedOptions: PropTypes.any,
  pollId: PropTypes.string,
  removeOption: PropTypes.any,
  allowToAddOptions: PropTypes.any,
  handleOptionsText: PropTypes.func,
  handleAddOptionByOthers: PropTypes.func,
  preview: PropTypes.bool,
  isPollInfo: PropTypes.bool,
  waitingForAPI: PropTypes.bool,
  isNonLoggedInView: PropTypes.bool
}

export default memo(PollOptions)
