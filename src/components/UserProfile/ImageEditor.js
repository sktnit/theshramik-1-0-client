import React from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles'
import Slider from '@mui/material/Slider'
// import Icons from '../shared/Icons'
import { Button } from '@mui/material'
import AvatarEditor from 'react-avatar-editor'

const useStyles = makeStyles((theme) => ({
  cropperWraper: {
    position: 'absolute',
    top: 0,
    height: '100%',
    zIndex: 1
  },
  cropperWraperLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 1
  },
  cropperWraperChild: {
    position: 'relative',
    background: theme.palette.grey.grey11,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flexOne: {
    flex: 1
  },
  flexDirectionRow: {
    flexDirection: 'row-reverse'
  },
  justifyContentFlexEnd: {
    justifyContent: 'flex-end'
  },
  paddingLeftOne: {
    paddingLeft: theme.spacing(1)
  },
  displayFlex: {
    display: 'flex'
  },
  avatarEditor: {
    width: '200px',
    height: '200px',
    border: '0px',
    borderRadius: '50%'
  },
  divAlign: {
    display: 'flex',
    width: '100%',
    marginTop: '5px',
    paddingLeft: '10px',
    paddingRight: '10px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  divLabelAlign: {
    fontSize: '12px',
    marginRight: '10px',
    fontWeight: 600
  }
}))
function ImageEditor(props) {
  const classes = useStyles()
  const [zoom, setZoom] = React.useState(1)
  const [rotate, setRotate] = React.useState(0)
  const [editor, setEditor] = React.useState()
  const handleZoomSlider = (event, value) => {
    setZoom(value)
  }
  const handleSave = () => {
    if (editor)
      props.handleImageEditor('save', editor.getImage().toDataURL())
  }
  const handleCancel = () => {
    props.handleImageEditor('cancel')
  }
  const setEditorRef = (editor) => {
    setEditor(editor)
  }
  const rotateLeft = () => {
    setRotate(rotate - 90)
  }
  const rotateRight = () => {
    setRotate(rotate + 90)
  }
  return (
    <div className={props.align && props.align === 'left' ? classes.cropperWraperLeft : classes.cropperWraper} width={260}>
      <div className={classes.cropperWraperChild}>
        <AvatarEditor
          ref={setEditorRef}
          image={props.profilePic}
          width={260}
          height={260}
          border={0}
          className={[255, 255, 255, 0.6]}
          rotate={rotate}
          scale={zoom}
          crossOrigin={"anonymous"}
        />
        <div className={classes.divAlign} width={260}>
          <label className={classes.divLabelAlign}>Zoom</label>
          <Slider min={1} max={10} step={0.1} value={zoom} onChange={handleZoomSlider} style={{ width: 200 }}></Slider>
        </div>
        <div className={classes.divAlign} width={260}>
          <label className={`${classes.divLabelAlign} ${classes.flexOne}`}>Rotate</label>
          <div className={`${classes.flexOne} ${classes.flexDirectionRow} ${classes.displayFlex}`}>
            <span className={classes.paddingLeftOne}>
              <Button variant="primary" onClick={rotateRight}>
                Right
              </Button>
            </span>
            <Button variant="primary" onClick={rotateLeft}>
              Left
            </Button>
          </div>
        </div>
        <div className={`${classes.divAlign} ${classes.justifyContentFlexEnd}`}>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
            {/* <Icons.ARROW_RIGHT_ICON /> */}
          </Button>
        </div>
      </div>
    </div>
  )
}

ImageEditor.propTypes = {
  handleImageEditor: PropTypes.func,
  align: PropTypes.string,
  profilePic: PropTypes.string,

}

export default ImageEditor
